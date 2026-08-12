import { useEffect, useState } from "react";
import { Presentation } from "./pages/Presentation";
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
    <div className="flex h-full min-h-screen flex-col">
      {/* Consolidated header: single MEM Healthcare brand + main menu + console nav */}
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/80 backdrop-blur-xl">
        {/* Row 1 — brand (once), main menu centered, console action icons */}
        <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5 sm:px-6">
          <button
            onClick={() => go("presentation")}
            className="flex shrink-0 items-center"
            aria-label="MEM Healthcare — inicio"
          >
            <img src={memLogo} alt="MEM Healthcare" className="h-12 w-auto" />
          </button>

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

      {/* Main menu — moved below the right-side content, styled like the Salesforce tabs */}
      <footer className="sticky bottom-0 z-40 border-t border-white/60 bg-white/80 backdrop-blur-xl">
        <nav className="flex w-full items-center justify-end gap-1 overflow-x-auto px-4 py-2 sm:px-6">
          {NAV.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => go(id)}
              aria-current={page === id ? "page" : undefined}
              className={`relative whitespace-nowrap rounded-md px-3 py-1 text-[13px] transition-colors ${
                page === id ? "font-semibold text-mem-navy" : "font-medium text-slate-600 hover:text-mem-navy"
              }`}
            >
              {label}
              {page === id && (
                <span className="absolute -bottom-[6px] left-3 right-3 h-[3px] rounded-full bg-mem-blue" />
              )}
            </button>
          ))}
        </nav>
      </footer>
    </div>
  );
}
