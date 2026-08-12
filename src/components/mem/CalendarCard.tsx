import { useState } from "react";
import { CalendarDays, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Leading days from the previous month, then the 31 days of the month.
const PREV_DAYS = [25, 26, 27, 28];
const CURRENT_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export function CalendarCard() {
  const [monthIdx, setMonthIdx] = useState(9); // October
  const [selected, setSelected] = useState(13);

  return (
    <div className="h-full rounded-3xl border border-white/70 bg-white/90 p-4 shadow-[0_16px_40px_rgba(0,122,222,0.22)] backdrop-blur-xl">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-mem-ink" />
          <span className="text-lg font-bold text-mem-ink">Calendar</span>
        </div>
        <button className="flex items-center gap-1 text-sm font-semibold text-mem-gray transition-colors hover:text-mem-ink">
          Open <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Panel */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-100 to-slate-300/80 p-3">
        {/* Month nav */}
        <div className="mb-2 flex items-center justify-center gap-3">
          <button
            aria-label="Mes anterior"
            onClick={() => setMonthIdx((m) => (m + 11) % 12)}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-mem-ink text-white transition-transform hover:scale-110"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <span className="text-sm font-semibold text-mem-ink">{MONTHS[monthIdx]}</span>
          <button
            aria-label="Mes siguiente"
            onClick={() => setMonthIdx((m) => (m + 1) % 12)}
            className="flex h-6 w-6 items-center justify-center rounded-full bg-mem-ink text-white transition-transform hover:scale-110"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Weekday labels */}
        <div className="grid grid-cols-7 text-center text-[10px] font-medium text-slate-400">
          {WEEKDAYS.map((d) => (
            <span key={d} className="py-1">{d}</span>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-y-1.5 text-center text-[11px]">
          {PREV_DAYS.map((d) => (
            <span key={`p${d}`} className="py-1 text-slate-400/60">{d}</span>
          ))}
          {CURRENT_DAYS.map((d) => {
            const isSel = d === selected;
            return (
              <button
                key={d}
                onClick={() => setSelected(d)}
                className="flex justify-center py-0.5"
              >
                <span
                  className={`inline-flex h-6 w-8 items-center justify-center rounded-full transition-colors ${
                    isSel ? "bg-mem-lime font-bold text-mem-ink" : "text-slate-600 hover:bg-white"
                  }`}
                >
                  {d}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
