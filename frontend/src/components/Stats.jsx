import { motion } from "framer-motion";
import { Reveal } from "./Reveal";

const STATS = [
  { value: "₹20–50L", label: "Daily Settlement Volume", sub: "USDT · executed daily" },
  { value: "08", label: "Major Institutional Clients", sub: "active settlement partners" },
  { value: "100%", label: "Secured OTC Settlements", sub: "dealer-to-client, off-exchange" },
];

export const Stats = () => (
  <section data-testid="stats-section" className="py-24 md:py-32 border-b border-white/10 relative z-10 bg-[#060606]">
    <div className="max-w-7xl mx-auto px-6 md:px-10">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#F0B90B] mb-14">
          / By the numbers
        </p>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.12 }}
            className="bg-[#060606] p-10 md:p-12"
            data-testid={`stat-${i}`}
          >
            <div className="font-mono font-bold text-[#F0B90B] text-4xl md:text-6xl tracking-tight">
              {s.value}
            </div>
            <div className="mt-4 font-head text-base md:text-lg font-semibold">{s.label}</div>
            <div className="mt-1 text-sm text-white/40 font-mono">{s.sub}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
