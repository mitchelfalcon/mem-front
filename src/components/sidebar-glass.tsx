import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Grid,
  FileText,
  Calendar,
  Share2,
  Clock,
  User,
  Settings,
  Bell,
  Search,
  Users,
  Check,
  Activity,
  Moon,
  Atom,
  LogOut,
  Mic,
  Headphones,
} from "lucide-react";
import { ARCHITECTURE_NODES, ArchitectureNode } from "../types";

interface SidebarProps {
  activeSection: string;
  onSelectSection: (section: string) => void;
  activeAppMode: 'operational' | 'architecture';
  setActiveAppMode: (mode: 'operational' | 'architecture') => void;
  voiceActive: boolean;
  setVoiceActive: (active: boolean) => void;
  vetoActive: boolean;
  setVetoActive: (active: boolean) => void;
  hasRedError: boolean;
  currentDept: string;
  setCurrentDept: (dept: string) => void;
  orgDepts: string[];
  selectedNode: ArchitectureNode;
  setSelectedNode: (node: ArchitectureNode) => void;
}

export function SidebarGlass({
  activeSection,
  onSelectSection,
  activeAppMode,
  setActiveAppMode,
  voiceActive,
  setVoiceActive,
  vetoActive,
  setVetoActive,
  hasRedError,
  currentDept,
  setCurrentDept,
  orgDepts,
  selectedNode,
  setSelectedNode,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const mainNav = [
    { id: "dashboard", icon: Grid, label: "Dashboard / Workbench" },
    { id: "documents", icon: FileText, label: "Documents" },
    { id: "calendar", icon: Calendar, label: "Calendar / Schedule" },
    { id: "share", icon: Share2, label: "Share View" },
    { id: "history", icon: Clock, label: "History Logs" },
    { id: "admin", icon: User, label: "Admin Panel" },
  ];

  const filteredNodes = ARCHITECTURE_NODES.filter(node =>
    node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    node.shortDescription.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex gap-4 sticky top-0 h-screen py-5 pl-5 flex-shrink-0 z-40 select-none pointer-events-auto">
      
      {/* ─── PRIMARY SIDEBAR (EDGE-LEFT) ─── */}
      <div
        className="w-20 h-full flex flex-col items-center py-6 justify-between transition-all duration-300"
        style={{
          background: "rgba(255, 255, 255, 0.48)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.65)",
          borderRadius: "24px",
          boxShadow: "8px 8px 24px rgba(174, 192, 208, 0.22), -8px -8px 24px rgba(255, 255, 255, 0.8), inset 1px 1px 3px rgba(255, 255, 255, 0.5)",
        }}
      >
        {/* Top Section: Salesforce Cloud Logo (Styled perfectly with drop shadow) */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 flex items-center justify-center relative">
            <svg className="w-8 h-8 text-[#009fdb] drop-shadow-[0_3px_6px_rgba(0,159,219,0.35)] fill-current" viewBox="0 0 24 24">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
            </svg>
          </div>
        </div>

        {/* Middle Section: Navigation Stack (Neumorphic Rounded Square active state) */}
        <div className="flex flex-col gap-4.5">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id || (item.id === "dashboard" && activeSection === "");

            return (
              <div key={item.id} className="relative group flex justify-center">
                <motion.button
                  onClick={() => onSelectSection(item.id)}
                  className="w-11 h-11 rounded-2xl flex items-center justify-center relative transition-all duration-200 border"
                  style={{
                    background: isActive ? "linear-gradient(135deg, #f0f4f8, #ffffff)" : "transparent",
                    borderColor: isActive ? "rgba(255,255,255,0.95)" : "transparent",
                    boxShadow: isActive
                      ? "3px 3px 8px rgba(165,185,210,0.35), -3px -3px 8px rgba(255,255,255,0.9), inset 2px 2px 5px rgba(165,185,210,0.22), inset -2px -2px 5px rgba(255,255,255,0.75)"
                      : "none",
                  }}
                  whileHover={{ scale: 1.05, background: isActive ? "" : "rgba(37, 99, 235, 0.05)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-[#009fdb]" : "text-[#5b7290]"}`} />
                </motion.button>

                {/* Tooltip on Hover */}
                <div className="absolute left-16 top-1/2 -translate-y-1/2 pl-3 opacity-0 group-hover:opacity-100 transition-all pointer-events-none duration-200 z-50 whitespace-nowrap">
                  <div className="px-3 py-1.5 rounded-xl text-[10px] font-bold text-white bg-slate-900/90 backdrop-blur-md shadow-lg border border-slate-700/55">
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Section: Profile Avatar matching Image 4 */}
        <div className="relative group flex justify-center">
          <motion.button
            onClick={() => onSelectSection("admin")}
            className="w-11 h-11 rounded-full flex items-center justify-center relative bg-white border border-white/90 shadow-[3px_3px_8px_rgba(165,185,210,0.3),-3px_-3px_8px_rgba(255,255,255,0.95)] transition-all duration-200 text-[#009fdb]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User className="w-5 h-5 text-[#009fdb]" />
          </motion.button>
          <div className="absolute left-16 top-1/2 -translate-y-1/2 pl-3 opacity-0 group-hover:opacity-100 transition-all pointer-events-none duration-200 z-50 whitespace-nowrap">
            <div className="px-3 py-1.5 rounded-xl text-[10px] font-bold text-white bg-slate-900/90 backdrop-blur-md shadow-lg border border-slate-700/55">
              Admin Profile
            </div>
          </div>
        </div>
      </div>

      {/* ─── SECONDARY SIDEBAR (ATTACHED GLASS) ─── */}
      <div
        className="w-64 h-full flex flex-col p-5 justify-between transition-all duration-300 overflow-y-auto"
        style={{
          background: "rgba(255, 255, 255, 0.48)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.65)",
          borderRadius: "24px",
          boxShadow: "8px 8px 24px rgba(174, 192, 208, 0.22), -8px -8px 24px rgba(255, 255, 255, 0.8), inset 1px 1px 3px rgba(255, 255, 255, 0.5)",
        }}
      >
        <div className="space-y-5.5">
          {/* Header */}
          <div className="pb-3.5 border-b border-blue-100/50 text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5b7290]" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
              ALRO SUPREME
            </p>
            <h3 className="text-sm font-bold text-blue-950 mt-0.5" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
              {activeAppMode === 'operational' ? "Operational Control" : "Architecture Control"}
            </h3>
          </div>

          {/* SECTION 1: Controllers (Image 2 style Moon/Atom switch, Bell button, and Glass circular empty container) */}
          <div className="flex items-center justify-between bg-white/40 p-1.5 rounded-2xl border border-white/60 shadow-sm">
            {/* Moon/Atom Switch Pill */}
            <button
              onClick={() => setActiveAppMode(activeAppMode === 'operational' ? 'architecture' : 'operational')}
              className="w-16 h-8 rounded-full bg-slate-100/90 border border-slate-200/50 p-1 flex items-center relative cursor-pointer"
              style={{
                boxShadow: "inset 2px 2px 5px rgba(165,185,210,0.18), inset -2px -2px 5px rgba(255,255,255,0.75)"
              }}
              title="Toggle Workspace Mode"
            >
              <motion.div
                className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-blue-600 border border-slate-200/25"
                style={{
                  boxShadow: "1px 1px 4px rgba(165,185,210,0.25)"
                }}
                animate={{ x: activeAppMode === 'operational' ? 0 : 32 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              >
                {activeAppMode === 'operational' ? (
                  <Moon className="w-3.5 h-3.5 text-blue-600" />
                ) : (
                  <Atom className="w-3.5 h-3.5 text-blue-600" />
                )}
              </motion.div>
              <div className="absolute inset-0 flex justify-between items-center px-2 pointer-events-none text-slate-400">
                <Moon className={`w-3.5 h-3.5 ${activeAppMode === 'operational' ? 'opacity-0' : 'opacity-40'}`} />
                <Atom className={`w-3.5 h-3.5 ${activeAppMode === 'architecture' ? 'opacity-0' : 'opacity-40'}`} />
              </div>
            </button>

            {/* Notification Bell (Circular button) */}
            <button
              onClick={() => onSelectSection("alerts")}
              className="w-8 h-8 rounded-full flex items-center justify-center relative bg-white border border-slate-200/50 text-[#1e3a8a] transition-all hover:scale-105"
              style={{
                boxShadow: "2px 2px 5px rgba(165,185,210,0.2), -2px -2px 5px rgba(255,255,255,0.95)"
              }}
              title="Alertas"
            >
              <Bell className="w-3.5 h-3.5 text-blue-900" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 rounded-full text-white text-[8px] flex items-center justify-center font-bold">3</span>
            </button>

            {/* Glass circular container (Image 2 style) */}
            <button
              onClick={() => onSelectSection("settings")}
              className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-white to-slate-50 border border-slate-200/50 transition-all hover:scale-105"
              style={{
                boxShadow: "2px 2px 5px rgba(165,185,210,0.2), -2px -2px 5px rgba(255,255,255,0.95)"
              }}
              title="Ajustes de Sistema"
            >
              <Settings className="w-3.5 h-3.5 text-blue-900" />
            </button>
          </div>

          {/* DYNAMIC VIEW-BASED SECONDARY CONTENT */}
          <AnimatePresence mode="wait">
            {activeAppMode === 'operational' ? (
              <motion.div
                key="operational-sec"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {/* 1. Semáforos de Red */}
                <div className="space-y-2 text-left">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#5b7290]" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                    Semáforos de Red
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {/* Red / Error */}
                    <button
                      onClick={() => setVetoActive(!vetoActive)}
                      className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl border transition-all text-left bg-white/45"
                      style={{
                        borderColor: vetoActive ? "rgba(239, 68, 68, 0.2)" : "rgba(255, 255, 255, 0.7)",
                        boxShadow: vetoActive
                          ? "inset 1px 1px 2px rgba(255,255,255,0.8), 2px 2px 5px rgba(239, 68, 68, 0.08)"
                          : "2px 2px 5px rgba(165, 185, 210, 0.1), -1px -1px 3px rgba(255, 255, 255, 0.8)",
                      }}
                      title="Haz clic para alternar Estado VETO"
                    >
                      <span className="relative flex h-2 w-2 flex-shrink-0">
                        {hasRedError && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${hasRedError ? "bg-rose-500" : "bg-rose-500/30"}`} />
                      </span>
                      <span className={`text-[9px] font-bold font-mono ${hasRedError ? "text-rose-600" : "text-rose-400/75"}`}>🔴 ERROR</span>
                    </button>

                    {/* Yellow / Warn */}
                    <button
                      onClick={() => setVoiceActive(!voiceActive)}
                      className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl border transition-all text-left bg-white/45"
                      style={{
                        borderColor: voiceActive ? "rgba(245, 158, 11, 0.2)" : "rgba(255, 255, 255, 0.7)",
                        boxShadow: voiceActive
                          ? "inset 1px 1px 2px rgba(255,255,255,0.8), 2px 2px 5px rgba(245, 158, 11, 0.08)"
                          : "2px 2px 5px rgba(165, 185, 210, 0.1), -1px -1px 3px rgba(255, 255, 255, 0.8)",
                      }}
                      title="Haz clic para alternar Entrada de Voz"
                    >
                      <span className="relative flex h-2 w-2 flex-shrink-0">
                        {voiceActive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${voiceActive ? "bg-amber-500" : "bg-amber-500/30"}`} />
                      </span>
                      <span className={`text-[9px] font-bold font-mono ${voiceActive ? "text-amber-600" : "text-amber-400/75"}`}>🟡 WARN</span>
                    </button>

                    {/* Blue / Info */}
                    <div
                      className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl border text-left bg-white/45"
                      style={{
                        borderColor: !hasRedError ? "rgba(14, 165, 233, 0.2)" : "rgba(255, 255, 255, 0.7)",
                        boxShadow: "2px 2px 5px rgba(165, 185, 210, 0.1), -1px -1px 3px rgba(255, 255, 255, 0.8)"
                      }}
                    >
                      <span className="relative flex h-2 w-2 flex-shrink-0">
                        {!hasRedError && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${!hasRedError ? "bg-sky-500" : "bg-sky-500/30"}`} />
                      </span>
                      <span className={`text-[9px] font-bold font-mono ${!hasRedError ? "text-sky-600" : "text-sky-400/75"}`}>🔵 INFO</span>
                    </div>

                    {/* Green / OK */}
                    <div
                      className="flex items-center gap-1.5 px-2 py-1.5 rounded-xl border text-left bg-white/45"
                      style={{
                        borderColor: !hasRedError ? "rgba(16, 185, 129, 0.2)" : "rgba(255, 255, 255, 0.7)",
                        boxShadow: "2px 2px 5px rgba(165, 185, 210, 0.1), -1px -1px 3px rgba(255, 255, 255, 0.8)"
                      }}
                    >
                      <span className="relative flex h-2 w-2 flex-shrink-0">
                        {!hasRedError && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${!hasRedError ? "bg-emerald-500" : "bg-emerald-500/30"}`} />
                      </span>
                      <span className={`text-[9px] font-bold font-mono ${!hasRedError ? "text-emerald-600" : "text-emerald-400/75"}`}>🟢 OK</span>
                    </div>
                  </div>
                </div>

                {/* 2. Indicadores GDS */}
                <div className="space-y-2 text-left">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#5b7290]" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                    Indicadores GDS
                  </p>
                  <div className="space-y-1.5">
                    {[
                      { id: "flux",    label: "FLUX",    sub: "AWU_Ledger__c",  color: "#10b981" },
                      { id: "intent",  label: "INTENT",  sub: "IntentVector",   color: "#3b82f6" },
                      { id: "formula", label: "FORMULA", sub: "Colab Engine",   color: "#8b5cf6" },
                    ].map(led => (
                      <div 
                        key={led.id} 
                        className="flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white/40 border border-white/60 shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <motion.div
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: led.color, boxShadow: `0 0 4px ${led.color}88` }}
                            animate={{ opacity: [1, 0.4, 1], scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                          <span className="text-[10px] font-bold font-mono tracking-wide" style={{ color: led.color }}>{led.label}</span>
                        </div>
                        <span className="text-[8px] font-mono text-slate-400 max-w-[80px] truncate">({led.sub})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Organización / Departamento */}
                <div className="space-y-2 text-left">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#5b7290]" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                    Departamento Activo
                  </p>
                  <div className="space-y-1 bg-white/30 p-1.5 rounded-2xl border border-white/40 max-h-[170px] overflow-y-auto pr-1">
                    {orgDepts.map(dept => {
                      const isSelected = currentDept === dept;
                      return (
                        <button
                          key={dept}
                          onClick={() => setCurrentDept(dept)}
                          className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs transition-all text-left"
                          style={{
                            background: isSelected ? "rgba(37, 99, 235, 0.08)" : "transparent",
                            color: isSelected ? "#1e3a8a" : "#5b7290",
                            fontWeight: isSelected ? 700 : 400,
                          }}
                        >
                          <span style={{ fontFamily: "'Segoe UI', sans-serif" }}>{dept}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="architecture-sec"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* 1. Search */}
                <div className="flex items-center gap-2.5 p-2.5 rounded-2xl bg-white/45 border border-white/80 shadow-sm text-left">
                  <Search className="w-3.5 h-3.5 text-[#009fdb] flex-shrink-0" />
                  <input 
                    type="text" 
                    placeholder="Buscar componente..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-xs text-blue-950 placeholder-blue-300 outline-none w-full font-semibold"
                    style={{ fontFamily: "'Segoe UI', sans-serif" }}
                  />
                </div>

                {/* 2. Architecture Nodes navigation list */}
                <div className="space-y-2 text-left">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#5b7290] pl-1" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                    Nodos de Arquitectura ({filteredNodes.length})
                  </p>
                  <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1">
                    {filteredNodes.map((node) => {
                      const isSelected = selectedNode?.id === node.id;
                      const idx = ARCHITECTURE_NODES.findIndex(n => n.id === node.id);
                      return (
                        <button
                          key={node.id}
                          onClick={() => setSelectedNode(node)}
                          className="w-full text-left p-2 rounded-xl transition-all border flex items-start gap-2"
                          style={{
                            background: isSelected 
                              ? "rgba(224, 242, 254, 0.75)" 
                              : "rgba(255, 255, 255, 0.35)",
                            borderColor: isSelected ? "rgba(14, 165, 233, 0.3)" : "rgba(255, 255, 255, 0.5)",
                            boxShadow: isSelected
                              ? "inset 1px 1px 2px rgba(255, 255, 255, 0.8), 2px 2px 5px rgba(14, 165, 233, 0.08)"
                              : "2px 2px 5px rgba(165, 185, 210, 0.08), -1px -1px 3px rgba(255, 255, 255, 0.8)",
                          }}
                        >
                          <div className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center text-[10px] flex-shrink-0 ${
                            isSelected ? 'bg-[#0ea5e9] text-white shadow-sm' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {['➤', '⚛', '🔒', '🛡', '⚙', '⚖', '⏱', '🎯'][idx]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-bold text-blue-950 truncate" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                              {node.title}
                            </p>
                            <p className="text-[8px] text-[#5b7290] truncate" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
                              {node.shortDescription}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Info: Environment connectivity status */}
        <div className="pt-3.5 border-t border-blue-100/50 text-center flex flex-col gap-1 text-left">
          <p className="text-[8px] font-bold text-slate-400 tracking-widest leading-tight uppercase" style={{ fontFamily: "'Segoe UI', sans-serif" }}>
            AMB_PROD_DEMO_01
          </p>
          <div className="flex items-center gap-1.5 justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-[8px] font-bold text-[#10b981]" style={{ fontFamily: "'Segoe UI', sans-serif" }}>SECURE SYSTEM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
