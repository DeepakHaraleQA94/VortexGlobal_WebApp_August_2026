import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export const TrustBanner = () => (
  <section data-testid="trust-banner" className="vx-bg border-y vx-border py-20 md:py-28 relative z-10">
    <div className="max-w-4xl mx-auto px-6 md:px-10 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center justify-center w-14 h-14 border vx-border2 mb-8"
      >
        <ShieldCheck size={26} className="text-[#F0B90B]" strokeWidth={1.6} />
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="font-head text-2xl md:text-4xl font-bold tracking-tight leading-[1.15] vx-text"
      >
        At Vortex Global Exchanges, client trust is not just our goal
        <span className="text-[#F0B90B]"> — it's our commitment.</span>
      </motion.h3>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="mt-6 vx-muted text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
      >
        Building a trustworthy future in cryptocurrency — one client relationship at a time.
      </motion.p>
    </div>
  </section>
);
