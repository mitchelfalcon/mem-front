export interface ArchitectureNode {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon: string; // Lucide icon name
  salesforceMapping: string;
}

export const ARCHITECTURE_NODES: ArchitectureNode[] = [
  {
    id: "n1",
    title: "Vector de Inicialización de Intención",
    shortDescription: "Captura auditada de eventos con estado.",
    fullDescription: "No recibimos 'texto', recibimos un evento con estado. Asegura que la IA no inicie un flujo conversacional pasivo, sino un proceso de evaluación para acción asíncrona.",
    icon: "Target",
    salesforceMapping: "Event-Driven State / Apex Action Input",
  },
  {
    id: "n2",
    title: "Motor de Razonamiento Agéntico (ToT)",
    shortDescription: "Árbol de pensamientos determinista.",
    fullDescription: "Elimina la dependencia del modelo probabilístico crudo. Aplica Tree of Thoughts (ToT) restringido por reglas de negocio, garantizando razonamiento determinista y auditable.",
    icon: "Brain",
    salesforceMapping: "Agentforce Platform Brain / LangGraph Logic",
  },
  {
    id: "n3",
    title: "Anclaje Epistemológico de Datos",
    shortDescription: "Salesforce Data Cloud como verdad absoluta.",
    fullDescription: "La IA no busca información al azar. Ingesta metadatos estrictos de Salesforce Data Cloud para establecer la verdad absoluta del cliente antes de formular cualquier plan.",
    icon: "Database",
    salesforceMapping: "Salesforce Data Cloud / Metadata Engine",
  },
  {
    id: "n4",
    title: "Protocolos de Mitigación de Workslop",
    shortDescription: "Destruye alucinaciones antes de ejecutar.",
    fullDescription: "Inspecciona activamente el plan del agente para detectar y destruir alucinaciones lógicas ('vibe coding') antes de que lleguen a la capa operativa.",
    icon: "ShieldAlert",
    salesforceMapping: "Einstein Trust Layer / Guardrails",
  },
  {
    id: "n5",
    title: "Matriz de Ejecución AWU",
    shortDescription: "Unidades de trabajo agénticas validadas.",
    fullDescription: "El agente no 'usa una herramienta'; ejecuta una Agentic Work Unit (AWU). Acción medible, con ROI cuantificable y resultado equivalente a operador experto.",
    icon: "Activity",
    salesforceMapping: "Apex Actions / Flow Automation",
  },
  {
    id: "n6",
    title: "Equivalencia Funcional",
    shortDescription: "Validación matemática de resultados.",
    fullDescription: "Antes de ejecutar cualquier AWU, valida que el resultado será funcionalmente equivalente al de un experto humano. Inmunidad al workslop.",
    icon: "CheckCircle2",
    salesforceMapping: "Expert-Level Output Validation",
  },
  {
    id: "n7",
    title: "Machine Unlearning < 100ms",
    shortDescription: "Obliteración selectiva GDPR/HIPAA.",
    fullDescription: "Borra datos de modelos entrenados en < 100ms sin reentrenamiento completo. Cumplimiento instantáneo con privacidad diferencial.",
    icon: "ZapOff",
    salesforceMapping: "Einstein Trust Layer / Privacy Differential",
  },
  {
    id: "n8",
    title: "Calibración HTC/AUQ",
    shortDescription: "Cuantificación de incertidumbre.",
    fullDescription: "Verifica confianza empírica del modelo antes de ejecutar. Rechaza predicciones con alta incertidumbre. 94% accuracy garantizada.",
    icon: "BarChart3",
    salesforceMapping: "FARE Auditing / Confidence Calibration",
  },
];

export interface JourneyStep {
  phase: string;
  duration: string;
  items: {
    title: string;
    description: string;
    critical: boolean;
    techDetails: string;
  }[];
}

