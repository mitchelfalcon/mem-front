import React, { useState } from "react";
import { motion } from "motion/react";
import { Clock, Plus, Command, Sparkles } from "lucide-react";
import { CustomMicVoiceIcon } from "./custom-voice-icon";

export function MilestonesTimeline() {
  const [inputText, setInputText] = useState("Create Opportunity Chart with Region filter");
  const [pillActive, setPillActive] = useState(true);

  const days = [
    { label: "Mon", num: 18, active: false },
    { label: "Tue", num: 19, active: false },
    { label: "Wed", num: 20, active: true },
    { label: "Thu", num: 21, active: false },
    { label: "Fri", num: 22, active: false },
  ];

  const hours = ["09:00", "10:00", "11:00", "12:00", "13:00"];

  return (
    <div
      className="p-6 rounded-3xl relative overflow-hidden flex flex-col h-full"
      style={{
        background: "rgba(240, 246, 255, 0.48)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255, 255, 255, 0.7)",
        boxShadow: "14px 14px 32px rgba(150, 175, 205, 0.32), -14px -14px 32px rgba(255, 255, 255, 0.95), inset 3px 3px 6px rgba(255, 255, 255, 0.8), inset -3px -3px 6px rgba(150, 175, 205, 0.15)",
      }}
    >
      {/* Header section with timeline title */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e3a8a] font-display">
            Creation Milestones Timeline
          </h3>
          <p className="text-[10px] text-black font-semibold mt-0.5 font-sans">
            Weekly scheduling for voice-authored designs and CRM operations
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2563eb]/10 hover:bg-[#2563eb]/20 text-[#2563eb] text-[10px] font-bold uppercase transition-all shadow-sm">
          <Plus className="w-3 h-3" /> Add Milestone
        </button>
      </div>

      {/* Grid columns: Left Hour Axis, and 5 Days */}
      <div className="grid grid-cols-6 gap-3 flex-1 min-h-[460px] relative pb-20">
        
        {/* Hour Axis on Left */}
        <div className="col-span-1 flex flex-col justify-between pt-10 pb-4 text-[10px] font-mono font-bold text-slate-400">
          {hours.map((hr) => (
            <div key={hr} className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-300" />
              <span>{hr}</span>
            </div>
          ))}
        </div>

        {/* 5 Days Columns */}
        {days.map((day, idx) => (
          <div key={idx} className="col-span-1 flex flex-col h-full relative">
            {/* Header day capsule */}
            <div
              className="text-center p-2 rounded-2xl mb-4 flex flex-col justify-center items-center"
              style={{
                background: day.active ? "linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)" : "rgba(255,255,255,0.6)",
                boxShadow: day.active ? "4px 4px 10px rgba(37,99,235,0.25)" : "2px 2px 5px rgba(165,185,210,0.1)",
                border: day.active ? "1px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.8)",
              }}
            >
              <span className={`text-[10px] uppercase tracking-wider font-semibold ${day.active ? "text-white/80" : "text-slate-400"}`}>
                {day.label}
              </span>
              <span className={`text-base font-black tracking-tight leading-none mt-0.5 ${day.active ? "text-white" : "text-[#1e3a8a]"}`}>
                {day.num}
              </span>
            </div>

            {/* Column Body Container */}
            <div className="flex-1 rounded-2xl bg-slate-950/[0.01] border border-dashed border-slate-200/50 relative p-1.5 space-y-3">
              
              {/* Monday Columns Cards */}
              {day.num === 18 && (
                <>
                  <div className="p-3 rounded-2xl text-left bg-[#2563eb] text-white shadow-md border border-white/20">
                    <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-white/70 block">09:00 - 10:00</span>
                    <span className="text-[10.5px] font-black leading-tight block mt-1">Voice API Integration Check</span>
                  </div>
                  <div className="p-3 rounded-2xl text-left bg-[#60a5fa] text-white shadow-sm border border-white/20">
                    <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-white/70 block">10:00 - 10:30</span>
                    <span className="text-[10.5px] font-black leading-tight block mt-1">Moodboard Creation</span>
                  </div>
                  <div className="p-2.5 rounded-xl text-center bg-slate-100 border border-slate-200/50 opacity-75">
                    <div className="flex flex-col items-center gap-0.5">
                      <span className="text-[9px] font-bold text-slate-500">Brake time</span>
                      {/* White stripe graphics at bottom */}
                      <div className="flex gap-1 mt-1 justify-center">
                        <div className="w-4 h-1 bg-white rounded-full shadow-inner" />
                        <div className="w-4 h-1 bg-white rounded-full shadow-inner" />
                        <div className="w-4 h-1 bg-white rounded-full shadow-inner" />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Tuesday Columns Cards */}
              {day.num === 19 && (
                <div className="p-3 rounded-2xl text-left border border-[#2563eb]/45 bg-white/70 text-[#1e3a8a] shadow-sm relative overflow-hidden group">
                  <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-slate-400 block">09:00 - 10:30</span>
                  <span className="text-[10.5px] font-black leading-tight block mt-1 text-[#2563eb]">Typography & Layout Design</span>
                  <p className="text-[9px] text-slate-500 mt-1.5 leading-snug">
                    Help with chonts fonts and layout elements to the design
                  </p>
                </div>
              )}

              {/* Wednesday Columns Cards */}
              {day.num === 20 && (
                <div className="p-3 rounded-2xl text-left bg-gradient-to-br from-[#2563eb] to-[#1e3a8a] text-white shadow-md border border-white/20">
                  <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-white/70 block">09:00 - 10:30</span>
                  <span className="text-[10.5px] font-black leading-tight block mt-1">Active Session Review (Revenue Obji)</span>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-[8px] uppercase tracking-wider font-bold bg-white/20 px-1.5 py-0.5 rounded">Active</span>
                    <Sparkles className="w-3 h-3 text-white/70 animate-pulse" />
                  </div>
                </div>
              )}

              {/* Thursday Columns Cards */}
              {day.num === 21 && (
                <div className="p-3 rounded-2xl text-left bg-[#1e3a8a] text-white shadow-md border border-white/20">
                  <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-white/70 block">09:00 - 10:30</span>
                  <span className="text-[10.5px] font-black leading-tight block mt-1">UX Flaw Validation</span>
                  <p className="text-[9px] text-white/70 mt-1.5 leading-snug">
                    Create an appealing and visually engaging interface
                  </p>
                </div>
              )}

              {/* Friday Columns Cards */}
              {day.num === 22 && (
                <>
                  <div className="p-2.5 rounded-2xl text-left bg-sky-100 text-[#1e3a8a] shadow-sm border border-sky-200">
                    <span className="text-[8px] font-mono font-bold text-slate-400 block">09:00 - 09:45</span>
                    <span className="text-[10px] font-bold block mt-0.5">Conduct User Testing</span>
                  </div>
                  <div className="p-3 rounded-2xl text-left bg-[#2563eb] text-white shadow-md border border-white/20">
                    <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-white/70 block">10:00 - 11:30</span>
                    <span className="text-[10.5px] font-black leading-tight block mt-1">Voion Presentation</span>
                    <p className="text-[9px] text-white/70 mt-1.5 leading-snug">
                      Present the project and anther feedback from the starrt
                    </p>
                  </div>
                  <div className="p-2 rounded-xl text-center border border-[#2563eb]/20 bg-white/40 text-[9px] font-bold text-slate-500">
                    showcase the design
                  </div>
                </>
              )}

            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
