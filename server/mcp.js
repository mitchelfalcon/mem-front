import { randomUUID } from "crypto";

const SERVER_NAME = "memhealthcare";
const SERVER_VERSION = "1.0.0";
const PROTOCOL_VERSION = "2025-03-26";
const IDENTITY_URL = process.env.HEROKU_IDENTITY_URL || "https://id.heroku.com";
const SCOPE = process.env.HEROKU_OAUTH_SCOPE || "global";

function publicBase(req) {
  const envUrl = process.env.APP_URL?.replace(/\/$/, "") || process.env.HEROKU_MCP_SERVER_URL?.replace(/\/$/, "");
  if (envUrl) return envUrl;
  const proto = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost:3000";
  return `${proto}://${host}`;
}

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Authorization, Content-Type, MCP-Protocol-Version, mcp-session-id, Last-Event-ID",
  );
  res.setHeader("Access-Control-Expose-Headers", "mcp-session-id, MCP-Protocol-Version");
}

function sendJson(res, status, payload, sessionId) {
  cors(res);
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("MCP-Protocol-Version", PROTOCOL_VERSION);
  if (sessionId) res.setHeader("mcp-session-id", sessionId);
  res.end(JSON.stringify(payload));
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

const TOOLS = [
  {
    name: "mem_health",
    description: "Comprueba que el Heroku MCP Server memhealthcare está vivo.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "mem_server_info",
    description: "Devuelve el nombre MCP (memhealthcare, sin guiones), URL y canal HITL de Slack.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
];

function rpcResult(id, result) {
  return { jsonrpc: "2.0", id: id ?? null, result };
}

function rpcError(id, code, message) {
  return { jsonrpc: "2.0", id: id ?? null, error: { code, message } };
}

async function handleRpc(message, req) {
  const { id, method, params } = message || {};
  if (method === "initialize") {
    return rpcResult(id, {
      protocolVersion: PROTOCOL_VERSION,
      capabilities: { tools: { listChanged: false } },
      serverInfo: { name: SERVER_NAME, version: SERVER_VERSION, title: "Heroku MCP Server" },
    });
  }
  if (method === "notifications/initialized" || method === "notifications/cancelled") {
    return null;
  }
  if (method === "ping") return rpcResult(id, {});
  if (method === "tools/list") return rpcResult(id, { tools: TOOLS });
  if (method === "tools/call") {
    const name = params?.name;
    if (name === "mem_health") {
      return rpcResult(id, {
        content: [{ type: "text", text: JSON.stringify({ ok: true, server: SERVER_NAME, status: "ok" }) }],
      });
    }
    if (name === "mem_server_info") {
      const info = {
        name: SERVER_NAME,
        description: "Heroku MCP Server",
        serverUrl: `${publicBase(req)}/`,
        mcpUrl: `${publicBase(req)}/mcp`,
        identityProviderUrl: IDENTITY_URL,
        scope: SCOPE,
        authenticationMethod: "OAuth 2.0",
        slackChannel: process.env.SLACK_CHANNEL || "D0BNHUA8R7D",
      };
      return rpcResult(id, { content: [{ type: "text", text: JSON.stringify(info, null, 2) }] });
    }
    return rpcError(id, -32601, `Unknown tool: ${name}`);
  }
  if (method === "resources/list") return rpcResult(id, { resources: [] });
  if (method === "prompts/list") return rpcResult(id, { prompts: [] });
  return rpcError(id, -32601, `Method not found: ${method}`);
}

function isMcpPath(pathname) {
  return (
    pathname === "/mcp" ||
    pathname === "/mcp/" ||
    pathname === "/.well-known/oauth-protected-resource" ||
    pathname === "/.well-known/oauth-authorization-server"
  );
}

export async function mcpMiddleware(req, res, next) {
  const url = new URL(req.url || "/", "http://localhost");
  const pathname = url.pathname;
  const isRootMcpPost = req.method === "POST" && pathname === "/";

  if (!isMcpPath(pathname) && !isRootMcpPost) {
    next();
    return;
  }

  cors(res);
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (pathname === "/.well-known/oauth-protected-resource") {
    const resource = `${publicBase(req)}/`;
    sendJson(res, 200, {
      resource,
      authorization_servers: [IDENTITY_URL],
      scopes_supported: [SCOPE],
      bearer_methods_supported: ["header"],
    });
    return;
  }

  if (pathname === "/.well-known/oauth-authorization-server") {
    sendJson(res, 200, {
      issuer: IDENTITY_URL,
      authorization_endpoint: `${IDENTITY_URL}/oauth/authorize`,
      token_endpoint: `${IDENTITY_URL}/oauth/token`,
      response_types_supported: ["code"],
      grant_types_supported: ["authorization_code", "refresh_token", "client_credentials"],
      token_endpoint_auth_methods_supported: ["client_secret_basic", "client_secret_post"],
      scopes_supported: [SCOPE],
    });
    return;
  }

  if (req.method === "GET") {
    sendJson(res, 200, {
      name: SERVER_NAME,
      description: "Heroku MCP Server",
      protocolVersion: PROTOCOL_VERSION,
      transport: "streamable-http",
    });
    return;
  }

  if (req.method === "DELETE") {
    res.statusCode = 204;
    cors(res);
    res.end();
    return;
  }

  if (req.method !== "POST") {
    next();
    return;
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    sendJson(res, 400, rpcError(null, -32700, "Parse error"));
    return;
  }

  const sessionId = req.headers["mcp-session-id"] || randomUUID();
  const messages = Array.isArray(body) ? body : [body];
  const responses = [];
  for (const message of messages) {
    if (!message || typeof message !== "object") continue;
    const result = await handleRpc(message, req);
    if (result) responses.push(result);
  }

  if (!responses.length) {
    res.statusCode = 202;
    cors(res);
    res.setHeader("mcp-session-id", sessionId);
    res.end();
    return;
  }

  sendJson(res, 200, responses.length === 1 ? responses[0] : responses, sessionId);
}