export const JOURNEY_MAP: JourneyStep[] = [
  {
    phase: "Configuración Inicial",
    duration: "2-3 min",
    items: [
      {
        title: "Verificar Salesforce",
        description: "Confirmar conexión con Salesforce Org y Data Cloud.",
        critical: true,
        techDetails: "API Version 60.0, OAuth 2.0 JWT Bearer Flow."
      },
      {
        title: "Cargar Datos",
        description: "Importar dataset de prueba para los casos de uso.",
        critical: false,
        techDetails: "Data Cloud Ingestion API, 5k records."
      },
      {
        title: "Inicializar Motor",
        description: "Arrancar el motor ToT y cargar reglas de negocio.",
        critical: true,
        techDetails: "Node.js cluster worker initialization."
      }
    ]
  },
  {
    phase: "Demostración en Vivo",
    duration: "8-10 min",
    items: [
      {
        title: "Aprobación de Préstamo",
        description: "Ejecución de AWU para evaluación financiera en tiempo real.",
        critical: true,
        techDetails: "Vector de Intención -> ToT -> Apex Action."
      },
      {
        title: "Recomendación Personalizada",
        description: "Análisis de comportamiento y matching con catálogo Data Cloud.",
        critical: true,
        techDetails: "Semantic Search via Vector Base."
      },
      {
        title: "Machine Unlearning",
        description: "Borrado selectivo de datos bajo demanda (GDPR).",
        critical: true,
        techDetails: "SISA Protocol implementation < 100ms."
      }
    ]
  },
  {
    phase: "Métricas y Validación",
    duration: "3-5 min",
    items: [
      {
        title: "Dashboard de Performance",
        description: "Visualización de latencia p95 y throughput.",
        critical: false,
        techDetails: "Real-time metrics via Prometheus/Grafana."
      },
      {
        title: "Inmunidad al Workslop",
        description: "Prueba de inyección de ruido para validar mitigación.",
        critical: true,
        techDetails: "Hallucination score check audit log."
      }
    ]
  },
  {
    phase: "Q&A y Profundización",
    duration: "5-7 min",
    items: [
      {
        title: "Preguntas Técnicas",
        description: "Sesión de preguntas y respuestas con los jueces.",
        critical: false,
        techDetails: "Whiteboard architecture session."
      },
      {
        title: "Revisión de Código",
        description: "Inspección de implementación Apex/Node si es requerida.",
        critical: false,
        techDetails: "GitHub Repository Deep Dive."
      }
    ]
  }
];

export interface Requirement {
  category: string;
  items: {
    label: string;
    description: string;
    status: 'required' | 'recommended';
  }[];
}

export const REQUIREMENTS: Requirement[] = [
  {
    category: "Infraestructura Técnica",
    items: [
      { label: "Salesforce Org", description: "Enterprise/Unlimited with Agentforce enabled.", status: 'required' },
      { label: "Data Cloud", description: "Configured and connected to external sources.", status: 'required' },
      { label: "Internet Fibra", description: "Conexión estable de baja latencia.", status: 'required' },
      { label: "Laptop Pro", description: "Mínimo 16GB RAM para entorno de desarrollo local.", status: 'recommended' }
    ]
  },
  {
    category: "Software & Credenciales",
    items: [
      { label: "ALRO Deployed", description: "Instancia activa en Cloud Run.", status: 'required' },
      { label: "Secretos .env", description: "GEMINI_API_KEY y SF_CLIENT_ID configurados.", status: 'required' },
      { label: "Dashboard Ready", description: "Pestañas pre-cargadas en el navegador.", status: 'recommended' }
    ]
  }
];

export const DEPLOYMENT_STEPS = [
  { phase: "Pre-Evento", steps: ["Check connectivity", "Sync Data Cloud", "Dry run demo"] },
  { phase: "Día del Evento", steps: ["Verify secrets", "Clear cache", "Open all tabs"] },
  { phase: "Durante Demo", steps: ["Reset state", "Run AWU", "Show logs"] },
  { phase: "Post-Demo", steps: ["Export logs", "Follow up", "Close instance"] }
];
