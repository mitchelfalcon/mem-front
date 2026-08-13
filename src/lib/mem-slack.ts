export const MEM_AWU_TX = "AWU-SEDE-NORTE-50";
export const MEM_HOSPITAL_ID = "001xx000003DGw2AAG";
export const SLACK_TEAM_ID = "T06E6HP8A2W";
export const SLACK_CHANNEL = "D0BNHUA8R7D";
export const SLACK_CLIENT_URL = `https://app.slack.com/client/${SLACK_TEAM_ID}/${SLACK_CHANNEL}`;

export type KnowledgePayload = {
  source: string;
  searchTerm: string;
  protocoloSanitarioRag: string;
  articles: { id: string; title: string; filename: string }[];
  camasUciDisponibles: number;
  porcentajeMetricaTanh: number;
  auqScore: number;
  statusEjecucion: string;
};

export type TracePayload = {
  source: string;
  hospitalId: string;
  actor: string;
  note: string;
  auditId: string;
  auq: number;
  brake: boolean;
  dpHash: string;
  privacy: string;
  event: string;
};

export type SlackCanvasPayload = {
  ok?: boolean;
  canvas_id?: string | null;
  op?: string;
  error?: string;
  channel?: string;
  clientUrl?: string;
  canvasUrl?: string | null;
};

export type ChatStartResponse = {
  ok: boolean;
  tx: string;
  hospitalId?: string;
  channel?: string;
  teamId?: string;
  clientUrl?: string;
  classes?: { name: string; filename: string; bytes: number }[];
  knowledge?: KnowledgePayload;
  trace?: TracePayload;
  approveUrl?: string;
  rejectUrl?: string;
  slack?: {
    ok?: boolean;
    posted?: boolean;
    channel?: string;
    ts?: string;
    error?: string;
    reason?: string;
    clientUrl?: string;
    canvasUrl?: string | null;
    canvas?: SlackCanvasPayload;
    uploads?: { filename: string; ok: boolean; error?: string; reason?: string }[];
  };
  salesforce?: {
    ok?: boolean;
    reason?: string;
    classes?: { name: string; ok: boolean; op?: string; error?: string }[];
  };
  error?: string;
};

export type AuthorizeResponse = {
  ok: boolean;
  tx: string;
  action: "APPROVE" | "REJECT";
  body?: string;
  proxied?: boolean;
  reason?: string;
  error?: string;
  channel?: string;
  clientUrl?: string;
  canvas?: SlackCanvasPayload;
};

export async function startHeraSession(tx = MEM_AWU_TX): Promise<ChatStartResponse> {
  const response = await fetch("/api/mem/chat/start", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ tx, hospitalId: MEM_HOSPITAL_ID, beds: 50 }),
  });
  return (await response.json()) as ChatStartResponse;
}

export async function authorizeAwu(
  action: "APPROVE" | "REJECT",
  tx = MEM_AWU_TX,
): Promise<AuthorizeResponse> {
  const response = await fetch(
    `/api/mem/authorize?tx=${encodeURIComponent(tx)}&action=${action}`,
    { headers: { Accept: "application/json" } },
  );
  return (await response.json()) as AuthorizeResponse;
}

export type SlackThreadMessage = {
  ts: string;
  user: string;
  bot?: boolean;
  kind?: "text" | "hitl";
  text: string;
  knowledge?: KnowledgePayload;
  trace?: TracePayload;
  tx?: string;
  approveUrl?: string;
  rejectUrl?: string;
  local?: boolean;
};

export type SlackConversationResponse = {
  ok: boolean;
  channel: string;
  teamId?: string;
  clientUrl?: string;
  posted?: boolean;
  reason?: string;
  messages: SlackThreadMessage[];
  error?: string;
};

export async function fetchSlackConversation(): Promise<SlackConversationResponse> {
  const response = await fetch("/api/mem/slack/conversation", {
    headers: { Accept: "application/json" },
  });
  return (await response.json()) as SlackConversationResponse;
}

export type HeraReplyResponse = {
  ok: boolean;
  intent?: string;
  items?: ChatItemLike[];
  session?: ChatStartResponse | null;
  error?: string;
};

type ChatItemLike = Record<string, unknown>;

export async function fetchHeraThread(): Promise<HeraReplyResponse> {
  const response = await fetch("/api/mem/chat/thread", { headers: { Accept: "application/json" } });
  return (await response.json()) as HeraReplyResponse;
}

export async function replyHera(text: string): Promise<HeraReplyResponse> {
  const response = await fetch("/api/mem/chat/reply", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ text }),
  });
  return (await response.json()) as HeraReplyResponse;
}
