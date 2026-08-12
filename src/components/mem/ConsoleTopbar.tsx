import { useState } from "react";
import { Grid3x3, Star, Plus, CloudUpload, HelpCircle, Settings, Bell, ChevronDown } from "lucide-react";

const TABS = [
  "Home",
  "Opportunities",
  "Leads",
  "Tasks",
  "Accounts",
  "Contacts",
  "Campaigns",
  "Dashboards",
  "Reports",
  "Chatter",
  "Groups",
  "More",
];

const NO_CHEVRON = new Set(["Home", "Chatter"]);

export function ConsoleTopbar() {
  const [active, setActive] = useState("Home");

  return (
    <header className="rounded-2xl border border-white/70 bg-white/90 px-4 py-2.5 shadow-sm backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <span className="mem-brand text-2xl leading-none">MEM</span>

        <div className="flex items-center gap-2 pl-2">
          <Grid3x3 className="h-4 w-4 text-[#2563eb]" />
          <span className="text-sm font-bold text-[#2563eb]">MEM Healthcare</span>
        </div>

        <nav className="mx-3 hidden flex-1 items-center gap-1 overflow-x-auto lg:flex">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActive(tab)}
              className={`flex items-center gap-0.5 whitespace-nowrap rounded-md px-2 py-1 text-[13px] transition-colors ${
                active === tab
                  ? "font-semibold text-mem-navy"
                  : "font-medium text-slate-600 hover:text-mem-navy"
              }`}
            >
              {tab}
              {!NO_CHEVRON.has(tab) && <ChevronDown className="h-3 w-3 opacity-60" />}
              {active === tab && (
                <span className="absolute -bottom-[10px] left-2 right-2 h-[3px] rounded-full bg-[#2563eb]" />
              )}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 text-slate-500">
          <button className="flex items-center gap-1 rounded-md border border-slate-200 px-1.5 py-1 hover:bg-slate-50">
            <Star className="h-4 w-4 fill-slate-300 text-slate-400" />
            <ChevronDown className="h-3 w-3" />
          </button>
          {[Plus, CloudUpload, HelpCircle, Settings, Bell].map((Icon, i) => (
            <button
              key={i}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 hover:text-mem-navy"
            >
              <Icon className="h-[18px] w-[18px]" />
            </button>
          ))}
          <div className="ml-1 h-8 w-8 rounded-full bg-gradient-to-br from-[#0b1e45] to-[#334155] ring-2 ring-white" />
        </div>
      </div>
    </header>
  );
}
