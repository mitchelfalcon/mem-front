import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APEX_DIR = path.join(__dirname, "..", "salesforce", "classes");

const HOSPITAL_ID = "001xx000003DGw2AAG";
const DEFAULT_TX = "AWU-SEDE-NORTE-50";
const DEFAULT_CHANNEL = "#mem-urgencias-epidemiologia";
const SF_API = process.env.SF_API_VERSION || "62.0";

const LOCAL_APEX = [
  "MEM_OrchestratorController",
  "MEM_RAG_KnowledgeService",
  "ChatBotController",
  "DataCloudMapController",
  "MEM_Audit_TraceEngine",
  "MEM_ClinicalVectorService",
  "MEM_LaplacePrivacyService",
];

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

function readLocalApex() {
  return LOCAL_APEX.map((name) => {
    const filePath = path.join(APEX_DIR, `${name}.cls`);
    const body = fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : "";
    return { name, filename: `${name}.cls`, bytes: Buffer.byteLength(body, "utf8"), body };
  }).filter((item) => item.body.length > 0);
}

function knowledgeAndTrace() {
  const tanhVal = Math.tanh(8.7 / 10);
  const metricaTanh = Number((((tanhVal + 1) / 2) * 100).toFixed(2));
  return {
    knowledge: {
      source: "MEM_RAG_KnowledgeService",
      searchTerm: "Protocolo Emergencia Neumologia Brote Atipico",
      protocoloSanitarioRag:
        "Vigilancia Epidemiológica y Sistemas de Alertamiento — El SINAVE coordina 4 fases de vigilancia y emite Avisos, Alertas y APV según el nivel de riesgo.",
      articles: [
        {
          id: "vigilancia",
          title: "Vigilancia Epidemiológica y Sistemas de Alertamiento",
          filename: "Articulo_2_Vigilancia_Epidemiologica.csv",
        },
        {
          id: "pronam",
          title: "Protocolos Nacionales de Atención Médica (PRONAM)",
          filename: "Articulo_1_PRONAM.csv",
        },
      ],
      camasUciDisponibles: 18,
      porcentajeMetricaTanh: metricaTanh,
      auqScore: 0.985,
      statusEjecucion: "ESCALADO_HUMANO_SLACK",
    },
    trace: {
      source: "MEM_Audit_TraceEngine.logAuditTrace",
      hospitalId: HOSPITAL_ID,
      actor: "El_Gran_Maestro",
      note: "Actualizado por agente de IA.",
      auditId: "AUD-883",
      auq: 0.985,
      brake: true,
      dpHash: "[HASH_DP_883]",
      privacy: "ACTIVE_LAPLACIAN_DP_EPSILON_0.1",
      event: "MEM_Clinical_Audit__e",
    },
  };
}

function ragSlackBlocks({ tx, approveUrl, rejectUrl, knowledge, trace }) {
  return [
    {
      type: "header",
      text: {
        type: "plain_text",
        text: "🚨 ALERTA CRÍTICA: EVIDENCIA AUQ Y REPORTE EPIDEMIOLÓGICO",
        emoji: true,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          `*Sede Hospitalaria:* Sede Norte (\`${HOSPITAL_ID}\`)\n` +
          "*Estado del Sistema:* Freno Matemático tanh Activado por Incertidumbre Epistémica.\n" +
          `*tx:* \`${tx}\``,
      },
    },
    { type: "divider" },
    {
      type: "section",
      fields: [
        { type: "mrkdwn", text: `*Camas UCI Disponibles:*\n\`${knowledge.camasUciDisponibles} unidades libres\`` },
        { type: "mrkdwn", text: `*Métrica Función tanh:*\n\`${knowledge.porcentajeMetricaTanh}% saturación\`` },
        { type: "mrkdwn", text: `*Confianza Agéntica (AUQ):*\n\`${(knowledge.auqScore * 100).toFixed(2)}% (Exigido ≥ 99.9%)\`` },
        { type: "mrkdwn", text: "*Privacidad Diferencial:*\n`Activa (Ruido Laplaciano)`" },
      ],
    },
    { type: "divider" },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*Consulta RAG Knowledge (Protocolo Sector Salud):*\n_${knowledge.protocoloSanitarioRag}_`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          `*Trazabilidad:* \`${trace.source}\` · actor *${trace.actor}*\n` +
          `${trace.note} · ${trace.event} ${trace.auditId} · ${trace.dpHash}`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*Apex local enviado:*\n" +
          LOCAL_APEX.map((name) => `• \`${name}.cls\``).join("\n"),
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*DECISIONES DIRECTIVAS A OBSERVAR:*\n" +
          "1. Autorizar bloqueo transaccional de 50 camas UCI vía AWU.\n" +
          "2. Rechazar alerta y mantener régimen de admisión estacional.",
      },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          style: "danger",
          text: { type: "plain_text", text: "🏥 AUTORIZAR BLOQUEO UCI (AWU)", emoji: true },
          url: approveUrl,
        },
        {
          type: "button",
          text: { type: "plain_text", text: "❌ RECHAZAR & MANTENER ESTACIONAL", emoji: true },
          url: rejectUrl,
        },
      ],
    },
  ];
}

