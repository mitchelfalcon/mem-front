export type ChatBookend = {
  kind: "bookend";
  icon: "chat" | "end";
  prefix?: string;
  name?: string;
  suffix?: string;
  label?: string;
};

export type ChatText = {
  kind: "inbound" | "outbound";
  name: string;
  time: string;
  text: string;
  avatar?: string;
  initials?: string;
};

export type KnowledgeDownloadId = "pronam" | "vigilancia";

export type ChatFile = {
  kind: "file";
  direction: "inbound" | "outbound";
  name: string;
  time: string;
  filename: string;
  subtitle: string;
  downloadId: KnowledgeDownloadId;
};

export type ChatFields = {
  kind: "fields";
  items: { object: string; detail: string }[];
};

export type ChatSlack = {
  kind: "slack";
  time: string;
};

export type ChatKnowledge = {
  kind: "knowledge";
};

export type ChatAudit = {
  kind: "audit";
  time: string;
};

export type ChatItem = ChatBookend | ChatText | ChatFile | ChatFields | ChatSlack | ChatKnowledge | ChatAudit;

export const KNOWLEDGE_DOWNLOADS: Record<
  KnowledgeDownloadId,
  { href: string; filename: string; title: string }
> = {
  pronam: {
    href: "/knowledge/Articulo_1_PRONAM.csv",
    filename: "Articulo_1_PRONAM.csv",
    title: "Protocolos Nacionales de Atención Médica (PRONAM)",
  },
  vigilancia: {
    href: "/knowledge/Articulo_2_Vigilancia_Epidemiologica.csv",
    filename: "Articulo_2_Vigilancia_Epidemiologica.csv",
    title: "Vigilancia Epidemiológica y Sistemas de Alertamiento",
  },
};

export const HERA_EMPTY_TRANSCRIPT: ChatItem[] = [
  {
    kind: "bookend",
    icon: "chat",
    prefix: "Chat started by ",
    name: "Agente HERA",
    suffix: " • chatbot",
  },
];

export const HERA_TRANSCRIPT: ChatItem[] = [
  {
    kind: "bookend",
    icon: "chat",
    prefix: "Chat started by ",
    name: "Agente HERA",
    suffix: " • 9:12 AM",
  },
  {
    kind: "inbound",
    name: "Director Médico",
    initials: "DM",
    time: "9:12 AM",
    text: "Agente, evalúa la tendencia de admisiones en la Sede Norte durante las últimas 24 horas.",
  },
  {
    kind: "outbound",
    name: "Agente HERA",
    time: "9:12 AM",
    text: "He analizado 1,247 notas de evolución clínica. Detecto un incremento anómalo en patrones respiratorios compatibles con endemia viral (p90 = 87.05%). Sin embargo, la certeza analítica Confianza_AUQ__c = 0.985 no alcanza el umbral de 0.999. Freno hiperbólico tanh activo. Freno_Tanh_Activado__c = True. Se detiene la reserva autónoma.",
  },
  {
    kind: "fields",
    items: [
      { object: "Cama_UCI__c", detail: "100 total · 18 libres" },
      { object: "Alerta_Epidemiologica__c", detail: "Estado__c → PENDIENTE" },
      { object: "MEM_Start_Event__e", detail: "disparo" },
    ],
  },
  {
    kind: "bookend",
    icon: "chat",
    label: "Fase 2 de 4 · Grounding RAG · Knowledge",
  },
  {
    kind: "outbound",
    name: "Agente HERA",
    time: "9:13 AM",
    text: "Consultando base de conocimiento RAG... Protocolo de Emergencia Sanitaria Nivel 2 identificado: Se requiere validación humana obligatoria (Human-in-the-Loop). Adjunto los artículos de Knowledge. Procedo a iniciar comunicación con el Doctor en Turno de la Sede Norte.",
  },
  {
    kind: "file",
    direction: "outbound",
    name: "Agente HERA",
    time: "9:13 AM",
    filename: "Articulo_2_Vigilancia_Epidemiologica.csv",
    subtitle: "Vigilancia Epidemiológica y Sistemas de Alertamiento",
    downloadId: "vigilancia",
  },
  {
    kind: "file",
    direction: "outbound",
    name: "Agente HERA",
    time: "9:13 AM",
    filename: "Articulo_1_PRONAM.csv",
    subtitle: "Protocolos Nacionales de Atención Médica (PRONAM)",
    downloadId: "pronam",
  },
  { kind: "knowledge" },
  {
    kind: "bookend",
    icon: "chat",
    label: "Fase 3 de 4 · Escalado Slack · HITL",
  },
  {
    kind: "outbound",
    name: "Agente HERA",
    time: "9:14 AM",
    text: "Protocolo RAG confirmado. Estableciendo llamada con Dr. Mike y enviando informe de riesgo a Slack: '¿Autoriza el apartado de 50 camas UCI en Sede Norte?'",
  },
  { kind: "slack", time: "9:14 AM" },
  {
    kind: "inbound",
    name: "Dr. Mike",
    initials: "MK",
    time: "9:15 AM",
    text: "→ Clic en 'Sí, Apartar 50 Camas UCI'",
  },
  {
    kind: "fields",
    items: [
      { object: "MEM_Start_Event__e", detail: "payload JSON cifrado" },
      { object: "Alerta_Epidemiologica__c", detail: "Mensaje_Traza__c escrito" },
    ],
  },
  {
    kind: "bookend",
    icon: "chat",
    label: "Fase 4 de 4 · Commit AWU · Audit Log",
  },
  {
    kind: "outbound",
    name: "Agente HERA",
    time: "9:16 AM",
    text: "Confirmación recibida del Doctor en Turno vía Slack. Se ha completado la reserva transaccional de 50 camas UCI en Sede Norte — Cama_UCI__c Estado__c = 'Bloqueada_Epidemia'. Registro inmutable con Privacidad Diferencial Laplaciana asentado en MEM_Clinical_Audit__c (AUD-883). Firma_Criptografica_DP__c sellada. Trazabilidad completa HIPAA garantizada.",
  },
  { kind: "audit", time: "9:16 AM" },
];
