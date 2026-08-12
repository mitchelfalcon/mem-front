import { useEffect, useState } from "react";
import { Presentation } from "./pages/Presentation";
import { Home } from "./pages/Home";
import { Mapas } from "./pages/Mapas";
import { Estadisticas } from "./pages/Estadisticas";
import { ConsoleTabs, ConsoleIcons } from "./components/mem/ConsoleNav";

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
    <div className="flex h-full min-h-screen flex-col">
      {/* Consolidated header: single MEM Healthcare brand + main menu + console nav */}
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl">
        {/* Row 1 — brand (once), main menu centered, console action icons */}
        <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 sm:px-6">
          <button
            onClick={() => go("presentation")}
            className="flex shrink-0 items-center gap-2"
            aria-label="MEM Healthcare — inicio"
          >
            <span className="mem-brand text-3xl">MEM</span>
            <span className="text-base font-bold text-mem-navy/80">Healthcare</span>
          </button>

          <div className="flex w-full flex-1 justify-center order-last lg:order-none lg:w-auto">
            <nav className="flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/70 bg-white/60 p-1.5 shadow-sm">
              {NAV.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => go(id)}
                  aria-current={page === id ? "page" : undefined}
                  className={`nav-pill ${page === id ? "text-white" : "text-slate-600 hover:text-mem-navy"}`}
                >
                  {page === id && (
                    <span
                      className="absolute inset-0 -z-10 rounded-full"
                      style={{ background: "linear-gradient(90deg,#007ade,#6d3bf5)" }}
                    />
                  )}
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {isConsole && (
            <div className="ml-auto hidden shrink-0 lg:flex">
              <ConsoleIcons />
            </div>
          )}
        </div>

        {/* Row 2 — Salesforce-style console tabs (console pages only) */}
        {isConsole && (
          <div className="w-full overflow-x-auto border-t border-slate-100 px-4 py-1.5 sm:px-6">
            <ConsoleTabs />
          </div>
        )}
      </header>

      {/* Page content */}
      <div className="min-h-0 flex-1">
        {page === "presentation" && <Presentation />}
        {page === "home" && <Home />}
        {page === "mapas" && <Mapas />}
        {page === "estadisticas" && <Estadisticas />}
      </div>
    </div>
  );
}
