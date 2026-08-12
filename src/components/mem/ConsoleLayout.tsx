import { useState, useCallback, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Play, Home as HomeIcon, Map, BarChart3, X } from "lucide-react";
import { Sidebar } from "./Sidebar";

const SIDEBAR_LABELS: Record<string, string> = {
  files: "Expedientes clínicos cargados",
  voice: "Asistente de voz escuchando",
};

const APPS = [
  { id: "presentation", label: "Presentation", icon: Play },
  { id: "home", label: "Home", icon: HomeIcon },
  { id: "mapas", label: "Mapas", icon: Map },
  { id: "estadisticas", label: "Estadísticas", icon: BarChart3 },
];

function go(hash: string) {
  window.location.hash = `/${hash}`;
}

interface ConsoleLayoutProps {
  children: ReactNode;
  /** Optional toolbar row rendered between the topbar and the main content. */
  toolbar?: ReactNode;
  defaultSidebar?: string;
  /** Center the main content both horizontally and vertically. */
  centerContent?: boolean;
  /** Full-bleed mode: remove padding/gaps so the content fills 100% width + full height. */
  bleed?: boolean;
}

export function ConsoleLayout({
  children,
  toolbar,
  defaultSidebar = "apps",
  centerContent = false,
  bleed = false,
}: ConsoleLayoutProps) {
  const [activeSide, setActiveSide] = useState(defaultSidebar);
  const [toast, setToast] = useState<string | null>(null);
  const [launcherOpen, setLauncherOpen] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const flashToast = useCallback((msg: string, ms = 2200) => {
    setToast(msg);
    window.clearTimeout((flashToast as any)._t);
    (flashToast as any)._t = window.setTimeout(() => setToast(null), ms);
  }, []);

  const handleSelect = useCallback(
    (id: string) => {
      setActiveSide(id);
      switch (id) {
        case "apps":
          setLauncherOpen((v) => !v);
          break;
        case "analytics":
          setLauncherOpen(false);
          flashToast("Abriendo Analítica…", 1200);
          go("estadisticas");
          break;
        case "map":
          setLauncherOpen(false);
          flashToast("Abriendo Mapas…", 1200);
          go("mapas");
          break;
        default:
          setLauncherOpen(false);
          flashToast(SIDEBAR_LABELS[id] ?? id);
      }
    },
    [flashToast],
  );

  return (
    <div className={`relative flex h-full min-h-0 w-full ${bleed ? "gap-0 p-0" : "gap-3 py-3 pr-3"}`}>
      {bleed ? (
        <>
          {/* Full-bleed: content fills 100% width; sidebar floats over the left edge */}
          <main className="h-full w-full">{children}</main>
          <div className="absolute inset-y-0 left-0 z-30">
            <Sidebar active={activeSide} busyId={busyId} onSelect={handleSelect} />
          </div>
        </>
      ) : (
        <>
          <Sidebar active={activeSide} busyId={busyId} onSelect={handleSelect} />
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            {toolbar}
            <main className={`min-h-0 flex-1 ${centerContent ? "flex items-center justify-center" : ""}`}>
              {children}
            </main>
          </div>
        </>
      )}

      {/* App Launcher popover — functional navigation */}
      <AnimatePresence>
        {launcherOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setLauncherOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: -8 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95, x: -8 }}
              className="fixed left-[128px] top-[120px] z-50 w-64 rounded-2xl border border-white/70 bg-white/95 p-3 shadow-2xl backdrop-blur-xl"
            >
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-[11px] font-bold uppercase tracking-widest text-mem-gray-2">
                  App Launcher
                </span>
                <button onClick={() => setLauncherOpen(false)} className="text-mem-gray-2 hover:text-mem-ink">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {APPS.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => {
                      go(id);
                      setLauncherOpen(false);
                    }}
                    className="flex flex-col items-start gap-2 rounded-xl border border-slate-200 bg-white/70 p-3 text-left transition-all hover:border-mem-blue hover:bg-blue-50 active:scale-95"
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-mem-blue">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="text-xs font-semibold text-mem-ink">{label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
