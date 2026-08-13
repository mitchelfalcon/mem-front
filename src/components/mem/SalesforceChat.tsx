import { Fragment, type FormEvent, type KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2, Minus, Send, X } from "lucide-react";
import chatIcon from "../../assets/slds-chat/chat.svg";
import endChatIcon from "../../assets/slds-chat/end-chat.svg";
import doctypeImageIcon from "../../assets/slds-chat/doctype-image.svg";
import downloadIcon from "../../assets/slds-chat/download.svg";
import warningIcon from "../../assets/slds-chat/warning.svg";
import drArmando from "../../assets/dr-armando.png";
import avatar from "../../assets/avatar.png";
import {
  HERA_EMPTY_TRANSCRIPT,
  KNOWLEDGE_DOWNLOADS,
  type ChatItem,
  type ChatText,
  type KnowledgeDownloadId,
} from "../../data/hera-chat";
import { mutePresentationAudio } from "../../pages/Presentation";
import { authorizeAwu, fetchHeraThread, replyHera, type ChatStartResponse } from "../../lib/mem-slack";

const AVATARS: Record<string, string> = {
  "Director Médico": avatar,
  "Dr. Mike": drArmando,
};

function SldsIcon({ src, size = 16, alt = "" }: { src: string; size?: number; alt?: string }) {
  return (
    <span className="inline-flex shrink-0 overflow-clip" style={{ width: size, height: size }} aria-hidden={alt ? undefined : true}>
      <img src={src} alt={alt} width={size} height={size} className="h-full w-full object-contain" />
    </span>
  );
}

function AgentAvatar({ size, typing = false }: { size: number; typing?: boolean }) {
  return (
    <span className="relative shrink-0" style={{ width: size, height: size }}>
      <span
        className={`flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#03234d] text-white ${
          typing ? "hera-avatar-typing" : ""
        }`}
        style={{ fontSize: Math.max(9, Math.round(size * 0.34)), fontWeight: 700 }}
      >
        {typing ? (
          <span className="flex items-center gap-0.5 px-1">
            <span className="hera-dot" />
            <span className="hera-dot" />
            <span className="hera-dot" />
          </span>
        ) : (
          "AH"
        )}
      </span>
      <span
        className={`absolute bottom-0 right-0 rounded-full border-2 border-white ${
          typing ? "bg-amber-400" : "bg-[#2e844a]"
        }`}
        style={{ width: size * 0.28, height: size * 0.28 }}
      />
    </span>
  );
}

function TypingBubble() {
  return (
    <li className="hera-msg-in flex flex-col items-end">
      <div className="flex items-center gap-1 rounded-[12px] rounded-br-none bg-[#03234d] px-3 py-2.5">
        <span className="hera-dot" />
        <span className="hera-dot" />
        <span className="hera-dot" />
      </div>
      <p className="pt-0.5 text-[10px] leading-[14px] text-[#747474]">Agente HERA • escribiendo</p>
    </li>
  );
}

async function downloadKnowledgeCsv(id: KnowledgeDownloadId) {
  const asset = KNOWLEDGE_DOWNLOADS[id];
  const response = await fetch(asset.href);
  if (!response.ok) throw new Error(`No se pudo descargar ${asset.filename}`);
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = asset.filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function useKnowledgeDownload() {
  const [status, setStatus] = useState<"idle" | "downloading" | "done">("idle");

  const start = async (id: KnowledgeDownloadId) => {
    if (status === "downloading") return;
    setStatus("downloading");
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 480));
      await downloadKnowledgeCsv(id);
      setStatus("done");
      window.setTimeout(() => setStatus("idle"), 1800);
    } catch {
      setStatus("idle");
    }
  };

  return { status, start };
}

function initialsBubble(name: string, initials?: string) {
  const letters =
    initials ??
    name
      .split(" ")
      .filter((p) => p[0] && p[0] === p[0].toUpperCase())
      .map((p) => p[0])
      .join("")
      .slice(0, 2);
  return letters || "??";
}

function Bookend({ item }: { item: Extract<ChatItem, { kind: "bookend" }> }) {
  return (
    <li className="flex justify-center px-2">
      <div className="flex max-w-[92%] items-center justify-center gap-1.5 rounded-full border border-[#c9c9c9] bg-white px-3 py-1 text-center">
        <SldsIcon src={item.icon === "end" ? endChatIcon : chatIcon} size={14} />
        <p className="text-[12px] leading-4 text-[#2e2e2e]">
          {item.label ? (
            item.label
          ) : (
            <>
              {item.prefix}
              {item.name && <span className="font-semibold">{item.name}</span>}
              {item.suffix}
            </>
          )}
        </p>
      </div>
    </li>
  );
}

