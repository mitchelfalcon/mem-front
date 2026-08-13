import { Fragment, type FormEvent, type KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import { Minus, Send, X } from "lucide-react";
import chatIcon from "../../assets/slds-chat/chat.svg";
import endChatIcon from "../../assets/slds-chat/end-chat.svg";
import doctypeImageIcon from "../../assets/slds-chat/doctype-image.svg";
import downloadIcon from "../../assets/slds-chat/download.svg";
import warningIcon from "../../assets/slds-chat/warning.svg";
import drArmando from "../../assets/dr-armando.png";
import avatar from "../../assets/avatar.png";
import { HERA_TRANSCRIPT, type ChatItem, type ChatText } from "../../data/hera-chat";
import { mutePresentationAudio } from "../../pages/Presentation";

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
    <li className={`flex items-end gap-2 ${consecutive ? "-mt-1.5" : ""}`}>
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
    <li className={`flex flex-col items-end ${consecutive ? "-mt-1.5" : ""}`}>
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
  return (
    <li className={`flex ${outbound ? "justify-end" : "items-end gap-2"}`}>
      {!outbound && <span className="h-8 w-8 shrink-0" />}
      <div className={`min-w-0 ${outbound ? "max-w-[min(100%,20.5rem)]" : "max-w-[min(100%,20.5rem)] flex-1"}`}>
        <div
          className={`overflow-hidden rounded-[12px] border border-[#c9c9c9] bg-white ${
            outbound ? "rounded-br-none" : "rounded-bl-none"
          }`}
        >
          <div className="flex items-center gap-2 px-2 py-2">
            <SldsIcon src={doctypeImageIcon} size={28} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold leading-[18px] text-[#03234d]">{item.filename}</p>
              <p className="text-[12px] leading-4 text-[#2e2e2e]">{item.subtitle}</p>
            </div>
            <SldsIcon src={downloadIcon} size={16} />
          </div>
        </div>
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

function SlackCard({ time }: { time: string }) {
  return (
    <li className="flex justify-end">
      <div className="w-full max-w-[min(100%,20.5rem)]">
        <div className="overflow-hidden rounded-[12px] rounded-br-none border border-[#8c4b02] bg-white">
          <div className="flex items-start gap-2 border-b border-[#f3e5d7] bg-[#fff8f0] px-2.5 py-2">
            <SldsIcon src={warningIcon} size={16} />
            <p className="text-[12px] font-semibold leading-4 text-[#8c4b02]">Bot Slack · MEM Agent · #urgencias-epidemiologia</p>
          </div>
          <div className="space-y-2 px-2.5 py-2">
            <p className="text-[13px] font-semibold leading-[18px] text-[#2e2e2e]">🚨 ALERTA EPIDEMIOLÓGICA – SEDE NORTE</p>
            <p className="text-[13px] leading-[18px] text-[#2e2e2e]">
              Notas: 1,247 · Riesgo: Endemia Respiratoria (p90 = 87.05%)
              <br />
              Confianza_AUQ: 0.985 / Umbral: 0.999 · Freno tanh: ACTIVO · Camas libres: 18/100
            </p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="inline-flex rounded-full bg-[#03234d] px-2.5 py-1 text-[11px] font-semibold text-white">
                Sí, Apartar 50 Camas UCI
              </span>
              <span className="inline-flex rounded-full border border-[#c9c9c9] px-2.5 py-1 text-[11px] font-medium text-[#747474]">
                Rechazar
              </span>
            </div>
          </div>
        </div>
        <p className="pt-0.5 text-right text-[10px] leading-[14px] text-[#747474]">Bot MEM Agent • {time}</p>
      </div>
    </li>
  );
}

function AuditCard({ time }: { time: string }) {
  const rows = [
    ["Audit Record ID", "AUD-883"],
    ["Estado__c", "COMPLETED_AWU_COMMITTED"],
    ["Cama_UCI__c", "50 → Bloqueada_Epidemia"],
    ["Confianza_AUQ__c", "0.985"],
    ["Freno_Tanh_Activado__c", "true"],
    ["Mensaje_Traza__c", "EMERGENCY_BED_RESERVATION_COMMIT"],
    ["Firma_Criptografica_DP__c", "[HA…]"],
  ];
  return (
    <li className="flex justify-end">
      <div className="w-full max-w-[min(100%,20.5rem)]">
        <div className="overflow-hidden rounded-[12px] rounded-br-none border border-[#c9c9c9] bg-white">
          <div className="flex items-center gap-2 border-b border-[#e5e5e5] bg-[#f3f3f3] px-2.5 py-2">
            <SldsIcon src={doctypeImageIcon} size={22} />
            <div className="min-w-0">
              <p className="text-[13px] font-semibold leading-[18px] text-[#03234d]">MEM_Clinical_Audit__c</p>
              <p className="text-[10px] leading-[14px] text-[#747474]">MEM Clinical Audits · AUD-883</p>
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

function Transcript({ items }: { items: ChatItem[] }) {
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
            {item.kind === "slack" && <SlackCard time={item.time} />}
            {item.kind === "audit" && <AuditCard time={item.time} />}
            {item.kind === "inbound" && (
              <InboundMessage item={item} consecutive={grouped} hideMeta={hideMeta} />
            )}
            {item.kind === "outbound" && (
              <OutboundMessage item={item} consecutive={grouped} hideMeta={hideMeta} />
            )}
          </Fragment>
        );
      })}
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
  const [items, setItems] = useState<ChatItem[]>(HERA_TRANSCRIPT);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const titleId = useId();
  const panelId = useId();
  const visible = open && !minimized;

  useEffect(() => {
    if (!visible) return;
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [visible, items.length]);

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

  const send = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
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
    setDraft("");
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
            <span className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full bg-[#03234d] text-[9px] font-bold leading-6 text-white">
              <span className="flex h-full w-full items-center justify-center">AH</span>
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-white bg-[#2e844a]" />
            </span>
            <span className="min-w-0 flex-1 truncate text-[13px] font-semibold text-[#03234d]">Agente HERA</span>
            <span className="text-[10px] text-[#747474]">En línea</span>
          </button>
        </div>
      )}

      {visible && (
        <section
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          className="fixed bottom-[calc(3.15rem+env(safe-area-inset-bottom,0px))] left-2 z-[60] flex h-[min(34rem,calc(100dvh-7.5rem))] w-[min(100vw-1rem,25rem)] flex-col overflow-hidden rounded-t-lg border border-[#c9c9c9] border-b-0 bg-white shadow-[0_-12px_32px_rgba(3,35,77,0.18)] sm:left-6"
        >
          <header className="flex shrink-0 items-center gap-2 border-b border-[#e5e5e5] bg-white px-3 py-2">
            <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-[#03234d] text-[11px] font-bold leading-8 text-white">
              <span className="flex h-full w-full items-center justify-center">AH</span>
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#2e844a]" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id={titleId} className="truncate text-[13px] font-semibold leading-[18px] text-[#03234d]">
                Chat · Agente HERA
              </h2>
              <p className="text-[10px] leading-[14px] text-[#747474]">MEM Healthcare · En línea</p>
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
            <Transcript items={items} />
          </div>

          <form onSubmit={send} className="shrink-0 border-t border-[#e5e5e5] bg-white px-2 py-2">
            <div className="flex items-end gap-1.5 rounded-md border border-[#c9c9c9] bg-white px-2 py-1.5 focus-within:border-[#0250d9]">
              <textarea
                ref={inputRef}
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onComposerKey}
                placeholder="Escribe un mensaje…"
                aria-label="Escribe un mensaje"
                className="max-h-24 min-h-[22px] flex-1 resize-none bg-transparent text-[13px] leading-[18px] text-[#2e2e2e] outline-none placeholder:text-[#747474]"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-[#0250d9] disabled:text-[#c9c9c9]"
                aria-label="Enviar"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </section>
      )}

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