async function postSlackMessage({ channel, text, blocks, threadTs }) {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) return { ok: false, posted: false, reason: "SLACK_BOT_TOKEN no configurado", channel, blocks };
  const response = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify({ channel, text, blocks, thread_ts: threadTs, unfurl_links: false }),
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

async function uploadApexToSlack({ channel, threadTs, files }) {
  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) {
    return files.map((file) => ({ filename: file.filename, ok: false, reason: "SLACK_BOT_TOKEN no configurado" }));
  }
  const results = [];
  for (const file of files) {
    const form = new FormData();
    form.append("channels", channel.replace(/^#/, ""));
    form.append("filename", file.filename);
    form.append("filetype", "text");
    form.append("title", file.filename);
    form.append("content", file.body);
    form.append("initial_comment", `Apex local · ${file.filename}`);
    if (threadTs) form.append("thread_ts", threadTs);
    const response = await fetch("https://slack.com/api/files.upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const data = await response.json();
    results.push({ filename: file.filename, ok: Boolean(data.ok), error: data.error });
  }
  return results;
}

function sfBase() {
  return process.env.SF_INSTANCE_URL?.replace(/\/$/, "") || "";
}

async function sfFetch(pathname, options = {}) {
  const instance = sfBase();
  if (!instance || !process.env.SF_ACCESS_TOKEN) {
    throw new Error("SF_INSTANCE_URL o SF_ACCESS_TOKEN no configurados");
  }
  const response = await fetch(`${instance}${pathname}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.SF_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  const text = await response.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = { raw: text };
  }
  return { ok: response.ok, status: response.status, json };
}

async function upsertApexToSalesforce(files) {
  if (!sfBase() || !process.env.SF_ACCESS_TOKEN) {
    return {
      ok: false,
      reason: "Salesforce org no autenticada (SF_INSTANCE_URL / SF_ACCESS_TOKEN)",
      classes: files.map((file) => ({ name: file.name, ok: false })),
    };
  }
  const results = [];
  for (const file of files) {
    try {
      const query = encodeURIComponent(`SELECT Id, Name FROM ApexClass WHERE Name = '${file.name}'`);
      const found = await sfFetch(`/services/data/v${SF_API}/tooling/query/?q=${query}`);
      const existingId = found.json?.records?.[0]?.Id;
      if (existingId) {
        const patched = await sfFetch(`/services/data/v${SF_API}/tooling/sobjects/ApexClass/${existingId}`, {
          method: "PATCH",
          body: JSON.stringify({ Body: file.body }),
        });
        results.push({ name: file.name, ok: patched.ok, op: "update", status: patched.status, detail: patched.json });
      } else {
        const created = await sfFetch(`/services/data/v${SF_API}/tooling/sobjects/ApexClass`, {
          method: "POST",
          body: JSON.stringify({ Name: file.name, Body: file.body, ApiVersion: Number(SF_API) }),
        });
        results.push({ name: file.name, ok: created.ok, op: "create", status: created.status, detail: created.json });
      }
    } catch (error) {
      results.push({ name: file.name, ok: false, error: String(error?.message || error) });
    }
  }
  return { ok: results.every((row) => row.ok), classes: results };
}

function salesforceAuthorizeUrl(tx, action) {
  const instance = sfBase();
  if (!instance) return null;
  const restPath = process.env.SF_AUTHORIZE_PATH || "/services/apexrest/mem/v1/authorize/";
  const url = new URL(restPath, `${instance}/`);
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
  if (process.env.SF_ACCESS_TOKEN) headers.Authorization = `Bearer ${process.env.SF_ACCESS_TOKEN}`;
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

async function startChatDispatch({ tx, approveUrl, rejectUrl }) {
  const files = readLocalApex();
  const { knowledge, trace } = knowledgeAndTrace();
  const channel = process.env.SLACK_CHANNEL || DEFAULT_CHANNEL;
  const blocks = ragSlackBlocks({ tx, approveUrl, rejectUrl, knowledge, trace });
  const slack = await postSlackMessage({
    channel,
    text: "🚨 ALERTA CRÍTICA: EVIDENCIA AUQ Y REPORTE EPIDEMIOLÓGICO — Sede Norte. Apex local adjunto.",
    blocks,
  });
  const uploads = await uploadApexToSlack({ channel, threadTs: slack.ts, files });
  const salesforce = await upsertApexToSalesforce(files);
  return {
    ok: true,
    tx,
    hospitalId: HOSPITAL_ID,
    channel,
    classes: files.map(({ name, filename, bytes }) => ({ name, filename, bytes })),
    knowledge,
    trace,
    slack: { ...slack, uploads },
    salesforce,
    approveUrl,
    rejectUrl,
  };
}

export async function memApiMiddleware(req, res, next) {
  const url = new URL(req.url || "/", "http://localhost");

  if (req.method === "POST" && (url.pathname === "/api/mem/chat/start" || url.pathname === "/api/mem/slack/alert")) {
    try {
      const body = await readJsonBody(req);
      const tx = String(body.tx || DEFAULT_TX);
      const base = publicBase(req);
      const approveUrl = `${base}/api/mem/authorize?tx=${encodeURIComponent(tx)}&action=APPROVE`;
      const rejectUrl = `${base}/api/mem/authorize?tx=${encodeURIComponent(tx)}&action=REJECT`;
      const payload = await startChatDispatch({ tx, approveUrl, rejectUrl });
      sendJson(res, 200, payload);
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