function InboundMessage({
  item,
  consecutive,
  hideMeta,
}: {
  item: ChatText;
  consecutive: boolean;
  hideMeta: boolean;
}) {
  const photo = item.avatar ?? AVATARS[item.name];
  return (
    <li className={`hera-msg-in flex items-end gap-2 ${consecutive ? "-mt-1.5" : ""}`}>
      <span className={`h-8 w-8 shrink-0 overflow-hidden rounded-full bg-[#f3f3f3] text-[11px] font-semibold leading-8 text-[#2e2e2e] ${consecutive ? "invisible" : ""}`}>
        {photo ? (
          <img src={photo} alt="" className="h-8 w-8 object-cover" />
        ) : (
          <span className="flex h-full w-full items-center justify-center">{initialsBubble(item.name, item.initials)}</span>
        )}
      </span>
      <div className="min-w-0 max-w-[min(100%,20.5rem)] flex-1">
        <div className="rounded-[12px] rounded-bl-none bg-[#f3f3f3] px-2 py-2">
          <p className="break-words text-[13px] leading-[18px] text-[#2e2e2e]">{item.text}</p>
        </div>
        {!hideMeta && (
          <p className="pt-0.5 text-[10px] leading-[14px] text-[#747474]">
            {item.name} • {item.time}
          </p>
        )}
      </div>
    </li>
  );
}

function OutboundMessage({
  item,
  consecutive,
  hideMeta,
  otherAgent = false,
}: {
  item: ChatText;
  consecutive: boolean;
  hideMeta: boolean;
  otherAgent?: boolean;
}) {
  return (
    <li className={`hera-msg-in flex flex-col items-end ${consecutive ? "-mt-1.5" : ""}`}>
      <div
        className={`max-w-[min(100%,20.5rem)] rounded-[12px] rounded-br-none px-2 py-2 ${
          otherAgent ? "bg-[#757575]" : "bg-[#03234d]"
        }`}
      >
        <p className="break-words text-[13px] leading-[18px] text-white">{item.text}</p>
      </div>
      {!hideMeta && (
        <p className="pt-0.5 text-[10px] leading-[14px] text-[#747474]">
          {item.name} • {item.time}
        </p>
      )}
    </li>
  );
}

function FileMessage({ item }: { item: Extract<ChatItem, { kind: "file" }> }) {
  const outbound = item.direction === "outbound";
  const { status, start } = useKnowledgeDownload();
  const busy = status === "downloading";
  const done = status === "done";

  return (
    <li className={`flex ${outbound ? "justify-end" : "items-end gap-2"}`}>
      {!outbound && <span className="h-8 w-8 shrink-0" />}
      <div className="min-w-0 max-w-[min(100%,20.5rem)]">
        <button
          type="button"
          onClick={() => void start(item.downloadId)}
          disabled={busy}
          aria-label={`Descargar ${item.filename}`}
          className={`flex w-full items-center gap-2 rounded-[12px] border border-[#c9c9c9] bg-white px-2 py-2 text-left transition hover:border-[#0250d9] hover:bg-[#f8fafc] disabled:opacity-70 ${
            outbound ? "rounded-br-none" : "rounded-bl-none"
          }`}
        >
          <SldsIcon src={doctypeImageIcon} size={28} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold leading-[18px] text-[#03234d]">{item.filename}</p>
            <p className="text-[12px] leading-4 text-[#2e2e2e]">
              {busy ? "Descargando…" : done ? "Descargado" : item.subtitle}
            </p>
          </div>
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3f3f3] text-[#0250d9]">
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : done ? (
              <Check className="h-4 w-4 text-[#2e844a]" />
            ) : (
              <SldsIcon src={downloadIcon} size={16} />
            )}
          </span>
        </button>
        <p className={`pt-0.5 text-[10px] leading-[14px] text-[#747474] ${outbound ? "text-right" : ""}`}>
          {item.name} • {item.time}
        </p>
      </div>
    </li>
  );
}

