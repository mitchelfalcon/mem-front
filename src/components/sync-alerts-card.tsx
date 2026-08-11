import React from "react";
import { AlertCircle, Calendar, Sparkles } from "lucide-react";

export function SyncAlertsCard() {
  const alerts = [
    { time: "09:30 AM", msg: "Check test results", sub: "Sandbox verification", active: true },
    { time: "10:00 AM", msg: "Client Presentation", sub: "GDS Schema Review", active: false },
    { time: "04:15 PM", msg: "Add new subtask", sub: "Lead triggers verification", active: false },
  ];

  return (
    <div
      className="p-5 rounded-3xl relative overflow-hidden"
      style={{
        background: "rgba(240, 246, 255, 0.48)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255, 255, 255, 0.7)",
        boxShadow: "14px 14px 32px rgba(150, 175, 205, 0.32), -14px -14px 32px rgba(255, 255, 255, 0.95), inset 3px 3px 6px rgba(255, 255, 255, 0.8), inset -3px -3px 6px rgba(150, 175, 205, 0.15)",
      }}
    >
      {/* Decorative background star/sparkle vector in the lower right corner */}
      <div className="absolute bottom-[-16px] right-[-16px] w-24 h-24 pointer-events-none opacity-[0.06] transform rotate-12">
        <Sparkles className="w-full h-full text-blue-800" />
      </div>

      <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e3a8a] mb-4 font-display flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-[#2563eb]" /> Data Sync Alerts
      </h3>

      <div className="space-y-3 relative z-10">
        {alerts.map((al, idx) => (
          <div
            key={idx}
            className="p-3 rounded-2xl flex items-center gap-3 transition-transform hover:-translate-y-0.5 duration-200"
            style={{
              background: al.active ? "rgba(37, 99, 235, 0.08)" : "rgba(255, 255, 255, 0.3)",
              border: al.active ? "1px solid rgba(37, 99, 235, 0.25)" : "1px solid rgba(255, 255, 255, 0.6)",
              boxShadow: "4px 4px 10px rgba(165, 185, 210, 0.15)",
            }}
          >
            {/* Glossy calendar/status circle */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: al.active ? "linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)" : "rgba(255,255,255,0.8)",
                boxShadow: al.active ? "0 4px 8px rgba(37, 99, 235, 0.25)" : "none",
              }}
            >
              <Calendar className={`w-4 h-4 ${al.active ? "text-white" : "text-[#2563eb]"}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-bold text-black">{al.msg}</span>
                <span className="text-[9px] font-mono font-bold text-black">{al.time}</span>
              </div>
              <p className="text-[9.5px] text-black/85 truncate mt-0.5">{al.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
