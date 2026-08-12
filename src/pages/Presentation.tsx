import { motion } from "motion/react";
import { Activity, ShieldCheck, Sparkles } from "lucide-react";
import { VimeoEmbed } from "../components/mem/VimeoEmbed";

export function Presentation() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="mx-auto w-full max-w-5xl px-6 pt-10 pb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Agentforce · Data Cloud · Salesforce
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="text-4xl font-extrabold leading-tight text-mem-navy sm:text-6xl"
        >
          MEM <span className="mem-brand">Healthcare</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className="mx-auto mt-4 max-w-2xl text-base text-slate-600 sm:text-lg"
        >
          Inteligencia clínica agéntica que unifica expedientes, telemetría y logística médica
          en una sola consola en tiempo real.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-slate-600"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 shadow-sm">
            <Activity className="h-4 w-4 text-blue-600" /> Monitoreo continuo
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 shadow-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-600" /> Cumplimiento GDPR / HIPAA
          </span>
        </motion.div>
      </section>

      {/* 100% full-width embedded video */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="w-full"
      >
        <VimeoEmbed videoId="1217024164" title="Firefly genera una portada interactiva render 8k" />
      </motion.section>
    </div>
  );
}
