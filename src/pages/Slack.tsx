import { type FormEvent, useEffect, useRef, useState } from "react";
import { Hash, Loader2, Send } from "lucide-react";
import { ConsoleLayout } from "../components/mem/ConsoleLayout";
import { VideoStage } from "../components/mem/VideoStage";
import {
  SLACK_CHANNEL,
  SLACK_CLIENT_URL,
  authorizeAwu,
  fetchSlackConversation,
  postSlackComposer,
  type SlackThreadMessage,
} from "../lib/mem-slack";

export function Slack() {
  const [messages, setMessages] = useState<SlackThreadMessage[]>([]);
  const [channel, setChannel] = useState(SLACK_CHANNEL);
  const [reason, setReason] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [decision, setDecision] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const load = async () => {
    const data = await fetchSlackConversation();
    setChannel(data.channel || SLACK_CHANNEL);
    setReason(data.reason || null);
    setMessages(data.messages || []);
  };

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), 8000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages, decision]);

  const send = async (event: FormEvent) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;
    setBusy(true);
    setDraft("");
    try {
      const result = await postSlackComposer(text);
      if (result.message) setMessages((prev) => [...prev, result.message!]);
      else await load();
    } finally {
      setBusy(false);
    }
  };

  return (
    <ConsoleLayout defaultSidebar="apps" bleed>
      <VideoStage videoId="1217019861" title="MEM Healthcare — Slack" immersive contentClassName="h-full">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-transparent" />
        <div className="relative flex h-full overflow-hidden pt-3 pr-3 pb-3 pl-sidebar">
          <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden rounded-2xl border border-white/50 bg-white shadow-2xl">
            <aside className="flex w-[min(16rem,38%)] shrink-0 flex-col bg-[#3f0e40] text-white">
              <div className="border-b border-white/10 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">Complemento Slack</p>
                <p className="text-sm font-bold">MEM Healthcare</p>
              </div>
              <div className="px-3 py-3">
                <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-wide text-white/45">Mensajes directos</p>
                <div className="flex items-center gap-2 rounded-lg bg-[#1164a3] px-2 py-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span className="truncate text-sm font-semibold">{channel}</span>
                </div>
              </div>
              <a
                href={SLACK_CLIENT_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-auto border-t border-white/10 px-4 py-3 text-[11px] text-white/70 hover:text-white"
              >
                Abrir en Slack →
              </a>
            </aside>

            <section className="flex min-w-0 flex-1 flex-col bg-white">
              <header className="flex items-center gap-2 border-b border-slate-200 px-4 py-3">
                <Hash className="h-4 w-4 text-slate-400" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[#1d1c1d]">{channel}</p>
                  <p className="truncate text-[11px] text-slate-500">
                    HITL AUQ · {reason || "conversación en vivo en Heroku"}
                  </p>
                </div>
              </header>

              <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
                {messages.map((message) => (
                  <div key={message.ts}>
                    {message.kind === "hitl" ? (
                      <HitlMessage message={message} decision={decision} onDecide={setDecision} />
                    ) : (
                      <article className="flex gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3f0e40] text-[11px] font-bold text-white">
                          {message.bot ? "AUQ" : (message.user[0] || "N").toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold text-[#1d1c1d]">
                            {message.user}{" "}
                            <span className="font-normal text-slate-400">
                              {new Date(Number(message.ts) * 1000 || Date.now()).toLocaleTimeString("es-MX", {
                                hour: "numeric",
                                minute: "2-digit",
                              })}
                            </span>
                          </p>
                          <p className="whitespace-pre-wrap text-[15px] leading-5 text-[#1d1c1d]">{message.text}</p>
                        </div>
                      </article>
                    )}
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <form onSubmit={(event) => void send(event)} className="border-t border-slate-200 p-3">
                <div className="flex items-end gap-2 rounded-xl border border-slate-300 px-3 py-2 focus-within:border-[#1264a3]">
                  <textarea
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    rows={2}
                    placeholder={`Enviar un mensaje a ${channel}`}
                    className="min-h-[44px] w-full resize-none bg-transparent text-[15px] text-[#1d1c1d] outline-none"
                  />
                  <button
                    type="submit"
                    disabled={busy || !draft.trim()}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#007a5a] text-white disabled:opacity-40"
                    aria-label="Enviar"
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </VideoStage>
    </ConsoleLayout>
  );
}

function HitlMessage({
  message,
  decision,
  onDecide,
}: {
  message: SlackThreadMessage;
  decision: string | null;
  onDecide: (body: string) => void;
}) {
  const knowledge = message.knowledge;
  const [working, setWorking] = useState<"APPROVE" | "REJECT" | null>(null);

  const act = async (action: "APPROVE" | "REJECT") => {
    if (working || decision) return;
    setWorking(action);
    try {
      const result = await authorizeAwu(action, message.tx);
      onDecide(result.body || result.error || action);
    } finally {
      setWorking(null);
    }
  };

  return (
    <article className="flex gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e01e5a] text-[10px] font-bold text-white">
        AUQ
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-bold text-[#1d1c1d]">
          {message.user} <span className="font-normal text-slate-400">bot</span>
        </p>
        <div className="mt-1 overflow-hidden rounded-lg border border-slate-200">
          <div className="bg-[#fff8f0] px-3 py-2 text-[15px] font-bold text-[#1d1c1d]">{message.text}</div>
          <div className="space-y-2 px-3 py-3 text-[14px] leading-5 text-[#1d1c1d]">
            <p>Sede Norte · Freno tanh activo por incertidumbre epistémica.</p>
            <p>
              Camas UCI: {knowledge?.camasUciDisponibles ?? 18} libres · tanh {knowledge?.porcentajeMetricaTanh ?? 88.05}% ·
              AUQ {((knowledge?.auqScore ?? 0.985) * 100).toFixed(2)}% (exigido ≥ 99.9%)
            </p>
            <p className="text-[13px] text-slate-600">RAG: {knowledge?.protocoloSanitarioRag}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                disabled={Boolean(decision) || working !== null}
                onClick={() => void act("APPROVE")}
                className="rounded-md bg-[#e01e5a] px-3 py-1.5 text-[13px] font-bold text-white disabled:opacity-60"
              >
                {working === "APPROVE" ? "Enviando…" : "🏥 AUTORIZAR BLOQUEO UCI (AWU)"}
              </button>
              <button
                type="button"
                disabled={Boolean(decision) || working !== null}
                onClick={() => void act("REJECT")}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-[13px] font-semibold text-slate-700 disabled:opacity-60"
              >
                {working === "REJECT" ? "Enviando…" : "❌ RECHAZAR & MANTENER ESTACIONAL"}
              </button>
            </div>
            {decision && <p className="text-[13px] font-semibold text-[#1264a3]">{decision}</p>}
          </div>
        </div>
      </div>
    </article>
  );
}
