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
    <aside className="flex h-full w-[112px] shrink-0 flex-col items-center gap-6 rounded-r-3xl bg-gradient-to-b from-[#0a1a4f] to-[#08123a] py-6 shadow-2xl">
      {/* Salesforce cloud logo */}
      <SalesforceCloud className="h-11 w-11 drop-shadow" />

      {/* Icon rail — each icon in a navy circle */}
      <div className="mt-2 flex flex-1 flex-col items-center gap-4">
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
              className={`group relative flex h-12 w-12 items-center justify-center rounded-full text-white transition-all active:scale-95 ${
                isActive ? "bg-[#2557d6]" : "bg-[#1c3a8f] hover:bg-[#2557d6]"
              }`}
              style={
                isActive
                  ? { boxShadow: "0 0 0 3px rgba(96,165,250,0.45), 0 0 22px rgba(59,130,246,0.55)" }
                  : { boxShadow: "0 6px 16px rgba(0,0,0,0.35)" }
              }
            >
              <Icon className={`h-[22px] w-[22px] ${busyId === id ? "animate-spin" : ""}`} />
              <span className="pointer-events-none absolute left-[60px] z-50 whitespace-nowrap rounded-md bg-mem-navy px-2 py-1 text-[11px] font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
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
        className="h-12 w-12 overflow-hidden rounded-full shadow-[0_6px_16px_rgba(0,0,0,0.35)] ring-2 ring-white/20 transition-transform hover:scale-105"
      >
        <img src={avatar} alt="Perfil" className="h-full w-full object-cover" />
      </button>
    </aside>
  );
}
