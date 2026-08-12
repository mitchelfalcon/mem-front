// New data entries for the Estadísticas page. These are ADDITIVE — no existing
// data structures in src/types.ts are modified.

export interface KpiEntry {
  id: string;
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  tone: "blue" | "emerald" | "amber" | "rose" | "indigo";
}

export const KPIS: KpiEntry[] = [
  { id: "casos", label: "Casos activos", value: "1,284", delta: "+4.2%", trend: "up", tone: "blue" },
  { id: "ocupacion", label: "Ocupación de camas", value: "78%", delta: "+2.1%", trend: "up", tone: "amber" },
  { id: "respuesta", label: "Tiempo de respuesta", value: "12 min", delta: "-8.5%", trend: "down", tone: "emerald" },
  { id: "cobertura", label: "Cobertura de vigilancia", value: "94%", delta: "+1.3%", trend: "up", tone: "indigo" },
];

/**
 * Canal endémico (endemic channel): weekly bands + observed cases for the
 * current season. Bands are cumulative thresholds used to build the stacked
 * "éxito / seguridad / alerta" zones of the classic epidemiological channel.
 */
export interface EndemicChannelPoint {
  semana: string;
  exito: number;
  seguridad: number;
  alerta: number;
  casos: number;
}

export const ENDEMIC_CHANNEL: EndemicChannelPoint[] = [
  { semana: "S1", exito: 40, seguridad: 30, alerta: 40, casos: 52 },
  { semana: "S2", exito: 42, seguridad: 31, alerta: 42, casos: 58 },
  { semana: "S3", exito: 45, seguridad: 33, alerta: 44, casos: 61 },
  { semana: "S4", exito: 48, seguridad: 34, alerta: 46, casos: 70 },
  { semana: "S5", exito: 50, seguridad: 36, alerta: 48, casos: 88 },
  { semana: "S6", exito: 52, seguridad: 37, alerta: 50, casos: 96 },
  { semana: "S7", exito: 54, seguridad: 38, alerta: 52, casos: 132 },
  { semana: "S8", exito: 55, seguridad: 40, alerta: 54, casos: 118 },
  { semana: "S9", exito: 56, seguridad: 41, alerta: 55, casos: 101 },
  { semana: "S10", exito: 57, seguridad: 42, alerta: 56, casos: 90 },
  { semana: "S11", exito: 58, seguridad: 43, alerta: 57, casos: 84 },
  { semana: "S12", exito: 60, seguridad: 44, alerta: 58, casos: 76 },
];

/** Tendencias: monthly ingestions vs resolved reports (report-delay mitigation). */
export interface TrendPoint {
  mes: string;
  ingresos: number;
  resueltos: number;
}

export const TRENDS: TrendPoint[] = [
  { mes: "Ene", ingresos: 320, resueltos: 290 },
  { mes: "Feb", ingresos: 360, resueltos: 331 },
  { mes: "Mar", ingresos: 410, resueltos: 388 },
  { mes: "Abr", ingresos: 470, resueltos: 452 },
  { mes: "May", ingresos: 520, resueltos: 505 },
  { mes: "Jun", ingresos: 610, resueltos: 598 },
  { mes: "Jul", ingresos: 700, resueltos: 690 },
  { mes: "Ago", ingresos: 760, resueltos: 752 },
];

/** Distribución por zona (for the small donut / share widget). */
export interface ZoneShare {
  zona: string;
  valor: number;
  color: string;
}

export const ZONE_SHARE: ZoneShare[] = [
  { zona: "Zona Sur", valor: 38, color: "#2563eb" },
  { zona: "Zona Norte", valor: 27, color: "#7c3aed" },
  { zona: "Zona Centro", valor: 22, color: "#4f46e5" },
  { zona: "Zona Golfo", valor: 13, color: "#10b981" },
];
