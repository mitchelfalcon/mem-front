import { useEffect, useState } from "react";
import { Presentation, PresentationAudioButton } from "./pages/Presentation";
import { Home } from "./pages/Home";
import { Mapas } from "./pages/Mapas";
import { Estadisticas } from "./pages/Estadisticas";
import { ConsoleTabs, ConsoleIcons } from "./components/mem/ConsoleNav";
import memLogo from "./assets/mem-logo.png";

type PageId = "presentation" | "home" | "mapas" | "estadisticas";

const NAV: { id: PageId; label: string }[] = [
  { id: "presentation", label: "PRESENTATION" },
  { id: "home", label: "HOME" },
  { id: "mapas", label: "MAPAS" },
  { id: "estadisticas", label: "ESTADÍSTICAS" },
];

function parseHash(): PageId {
  const h = window.location.hash.replace("#/", "").replace("#", "").toLowerCase();
  if (h === "home" || h === "mapas" || h === "presentation" || h === "estadisticas") return h;
  return "presentation";
}

export default function App() {
  const [page, setPage] = useState<PageId>(parseHash);

  useEffect(() => {
    const onHash = () => setPage(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const go = (id: PageId) => {
    window.location.hash = `/${id}`;
    setPage(id);
  };

  const isConsole = page !== "presentation";

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden">
      {/* Consolidated header: single MEM Healthcare brand + console nav */}
      <header className="z-40 shrink-0 border-b border-white/60 bg-white/80 backdrop-blur-xl">
        {/* Row 1 — brand (once), console action icons */}
        <div className="flex w-full items-center gap-x-3 px-3 py-2 sm:gap-x-4 sm:px-6 sm:py-2.5">
          <button
            onClick={() => go("presentation")}
            className="flex shrink-0 items-center"
            aria-label="MEM Healthcare — inicio"
          >
            <img src={memLogo} alt="MEM Healthcare" className="h-8 w-auto sm:h-12" />
          </button>

          {page === "presentation" ? (
            <div className="ml-auto shrink-0">
              <PresentationAudioButton />
            </div>
          ) : (
            <div className="ml-auto hidden shrink-0 lg:flex">
              <ConsoleIcons />
            </div>
          )}
        </div>

        {/* Row 2 — Salesforce-style console tabs (console pages only) */}
        {isConsole && (
          <div className="hidden w-full overflow-x-auto border-t border-slate-100 px-4 py-1.5 sm:px-6 md:block">
            <ConsoleTabs />
          </div>
        )}
      </header>

      {/* Page content — fills the space between the fixed header and footer */}
      <div className="min-h-0 flex-1 overflow-hidden">
        {page === "presentation" && <Presentation />}
        {page === "home" && <Home />}
        {page === "mapas" && <Mapas />}
        {page === "estadisticas" && <Estadisticas />}
      </div>

      {/* Main menu — pinned to the bottom of the viewport on every page */}
      <footer className="z-50 shrink-0 border-t border-white/60 bg-white/80 pb-[max(0.25rem,env(safe-area-inset-bottom))] backdrop-blur-xl">
        <nav className="flex w-full items-center justify-around gap-0 overflow-x-auto px-1 py-1.5 sm:justify-end sm:gap-1 sm:px-6 sm:py-2">
          {NAV.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => go(id)}
              aria-current={page === id ? "page" : undefined}
              className={`relative min-w-0 flex-1 whitespace-nowrap rounded-md px-1.5 py-1 text-center text-[10px] uppercase tracking-wide transition-colors sm:flex-none sm:px-3 sm:text-[13px] sm:normal-case sm:tracking-normal ${
                page === id ? "font-semibold text-mem-navy" : "font-medium text-slate-600 hover:text-mem-navy"
              }`}
            >
              {label}
              {page === id && (
                <span className="absolute -bottom-[4px] left-2 right-2 h-[3px] rounded-full bg-mem-blue sm:-bottom-[6px] sm:left-3 sm:right-3" />
              )}
            </button>
          ))}
        </nav>
      </footer>
    </div>
  );
}
