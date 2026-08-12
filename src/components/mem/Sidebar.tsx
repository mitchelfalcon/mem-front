import type { ComponentType } from "react";
import { Cloud, LayoutGrid, RefreshCw, FolderClosed, PieChart, Mic } from "lucide-react";

export interface SidebarItem {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

const ITEMS: SidebarItem[] = [
  { id: "apps", label: "App Launcher", icon: LayoutGrid },
  { id: "sync", label: "Data Cloud Sync", icon: RefreshCw },
  { id: "files", label: "Expedientes", icon: FolderClosed },
  { id: "analytics", label: "Analítica", icon: PieChart },
  { id: "voice", label: "Asistente de Voz", icon: Mic },
];

interface SidebarProps {
  active: string;
  onSelect: (id: string) => void;
}

export function Sidebar({ active, onSelect }: SidebarProps) {
  return (
    <aside className="flex w-[68px] shrink-0 flex-col items-center gap-4 rounded-r-3xl bg-gradient-to-b from-[#0b1e45] to-[#0a1533] py-5 shadow-2xl">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 shadow-lg">
        <Cloud className="h-6 w-6 text-[#2563eb]" strokeWidth={2.4} />
      </div>

      <div className="mt-2 flex flex-1 flex-col items-center gap-2">
        {ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            title={label}
            aria-label={label}
            aria-pressed={active === id}
            data-active={active === id}
            onClick={() => onSelect(id)}
            className="side-icon group"
          >
            <Icon className="h-5 w-5" />
            <span className="pointer-events-none absolute left-[54px] z-50 whitespace-nowrap rounded-md bg-mem-navy px-2 py-1 text-[11px] font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
              {label}
            </span>
          </button>
        ))}
      </div>

      <button
        type="button"
        title="Perfil"
        aria-label="Perfil"
        className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 ring-2 ring-white/20 transition-transform hover:scale-105"
      />
    </aside>
  );
}
