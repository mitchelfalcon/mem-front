import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Search, Send, Check } from "lucide-react";

const CONTACTS = [
  { id: "1", name: "Ana Martínez",  role: "CFO",              dept: "Finanzas",    initials: "AM", color: "#10b981" },
  { id: "2", name: "Carlos López",  role: "Jefe Operaciones", dept: "Operaciones", initials: "CL", color: "#3b82f6" },
  { id: "3", name: "Sofía Chen",    role: "Directora BI",     dept: "Analytics",   initials: "SC", color: "#8b5cf6" },
  { id: "4", name: "Diego Ramos",   role: "CTO",              dept: "Tecnología",  initials: "DR", color: "#f59e0b" },
  { id: "5", name: "Lucía Torres",  role: "Gerente Legal",    dept: "Legal",       initials: "LT", color: "#06b6d4" },
  { id: "6", name: "Marco Vela",    role: "VP Ventas",        dept: "Ventas",      initials: "MV", color: "#ec4899" },
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ isOpen, onClose }: Props) {
  const [query, setQuery]       = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [sent, setSent]         = useState(false);

  const filtered = CONTACTS.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.dept.toLowerCase().includes(query.toLowerCase()) ||
    c.role.toLowerCase().includes(query.toLowerCase())
  );

  const toggle = (id: string) =>
    setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const handleSend = () => {
    if (selected.length === 0) return;
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setSelected([]);
      setQuery("");
      onClose();
    }, 1600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ backdropFilter: "blur(14px)", background: "rgba(3,16,12,0.72)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl overflow-hidden"
            style={{
              background: "rgba(4,20,15,0.98)",
              border: "1px solid rgba(0,255,163,0.18)",
              boxShadow: "0 28px 80px rgba(0,0,0,0.65), 0 0 40px rgba(0,255,163,0.06)",
            }}
            initial={{ opacity: 0, scale: 0.91, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.91, y: 28 }}
            transition={{ type: "spring", stiffness: 280, damping: 26 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid rgba(0,255,163,0.1)" }}>
              <div>
                <h3 className="font-bold text-sm" style={{ color: "#d4ede6", fontFamily: "'Segoe UI', -apple-system, sans-serif" }}>
                  Compartir Vista
                </h3>
                <p className="text-[11px] mt-0.5" style={{ color: "#4a7268", fontFamily: "'Segoe UI', -apple-system, sans-serif" }}>
                  Selecciona destinatarios del reporte
                </p>
              </div>
              <motion.button
                onClick={onClose}
                className="p-1.5 rounded-lg"
                style={{ background: "rgba(0,255,163,0.06)", border: "1px solid rgba(0,255,163,0.12)" }}
                whileHover={{ background: "rgba(0,255,163,0.12)" }}
                whileTap={{ scale: 0.91 }}
              >
                <X className="w-4 h-4" style={{ color: "#4a7268" }} />
              </motion.button>
            </div>

            {/* Search */}
            <div className="px-5 py-3" style={{ borderBottom: "1px solid rgba(0,255,163,0.07)" }}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#4a7268" }} />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Buscar por nombre o departamento..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg text-xs outline-none"
                  style={{
                    background: "rgba(0,153,112,0.06)",
                    border: "1px solid rgba(0,153,112,0.12)",
                    color: "#b0cfc4",
                    fontFamily: "'Segoe UI', -apple-system, sans-serif",
                  }}
                />
              </div>
            </div>

            {/* Contact list */}
            <div className="overflow-y-auto px-3 py-2" style={{ maxHeight: "15.5rem" }}>
              {filtered.map(contact => {
                const isSel = selected.includes(contact.id);
                return (
                  <motion.button
                    key={contact.id}
                    onClick={() => toggle(contact.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-left"
                    style={{
                      background: isSel ? "rgba(0,255,163,0.08)" : "transparent",
                      border: `1px solid ${isSel ? "rgba(0,255,163,0.22)" : "transparent"}`,
                      transition: "all 0.15s ease",
                    }}
                    whileHover={{ background: "rgba(0,153,112,0.07)" }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                        style={{
                          background: `${contact.color}20`,
                          color: contact.color,
                          border: `1px solid ${contact.color}40`,
                        }}
                      >
                        {contact.initials}
                      </div>
                      <AnimatePresence>
                        {isSel && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                            style={{ background: "#00ffa3" }}
                          >
                            <Check className="w-2.5 h-2.5" style={{ color: "#001a0e" }} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate"
                        style={{ color: "#d4ede6", fontFamily: "'Segoe UI', -apple-system, sans-serif" }}>
                        {contact.name}
                      </p>
                      <p className="text-[11px] truncate"
                        style={{ color: "#4a7268", fontFamily: "'Segoe UI', -apple-system, sans-serif" }}>
                        {contact.role} · {contact.dept}
                      </p>
                    </div>

                    <div className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: contact.color, boxShadow: `0 0 5px ${contact.color}` }} />
                  </motion.button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-5 py-4" style={{ borderTop: "1px solid rgba(0,255,163,0.1)" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px]"
                  style={{ color: "#4a7268", fontFamily: "'Segoe UI', -apple-system, sans-serif" }}>
                  {selected.length > 0
                    ? `${selected.length} seleccionado${selected.length > 1 ? "s" : ""}`
                    : "Ningún contacto seleccionado"}
                </span>
                {selected.length > 0 && (
                  <button onClick={() => setSelected([])} className="text-[10px]"
                    style={{ color: "#4a7268", fontFamily: "'Segoe UI', -apple-system, sans-serif" }}>
                    Limpiar
                  </button>
                )}
              </div>

              <motion.button
                onClick={handleSend}
                disabled={selected.length === 0}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm"
                style={{
                  background: selected.length > 0
                    ? "linear-gradient(135deg, #009970 0%, #007a5e 100%)"
                    : "rgba(0,153,112,0.07)",
                  color: selected.length > 0 ? "#fff" : "#4a7268",
                  fontFamily: "'Segoe UI', -apple-system, sans-serif",
                  cursor: selected.length === 0 ? "not-allowed" : "pointer",
                  transition: "background 0.2s",
                }}
                whileHover={selected.length > 0 ? { scale: 1.02 } : {}}
                whileTap={selected.length > 0 ? { scale: 0.97 } : {}}
              >
                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.span key="sent" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2">
                      <Check className="w-4 h-4" /> Reporte Enviado
                    </motion.span>
                  ) : (
                    <motion.span key="send" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex items-center gap-2">
                      <Send className="w-4 h-4" /> Enviar Reporte
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
