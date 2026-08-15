import { motion } from "framer-motion";
import { Reveal } from "./Reveal";
import { ArrowRight } from "lucide-react";

const CORE = [
  {
    sym: "USDT",
    name: "Tether",
    desc: "Core settlement asset for OTC transactions, supporting high-volume USDT buy and sell requirements subject to liquidity and settlement conditions.",
    badge: "CORE",
  },
  {
    sym: "BTC",
    name: "Bitcoin",
    desc: "Major digital asset available for OTC buying, selling and settlement, subject to liquidity and transaction requirements.",
  },
  {
    sym: "ETH",
    name: "Ethereum",
    desc: "Digital asset supported for OTC transactions and settlement, subject to market availability.",
  },
  {
    sym: "SOL",
    name: "Solana",
    desc: "High-liquidity digital asset available for supported OTC transactions, subject to market conditions.",
  },
  {
    sym: "USDC",
    name: "USD Coin",
    desc: "USD-pegged digital asset available for supported OTC trading and settlement requirements.",
  },
];

const TOKENIZED = [
  { sym: "SPAC", name: "SPAC Token" },
  { sym: "NVDAB", name: "NVDA Tokenized" },
  { sym: "GMEB", name: "GME Tokenized" },
  { sym: "ASMLB", name: "ASML Tokenized" },
];

const TOKENIZED_DESC =
  "Tokenized asset available subject to product availability, liquidity and applicable requirements.";

const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

const AssetCard = ({ sym, name, desc, badge, category, index }) => (
  <motion.div
    data-testid={`token-${sym}`}
    initial={{ opacity: 0, y: 22 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.05 }}
    className="group h-full flex flex-col border border-white/10 bg-[#0C0C0C] p-7 md:p-8 hover:border-[#F0B90B]/60 transition-colors duration-200 relative"
  >
    {badge && (
      <span className="absolute top-6 right-6 font-mono text-[10px] uppercase tracking-widest text-black bg-[#F0B90B] px-2 py-1">
        {badge}
      </span>
    )}
    <div className="font-head font-black text-3xl md:text-4xl tracking-tight text-white group-hover:text-[#F0B90B] transition-colors duration-200">
      {sym}
    </div>
    <div className="mt-1.5 font-mono text-xs md:text-sm text-white/50">{name}</div>
    <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[#F0B90B]/70">
      {category}
    </div>
    <p className="mt-4 text-sm text-white/55 leading-relaxed flex-1">{desc}</p>
    <div className="mt-6 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-white/10 pt-4">
      <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-white/50">
        <span className="w-1.5 h-1.5 rounded-full bg-[#F0B90B]" /> Supported
      </span>
      <button
        onClick={() => go("contact")}
        data-testid={`token-quote-${sym}`}
        className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-white/50 group-hover:text-[#F0B90B] transition-colors"
      >
        Request Quote
        <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform duration-200" />
      </button>
    </div>
  </motion.div>
);

export const Tokens = () => (
  <section id="assets" data-testid="tokens-section" className="py-24 md:py-32 border-t border-white/10 relative z-10 bg-[#060606]">
    <div className="max-w-7xl mx-auto px-6 md:px-10">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#F0B90B] mb-4">/ Supported assets</p>
        <h2 className="font-head text-3xl md:text-5xl font-bold tracking-tight max-w-3xl">
          Access to Selected Digital Assets.
        </h2>
        <p className="mt-6 text-white/55 max-w-2xl leading-relaxed text-base md:text-lg">
          Trade and settle supported digital assets through our OTC desk, with availability based
          on market liquidity and transaction requirements.
        </p>
      </Reveal>

      {/* Category 1 */}
      <Reveal>
        <div className="mt-16 flex items-center gap-4">
          <h3 className="font-head text-xl md:text-2xl font-semibold text-white">Core Digital Assets</h3>
          <div className="flex-1 h-px bg-white/10" />
        </div>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8 items-stretch">
        {CORE.map((a, i) => (
          <AssetCard key={a.sym} {...a} category="Core Digital Asset" index={i} />
        ))}
      </div>

      {/* Category 2 */}
      <Reveal>
        <div className="mt-16 flex items-center gap-4">
          <h3 className="font-head text-xl md:text-2xl font-semibold text-white">Tokenized Assets</h3>
          <div className="flex-1 h-px bg-white/10" />
        </div>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-8 items-stretch">
        {TOKENIZED.map((a, i) => (
          <AssetCard key={a.sym} {...a} desc={TOKENIZED_DESC} category="Tokenized Asset" index={i} />
        ))}
      </div>

      {/* Request-asset CTA */}
      <Reveal>
        <div className="mt-16 border border-white/10 bg-[#0C0C0C] p-10 md:p-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="max-w-xl">
            <h3 className="font-head text-2xl md:text-3xl font-bold text-white tracking-tight">
              Looking for an asset not listed?
            </h3>
            <p className="mt-4 text-white/55 leading-relaxed">
              Contact our OTC desk to check asset availability, liquidity and settlement options.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 shrink-0">
            <button
              data-testid="assets-cta-request"
              onClick={() => go("contact")}
              className="bg-[#F0B90B] text-black font-bold uppercase tracking-wide text-sm px-8 py-4 hover:bg-[#FCD535] transition-colors inline-flex items-center gap-2"
            >
              Request an Asset
              <ArrowRight size={15} />
            </button>
            <button
              data-testid="assets-cta-contact"
              onClick={() => go("contact")}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-white/70 hover:text-[#F0B90B] transition-colors"
            >
              Contact the Desk
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </Reveal>

      {/* Disclaimer */}
      <Reveal>
        <p data-testid="assets-disclaimer" className="mt-8 text-xs text-white/35 leading-relaxed max-w-3xl font-mono">
          Asset availability, liquidity and trading support may vary. Digital-asset transactions
          are subject to applicable requirements, market conditions and our internal policies.
        </p>
      </Reveal>
    </div>
  </section>
);
