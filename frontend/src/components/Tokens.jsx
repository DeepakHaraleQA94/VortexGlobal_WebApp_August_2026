import { motion } from "framer-motion";
import { Reveal } from "./Reveal";

const TOKENS = [
  { sym: "USDT", name: "Tether", tag: "Flagship", big: true },
  { sym: "BTC", name: "Bitcoin" },
  { sym: "ETH", name: "Ethereum" },
  { sym: "SOL", name: "Solana" },
  { sym: "USDC", name: "USD Coin" },
  { sym: "SPAC", name: "SPAC Token" },
  { sym: "NVDAB", name: "NVDA Tokenized" },
  { sym: "GMEB", name: "GME Tokenized" },
  { sym: "ASMLB", name: "ASML Tokenized" },
];

export const Tokens = () => (
  <section id="assets" data-testid="tokens-section" className="py-24 md:py-32 border-t border-white/10 relative z-10 bg-[#060606]">
    <div className="max-w-7xl mx-auto px-6 md:px-10">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#F0B90B] mb-4">/ Supported assets</p>
        <h2 className="font-head text-3xl md:text-5xl font-bold tracking-tight max-w-3xl">
          Access to every major crypto token.
        </h2>
      </Reveal>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 mt-16">
        {TOKENS.map((t, i) => (
          <motion.div
            key={t.sym}
            data-testid={`token-${t.sym}`}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            whileHover={{ y: -6 }}
            className={`group relative border border-white/10 bg-[#0C0C0C] p-6 md:p-8 hover:border-[#F0B90B]/60 transition-colors duration-300 overflow-hidden ${
              t.big ? "col-span-2 md:col-span-2 md:row-span-1" : ""
            }`}
          >
            {t.tag && (
              <span className="absolute top-5 right-5 font-mono text-[10px] uppercase tracking-widest text-black bg-[#F0B90B] px-2 py-1">
                {t.tag}
              </span>
            )}
            <div className="font-head font-black text-2xl md:text-4xl tracking-tight text-white group-hover:text-[#F0B90B] transition-colors">
              {t.sym}
            </div>
            <div className="mt-2 font-mono text-xs md:text-sm text-white/40">{t.name}</div>
            {t.big && (
              <p className="mt-4 text-sm text-white/50 max-w-md">
                Our primary settlement asset. Institutional-grade USDT liquidity, buy & sell,
                cleared daily for 8 major clients.
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