function FieldsCard({ item }: { item: Extract<ChatItem, { kind: "fields" }> }) {
  return (
    <li className="flex justify-end">
      <div className="w-full max-w-[min(100%,20.5rem)] overflow-hidden rounded-[12px] rounded-br-none border border-[#c9c9c9] bg-white">
        <ul className="divide-y divide-[#e5e5e5]">
          {item.items.map((row) => (
            <li key={`${row.object}-${row.detail}`} className="flex items-baseline justify-between gap-3 px-2.5 py-1.5">
              <span className="truncate font-mono text-[11px] leading-4 text-[#03234d]">{row.object}</span>
              <span className="shrink-0 text-right text-[11px] leading-4 text-[#747474]">{row.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

function SlackAction({
  action,
  children,
  variant,
  disabled,
  onDecided,
}: {
  action: "APPROVE" | "REJECT";
  children: string;
  variant: "primary" | "secondary";
  disabled?: boolean;
  onDecided: (action: "APPROVE" | "REJECT", body: string, ok: boolean, clientUrl?: string) => void;
}) {
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");

  const onClick = async () => {
    if (status === "working" || disabled) return;
    setStatus("working");
    try {
      const result = await authorizeAwu(action);
      setStatus(result.ok ? "done" : "error");
      onDecided(action, result.body || result.error || "", result.ok, result.clientUrl);
    } catch {
      setStatus("error");
      onDecided(action, "No se pudo contactar MEM_SlackApprovalService", false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void onClick()}
      disabled={disabled || status === "working" || status === "done"}
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition disabled:opacity-70 ${
        variant === "primary"
          ? "bg-[#03234d] text-white hover:bg-[#053a7a]"
          : "border border-[#c9c9c9] font-medium text-[#747474] hover:border-[#03234d] hover:text-[#03234d]"
      }`}
    >
      {status === "working" ? <Loader2 className="h-3 w-3 animate-spin" /> : status === "done" ? <Check className="h-3 w-3" /> : null}
      {status === "working" ? "Enviando a Salesforce…" : status === "done" ? "Registrado" : children}
    </button>
  );
}

function SlackCard({ time, session }: { time: string; session: ChatStartResponse | null }) {
  const [decision, setDecision] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const knowledge = session?.knowledge;
  const slack = session?.slack;
  const channel = session?.channel || slack?.channel || "D0BNHUA8R7D";
  const clientUrl =
    session?.clientUrl || slack?.clientUrl || slack?.canvas?.clientUrl || `https://app.slack.com/client/T06E6HP8A2W/${channel}`;
  const canvasUrl = slack?.canvasUrl || slack?.canvas?.canvasUrl;

  let header = `MEM Healthcare — Gran Maestro AUQ · ${channel}`;
  if (!session) header = "Publicando Apex local y alerta AUQ en Slack…";
  else if (slack?.posted) header = `Alerta y canvas actualizados en ${channel}`;
  else if (slack?.reason) header = `${slack.reason} · mensaje RAG listo`;
  else if (slack?.error) header = slack.error;

  return (
    <li className="flex justify-end">
      <div className="w-full max-w-[min(100%,20.5rem)]">
        <div className="overflow-hidden rounded-[12px] rounded-br-none border border-[#8c4b02] bg-white">
          <div className="flex items-start gap-2 border-b border-[#f3e5d7] bg-[#fff8f0] px-2.5 py-2">
            <SldsIcon src={warningIcon} size={16} />
            <p className="text-[12px] font-semibold leading-4 text-[#8c4b02]">{header}</p>
          </div>
          <div className="space-y-2 px-2.5 py-2">
            <p className="text-[13px] font-semibold leading-[18px] text-[#2e2e2e]">
              🚨 ALERTA CRÍTICA: EVIDENCIA AUQ Y REPORTE EPIDEMIOLÓGICO
            </p>
            <p className="text-[13px] leading-[18px] text-[#2e2e2e]">
              Sede Norte · Freno tanh activo por incertidumbre epistémica.
              <br />
              Camas UCI: {knowledge?.camasUciDisponibles ?? 18} libres · tanh {knowledge?.porcentajeMetricaTanh ?? 88.05}% · AUQ{" "}
              {((knowledge?.auqScore ?? 0.985) * 100).toFixed(2)}% (exigido ≥ 99.9%)
            </p>
            <p className="text-[12px] leading-4 text-[#2e2e2e]">
              RAG: {knowledge?.protocoloSanitarioRag ?? "Consultando Knowledge…"}
            </p>
            {!session && (
              <p className="flex items-center gap-1.5 text-[11px] text-[#747474]">
                <Loader2 className="h-3 w-3 animate-spin" /> Enviando Apex local a Slack y Salesforce…
              </p>
            )}
            {session?.classes && (
              <p className="text-[11px] leading-4 text-[#747474]">
                Apex local: {session.classes.map((item) => item.filename).join(", ")}
              </p>
            )}
            <p className="text-[11px] leading-4 text-[#747474]">
              Canal HITL:{" "}
              <a href={clientUrl} target="_blank" rel="noreferrer" className="font-semibold text-[#0176d3] underline">
                {channel}
              </a>
              {canvasUrl ? (
                <>
                  {" · "}
                  <a href={canvasUrl} target="_blank" rel="noreferrer" className="font-semibold text-[#0176d3] underline">
                    mismo canvas
                  </a>
                </>
              ) : (
                " · mismo canvas y mismas acciones"
              )}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <SlackAction
                action="APPROVE"
                variant="primary"
                disabled={locked}
                onDecided={(_action, body, _ok, decisionUrl) => {
                  setLocked(true);
                  setDecision(
                    `${body}${decisionUrl ? ` · canvas actualizado en ${channel}` : " · mismas acciones en el canvas HITL"}`,
                  );
                }}
              >
                AUTORIZAR BLOQUEO UCI (AWU)
              </SlackAction>
              <SlackAction
                action="REJECT"
                variant="secondary"
                disabled={locked}
                onDecided={(_action, body, _ok, decisionUrl) => {
                  setLocked(true);
                  setDecision(
                    `${body}${decisionUrl ? ` · canvas actualizado en ${channel}` : " · mismas acciones en el canvas HITL"}`,
                  );
                }}
              >
                RECHAZAR Y MANTENER ESTACIONAL
              </SlackAction>
            </div>
            {decision && <p className="break-words text-[12px] leading-4 text-[#03234d]">{decision}</p>}
          </div>
        </div>
        <p className="pt-0.5 text-right text-[10px] leading-[14px] text-[#747474]">Gran Maestro AUQ • {time}</p>
      </div>
    </li>
  );
}

function KnowledgeCard({ session }: { session: ChatStartResponse | null }) {
  const knowledge = session?.knowledge;
  return (
    <li className="flex justify-end">
      <div className="w-full max-w-[min(100%,20.5rem)] overflow-hidden rounded-[12px] rounded-br-none border border-[#c9c9c9] bg-white">
        <div className="border-b border-[#e5e5e5] bg-[#f3f3f3] px-2.5 py-2">
          <p className="text-[13px] font-semibold leading-[18px] text-[#03234d]">Knowledge · RAG</p>
          <p className="text-[10px] leading-[14px] text-[#747474]">{knowledge?.source ?? "MEM_RAG_KnowledgeService"}</p>
        </div>
        <div className="space-y-1.5 px-2.5 py-2 text-[12px] leading-4 text-[#2e2e2e]">
          <p>{knowledge?.protocoloSanitarioRag ?? "Cargando protocolo sanitario…"}</p>
          <p className="text-[#747474]">Búsqueda: {knowledge?.searchTerm ?? "—"}</p>
          <p>Estado: {knowledge?.statusEjecucion ?? "ESCALADO_HUMANO_SLACK"}</p>
          <p>Camas UCI disponibles: {knowledge?.camasUciDisponibles ?? "—"}</p>
        </div>
      </div>
    </li>
  );
}

function AuditCard({ time, session }: { time: string; session: ChatStartResponse | null }) {
  const trace = session?.trace;
  const rows = [
    ["Trace", trace?.source ?? "MEM_Audit_TraceEngine.logAuditTrace"],
    ["Audit Record ID", trace?.auditId ?? "AUD-883"],
    ["Actor", trace?.actor ?? "El_Gran_Maestro"],
    ["Hospital", trace?.hospitalId ?? "001xx000003DGw2AAG"],
    ["AUQ", String(trace?.auq ?? 0.985)],
    ["Freno tanh", String(trace?.brake ?? true)],
    ["Evento", trace?.event ?? "MEM_Clinical_Audit__e"],
    ["Firma DP", trace?.dpHash ?? "[HASH_DP_883]"],
    ["Privacidad", trace?.privacy ?? "ACTIVE_LAPLACIAN_DP_EPSILON_0.1"],
    ["Nota", trace?.note ?? "Actualizado por agente de IA."],
  ];
  return (
    <li className="flex justify-end">
      <div className="w-full max-w-[min(100%,20.5rem)]">
        <div className="overflow-hidden rounded-[12px] rounded-br-none border border-[#c9c9c9] bg-white">
          <div className="flex items-center gap-2 border-b border-[#e5e5e5] bg-[#f3f3f3] px-2.5 py-2">
            <SldsIcon src={doctypeImageIcon} size={22} />
            <div className="min-w-0">
              <p className="text-[13px] font-semibold leading-[18px] text-[#03234d]">Trazabilidad</p>
              <p className="text-[10px] leading-[14px] text-[#747474]">{trace?.source ?? "MEM_Audit_TraceEngine"} · {trace?.auditId ?? "AUD-883"}</p>
            </div>
          </div>
          <dl className="divide-y divide-[#e5e5e5]">
            {rows.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-3 px-2.5 py-1.5">
                <dt className="truncate font-mono text-[11px] text-[#03234d]">{k}</dt>
                <dd className="shrink-0 text-right text-[11px] text-[#2e2e2e]">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="pt-0.5 text-right text-[10px] leading-[14px] text-[#747474]">Agente HERA • {time}</p>
      </div>
    </li>
  );
}

function isSameSpeaker(a: ChatItem | undefined, b: ChatItem | undefined) {
  return (
    !!a &&
    !!b &&
    (a.kind === "inbound" || a.kind === "outbound") &&
    a.kind === b.kind &&
    a.name === b.name
  );
}

function Transcript({
  items,
  session,
  typing = false,
}: {
  items: ChatItem[];
  session: ChatStartResponse | null;
  typing?: boolean;
}) {
  return (
    <ul className="flex flex-col gap-3 px-3 py-3">
      {items.map((item, index) => {
        const grouped = isSameSpeaker(items[index - 1], item);
        const hideMeta = isSameSpeaker(item, items[index + 1]);
        return (
          <Fragment key={index}>
            {item.kind === "bookend" && <Bookend item={item} />}
            {item.kind === "file" && <FileMessage item={item} />}
            {item.kind === "fields" && <FieldsCard item={item} />}
            {item.kind === "knowledge" && <KnowledgeCard session={session} />}
            {item.kind === "slack" && <SlackCard time={item.time} session={session} />}
            {item.kind === "audit" && <AuditCard time={item.time} session={session} />}
            {item.kind === "inbound" && (
              <InboundMessage item={item} consecutive={grouped} hideMeta={hideMeta} />
            )}
            {item.kind === "outbound" && (
              <OutboundMessage item={item} consecutive={grouped} hideMeta={hideMeta} />
            )}
          </Fragment>
        );
      })}
      {typing && <TypingBubble />}
    </ul>
  );
}

function formatNow() {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function SalesforceChat() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [draft, setDraft] = useState("");
  const [items, setItems] = useState<ChatItem[]>(HERA_EMPTY_TRANSCRIPT);
  const [session, setSession] = useState<ChatStartResponse | null>(null);
  const [typing, setTyping] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const titleId = useId();
  const panelId = useId();
  const visible = open && !minimized;

  useEffect(() => {
    sessionStorage.removeItem("mem-hera-session");
  }, []);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    void fetchHeraThread().then((data) => {
      if (cancelled) return;
      if (Array.isArray(data.items) && data.items.length) setItems(data.items as ChatItem[]);
      if (data.session) setSession(data.session);
    });
    return () => {
      cancelled = true;
    };
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [visible, items.length, session, typing]);

  useEffect(() => {
    if (!visible) return;
    inputRef.current?.focus();
  }, [visible]);

  useEffect(() => {
    if (!open && !minimized) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setMinimized(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, minimized]);

  const close = () => {
    setOpen(false);
    setMinimized(false);
  };

  const toggle = () => {
    if (visible) {
      close();
      return;
    }
    setMinimized(false);
    setOpen(true);
    mutePresentationAudio();
  };

  const send = async (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || typing) return;
    setDraft("");
    setTyping(true);
    setItems((prev) => [
      ...prev,
      {
        kind: "inbound",
        name: "Director Médico",
        initials: "DM",
        time: formatNow(),
        text,
      },
    ]);
    try {
      const started = Date.now();
      const result = await replyHera(text);
      const wait = Math.max(0, 700 - (Date.now() - started));
      if (wait) await new Promise((resolve) => window.setTimeout(resolve, wait));
      if (Array.isArray(result.items)) setItems(result.items as ChatItem[]);
      if (result.session) setSession(result.session);
    } catch {
      setItems((prev) => [
        ...prev,
        {
          kind: "outbound",
          name: "Agente HERA",
          time: formatNow(),
          text: "No pude contactar el orquestador HERA. Reintenta el mensaje.",
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const onComposerKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <>
      {minimized && !visible && (
        <div className="fixed bottom-[calc(3.15rem+env(safe-area-inset-bottom,0px))] left-2 z-[60] w-[min(100vw-1rem,20rem)] overflow-hidden rounded-t-lg border border-[#c9c9c9] border-b-0 bg-white shadow-[0_-8px_24px_rgba(3,35,77,0.12)] sm:left-6">
          <button
            type="button"
            onClick={() => {
              setMinimized(false);
              setOpen(true);
            }}
            className="flex w-full items-center gap-2 px-3 py-2 text-left hover:bg-[#f3f3f3]"
          >
            <span className="relative h-6 w-6 shrink-0">
              <AgentAvatar size={24} typing={typing} />
            </span>
            <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-[#03234d]">Agente HERA</span>
            <span className="text-[10px] text-[#747474]">{typing ? "Escribiendo…" : "En línea"}</span>
          </button>
        </div>
      )}

      <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="hera-chat-shell fixed bottom-[calc(3.15rem+env(safe-area-inset-bottom,0px))] left-2 z-[60] h-[min(34rem,calc(100dvh-7.5rem))] w-[min(100vw-1rem,25rem)] shadow-[0_-12px_32px_rgba(3,35,77,0.18)] sm:left-6"
        >
          <div className="hera-chat-shell-spin" aria-hidden="true" />
        <section
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          className="relative z-10 flex h-full w-full flex-col overflow-hidden rounded-t-[12px] bg-white"
        >
          <header className="flex shrink-0 items-center gap-2 border-b border-[#e5e5e5] bg-white px-3 py-2">
            <AgentAvatar size={32} typing={typing} />
            <div className="min-w-0 flex-1">
              <h2 id={titleId} className="truncate text-[13px] font-semibold leading-[18px] text-[#03234d]">
                Chat · Agente HERA
              </h2>
              <p className="text-[10px] leading-[14px] text-[#747474]">
                {typing ? "Escribiendo…" : "MEM Healthcare · En línea"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setMinimized(true);
              }}
              className="flex h-7 w-7 items-center justify-center rounded text-[#706e6b] hover:bg-[#f3f3f3]"
              aria-label="Minimizar chat"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={close}
              className="flex h-7 w-7 items-center justify-center rounded text-[#706e6b] hover:bg-[#f3f3f3]"
              aria-label="Cerrar chat"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div ref={scrollerRef} className="min-h-0 flex-1 overflow-y-auto bg-white">
            <Transcript items={items} session={session} typing={typing} />
          </div>

          <form onSubmit={(e) => void send(e)} className="shrink-0 border-t border-[#e5e5e5] bg-white px-2 py-2">
            <div className="flex items-end gap-1.5 rounded-md border border-[#c9c9c9] bg-white px-2 py-1.5 focus-within:border-[#0250d9]">
              <textarea
                ref={inputRef}
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onComposerKey}
                disabled={typing}
                placeholder={typing ? "HERA está escribiendo…" : "Escribe un mensaje…"}
                aria-label="Escribe un mensaje"
                className="max-h-24 min-h-[22px] flex-1 resize-none bg-transparent text-[13px] leading-[18px] text-[#2e2e2e] outline-none placeholder:text-[#747474]"
              />
              <button
                type="submit"
                disabled={typing || !draft.trim()}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-[#0250d9] disabled:text-[#c9c9c9]"
                aria-label="Enviar"
              >
                {typing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
          </form>
        </section>
        </motion.div>
      )}
      </AnimatePresence>

      <button
        type="button"
        onClick={toggle}
        aria-expanded={visible}
        aria-controls={visible ? panelId : undefined}
        className={`relative min-w-0 shrink-0 rounded-md px-1.5 py-1 text-center text-[10px] uppercase tracking-wide transition-colors sm:px-3 sm:text-[13px] sm:normal-case sm:tracking-normal ${
          open || minimized ? "font-semibold text-mem-navy" : "font-medium text-slate-600 hover:text-mem-navy"
        }`}
      >
        <span className="inline-flex items-center justify-center gap-1">
          <SldsIcon src={chatIcon} size={16} />
          <span>CHAT</span>
        </span>
        {(open || minimized) && (
          <span className="absolute -bottom-[4px] left-2 right-2 h-[3px] rounded-full bg-mem-blue sm:-bottom-[6px] sm:left-3 sm:right-3" />
        )}
      </button>
    </>
  );
}
