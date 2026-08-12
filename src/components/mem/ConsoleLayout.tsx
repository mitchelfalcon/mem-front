import { useState, useCallback, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { ConsoleTopbar } from "./ConsoleTopbar";

const SIDEBAR_LABELS: Record<string, string> = {
  apps: "App Launcher abierto",
  sync: "Sincronizando con Data Cloud…",
  files: "Expedientes clínicos cargados",
  analytics: "Panel de analítica activo",
  voice: "Asistente de voz escuchando",
};

interface ConsoleLayoutProps {
  children: ReactNode;
  /** Optional toolbar row rendered between the topbar and the main content. */
  toolbar?: ReactNode;
  defaultSidebar?: string;
}

export function ConsoleLayout({ children, toolbar, defaultSidebar = "apps" }: ConsoleLayoutProps) {
  const [activeSide, setActiveSide] = useState(defaultSidebar);
  const [toast, setToast] = useState<string | null>(null);

  const handleSelect = useCallback((id: string) => {
    setActiveSide(id);
    setToast(SIDEBAR_LABELS[id] ?? id);
    window.clearTimeout((handleSelect as any)._t);
    (handleSelect as any)._t = window.setTimeout(() => setToast(null), 2200);
  }, []);

  return (
    <div className="flex h-full min-h-0 gap-3 p-3">
      <Sidebar active={activeSide} onSelect={handleSelect} />

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <ConsoleTopbar />
        {toolbar}
        <main className="min-h-0 flex-1">{children}</main>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-mem-navy px-4 py-2.5 text-sm font-semibold text-white shadow-2xl"
          >
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
