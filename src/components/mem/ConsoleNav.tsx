import { useState } from "react";
import { Star, Plus, CloudUpload, HelpCircle, Settings, Bell, ChevronDown } from "lucide-react";
import avatar from "../../assets/avatar.png";

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

/** Salesforce-style secondary nav tabs (consolidated into the header). */
export function ConsoleTabs() {
  const [active, setActive] = useState("Home");
  return (
    <nav className="flex items-center gap-1 overflow-x-auto">
      {TABS.map((tab) => (
        <button
          key={tab}
          type="button"
          onClick={() => setActive(tab)}
          className={`relative flex items-center gap-0.5 whitespace-nowrap rounded-md px-2 py-1 text-[13px] transition-colors ${
            active === tab ? "font-semibold text-mem-navy" : "font-medium text-slate-600 hover:text-mem-navy"
          }`}
        >
          {tab}
          {!NO_CHEVRON.has(tab) && <ChevronDown className="h-3 w-3 opacity-60" />}
          {active === tab && (
            <span className="absolute -bottom-[7px] left-2 right-2 h-[3px] rounded-full bg-mem-blue" />
          )}
        </button>
      ))}
    </nav>
  );
}

/** Salesforce-style right-hand action icons (consolidated into the header). */
export function ConsoleIcons() {
  return (
    <div className="flex items-center gap-1.5 text-slate-500">
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
      <img src={avatar} alt="Perfil" className="ml-1 h-8 w-8 rounded-full object-cover ring-2 ring-white" />
    </div>
  );
}
