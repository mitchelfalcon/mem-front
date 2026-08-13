import dotenv from "dotenv";

dotenv.config();

const HOSPITAL_ID = "001xx000003DGw2AAG";
const DEFAULT_TX = "AWU-SEDE-NORTE-50";
const DEFAULT_CHANNEL = "#urgencias-epidemiologia";

const APPROVE_BODY =
  '["ÉXITO": "AWU Aprobada por Director Médico. 50 Camas UCI Bloqueadas en red."]';
const REJECT_BODY =
  '["RECHAZADO": "Alerta epidemiológica descartada. Se mantiene protocolo estacional."]';

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function publicBase(req) {
  const envUrl = process.env.APP_URL?.replace(/\/$/, "");
  if (envUrl) return envUrl;
  const proto = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000";
  return `${proto}://${host}`;
}

function salesforceAuthorizeUrl(tx, action) {
  const instance = process.env.SF_INSTANCE_URL?.replace(/\/$/, "");
  if (!instance) return null;
  const path = process.env.SF_AUTHORIZE_PATH || "/services/apexrest/mem/v1/authorize/";
  const url = new URL(path, `${instance}/`);
  url.searchParams.set("tx", tx);
  url.searchParams.set("action", action);
  return url.toString();
}

async function callSalesforceAuthorize(tx, action) {
  const url = salesforceAuthorizeUrl(tx, action);
  if (!url) {
    return {
      ok: true,
      proxied: false,
      reason: "SF_INSTANCE_URL no configurada",
      body: action === "APPROVE" ? APPROVE_BODY : REJECT_BODY,
    };
  }

  const headers = { Accept: "application/json, text/plain;q=0.9,*/*;q=0.8" };
  if (process.env.SF_ACCESS_TOKEN) {
    headers.Authorization = `Bearer ${process.env.SF_ACCESS_TOKEN}`;
  }

  const response = await fetch(url, { method: "GET", headers });
  const body = await response.text();
  return {
    ok: response.ok,
    proxied: true,
    status: response.status,
    url,
    body: body || (action === "APPROVE" ? APPROVE_BODY : REJECT_BODY),
  };
}

function alertBlocks({ tx, approveUrl, rejectUrl }) {
  return [
    {
      type: "header",
      text: { type: "plain_text", text: "🚨 ALERTA EPIDEMIOLÓGICA – SEDE NORTE", emoji: true },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*Notas:* 1,247 · *Riesgo:* Endemia Respiratoria (p90 = 87.05%)\n" +
          "*Confianza_AUQ:* 0.985 / Umbral: 0.999 · *Freno tanh:* ACTIVO · *Camas libres:* 18/100\n" +
          `*Hospital:* \`${HOSPITAL_ID}\` · *tx:* \`${tx}\``,
      },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          style: "primary",
          text: { type: "plain_text", text: "Sí, Apartar 50 Camas UCI", emoji: true },
          url: approveUrl,
        },
        {
          type: "button",
          text: { type: "plain_text", text: "Rechazar", emoji: true },
          url: rejectUrl,
        },
      ],
    },
  ];
}

async function postSlackAlert({ tx, approveUrl, rejectUrl }) {
  const token = process.env.SLACK_BOT_TOKEN;
  const channel = process.env.SLACK_CHANNEL || DEFAULT_CHANNEL;
  const blocks = alertBlocks({ tx, approveUrl, rejectUrl });
  const text =
    "🚨 ALERTA EPIDEMIOLÓGICA – SEDE NORTE. ¿Autoriza el apartado de 50 camas UCI?";

  if (!token) {
    return {
      ok: false,
      posted: false,
      reason: "SLACK_BOT_TOKEN no configurado",
      channel,
      blocks,
    };
  }

  const response = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ channel, text, blocks, unfurl_links: false }),
  });
  const data = await response.json();
  return {
    ok: Boolean(data.ok),
    posted: Boolean(data.ok),
    channel,
    ts: data.ts,
    error: data.error,
    blocks,
  };
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      if (!chunks.length) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

export async function memApiMiddleware(req, res, next) {
  const url = new URL(req.url || "/", "http://localhost");

  if (req.method === "POST" && url.pathname === "/api/mem/slack/alert") {
    try {
      const body = await readJsonBody(req);
      const tx = String(body.tx || DEFAULT_TX);
      const base = publicBase(req);
      const approveUrl = `${base}/api/mem/authorize?tx=${encodeURIComponent(tx)}&action=APPROVE`;
      const rejectUrl = `${base}/api/mem/authorize?tx=${encodeURIComponent(tx)}&action=REJECT`;
      const slack = await postSlackAlert({ tx, approveUrl, rejectUrl });
      sendJson(res, slack.ok || !process.env.SLACK_BOT_TOKEN ? 200 : 502, {
        ok: slack.ok,
        tx,
        hospitalId: HOSPITAL_ID,
        approveUrl,
        rejectUrl,
        slack,
      });
    } catch (error) {
      sendJson(res, 500, { ok: false, error: String(error?.message || error) });
    }
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/mem/authorize") {
    try {
      const tx = url.searchParams.get("tx") || DEFAULT_TX;
      const action = (url.searchParams.get("action") || "REJECT").toUpperCase();
      const result = await callSalesforceAuthorize(tx, action === "APPROVE" ? "APPROVE" : "REJECT");
      const wantsJson = String(req.headers.accept || "").includes("application/json");
      if (wantsJson) {
        sendJson(res, result.ok ? 200 : 502, { ok: result.ok, tx, action, ...result });
        return;
      }
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(`<!doctype html>
<html lang="es">
  <head><meta charset="utf-8" /><title>MEM AWU</title>
  <style>body{font-family:Segoe UI,sans-serif;background:#f3f3f3;color:#03234d;padding:2rem;max-width:40rem;margin:auto}</style>
  </head>
  <body>
    <h1>${action === "APPROVE" ? "AWU aprobada" : "Alerta rechazada"}</h1>
    <p>${result.body.replace(/[<>]/g, "")}</p>
    <p style="color:#747474;font-size:12px">tx=${tx}${result.proxied ? " · Salesforce" : " · local"}</p>
  </body>
</html>`);
    } catch (error) {
      sendJson(res, 500, { ok: false, error: String(error?.message || error) });
    }
    return;
  }

  next();
}
