import type { ComponentType } from "react";
import { LayoutGrid, Map, FolderClosed, PieChart, Mic } from "lucide-react";
import { SalesforceCloud } from "./SalesforceCloud";
import avatar from "../../assets/avatar.png";

export interface SidebarItem {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

const ITEMS: SidebarItem[] = [
  { id: "apps", label: "App Launcher", icon: LayoutGrid },
  { id: "map", label: "Mapas", icon: Map },
  { id: "files", label: "Expedientes", icon: FolderClosed },
  { id: "analytics", label: "Analítica", icon: PieChart },
  { id: "voice", label: "Asistente de Voz", icon: Mic },
];

interface SidebarProps {
  active: string;
  onSelect: (id: string) => void;
  /** Id of the item currently performing an async action (spins its icon). */
  busyId?: string | null;
}

export function Sidebar({ active, onSelect, busyId = null }: SidebarProps) {
  return (
    <aside
      className="flex h-full shrink-0 flex-col items-center gap-3 rounded-r-3xl bg-gradient-to-b from-[#0a1a4f] to-[#08123a] py-3 shadow-2xl md:gap-6 md:py-6"
      style={{ width: "var(--mem-sidebar-w)" }}
    >
      {/* Salesforce cloud logo */}
      <SalesforceCloud className="h-8 w-8 drop-shadow md:h-11 md:w-11" />

      {/* Icon rail — each icon in a navy circle */}
      <div className="mt-1 flex flex-1 flex-col items-center gap-2.5 md:mt-2 md:gap-4">
        {ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              type="button"
              title={label}
              aria-label={label}
              aria-pressed={isActive}
              onClick={() => onSelect(id)}
              className={`group relative flex h-10 w-10 items-center justify-center rounded-full text-white transition-all active:scale-95 md:h-12 md:w-12 ${
                isActive ? "bg-[#2557d6]" : "bg-[#1c3a8f] hover:bg-[#2557d6]"
              }`}
              style={
                isActive
                  ? { boxShadow: "0 0 0 3px rgba(96,165,250,0.45), 0 0 22px rgba(59,130,246,0.55)" }
                  : { boxShadow: "0 6px 16px rgba(0,0,0,0.35)" }
              }
            >
              <Icon className={`h-[18px] w-[18px] md:h-[22px] md:w-[22px] ${busyId === id ? "animate-spin" : ""}`} />
              <span className="pointer-events-none absolute left-[52px] z-50 hidden whitespace-nowrap rounded-md bg-mem-navy px-2 py-1 text-[11px] font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 md:block md:left-[60px]">
                {label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Profile avatar (mascot) */}
      <button
        type="button"
        title="Perfil"
        aria-label="Perfil"
        className="h-10 w-10 overflow-hidden rounded-full shadow-[0_6px_16px_rgba(0,0,0,0.35)] ring-2 ring-white/20 transition-transform hover:scale-105 md:h-12 md:w-12"
      >
        <img src={avatar} alt="Perfil" className="h-full w-full object-cover" />
      </button>
    </aside>
  );
}
