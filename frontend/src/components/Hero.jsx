import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const HERO_BG =
  "https://static.prod-images.emergentagent.com/jobs/046a707f-bb66-4f03-9e0d-daa2b6f97828/images/f8fec6518f77942a8ea03f01a9a82eca1d3a2f8cd898858d7f480c56c4f5c99f.jpeg";

const lines = ["INSTITUTIONAL", "OTC CRYPTO", "SETTLEMENT DESK"];

const Line = ({ children, delay }) => (
  <span className="block overflow-hidden">
    <motion.span
      className="block"
      initial={{ y: "110%" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

export const Hero = () => {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section data-testid="hero-section" className="relative min-h-[100vh] flex flex-col justify-center pt-28 pb-16 overflow-hidden">
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      >
        <img src={HERO_BG} alt="" className="w-full h-full object-cover object-right" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060606] via-[#060606]/85 to-[#060606]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-transparent to-transparent" />
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="font-mono text-xs md:text-sm tracking-[0.25em] uppercase text-[#F0B90B] mb-6"
        >
          Vortex Crypto Services — Hinjewadi, Pune
        </motion.div>

        <h1 className="font-head font-black uppercase tracking-tighter text-[12vw] md:text-[6vw] leading-[0.95] text-white">
          {lines.map((l, i) => (
            <Line key={l} delay={0.4 + i * 0.15}>
              {i === 1 ? (
                <span className="text-[#F0B90B]">{l}</span>
              ) : (
                l
              )}
            </Line>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="max-w-xl mt-8 text-base md:text-lg text-white/60 leading-relaxed"
        >
          Deep-liquidity, over-the-counter desk for large USDT settlements and major digital
          assets. Direct dealer-to-client execution with agreed-price trades and efficient
          settlement.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <button
            data-testid="hero-trade-cta"
            onClick={() => go("contact")}
            className="bg-[#F0B90B] text-black font-bold uppercase tracking-wide px-8 py-4 hover:bg-[#FCD535] transition-colors drop-shadow-[0_0_20px_rgba(240,185,11,0.35)]"
          >
            Start a Trade
          </button>
          <button
            data-testid="hero-services-cta"
            onClick={() => go("services")}
            className="bg-transparent text-white border border-white/25 font-medium px-8 py-4 hover:border-white hover:bg-white/5 transition-colors"
          >
            Our Services
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/40"
      >
        <ArrowDown size={20} className="animate-bounce" />
      </motion.div>
    </section>
  );
};
