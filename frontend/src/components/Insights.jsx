import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "./Reveal";
import { api } from "../lib/api";
import { Sparkles, Loader2, ArrowUpRight, ArrowDownRight } from "lucide-react";

const ASSETS = ["BTC", "ETH", "SOL", "USDT", "USDC"];

export const Insights = () => {
  const [active, setActive] = useState("BTC");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async (sym) => {
    setActive(sym);
    setLoading(true);
    setData(null);
    try {
      const res = await api.post("/insights", { symbol: sym });
      setData(res.data);
    } catch (e) {
      setData({ insight: "Insight unavailable right now. Please try again.", symbol: sym });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="insights" data-testid="insights-section" className="py-24 md:py-32 border-t border-white/10 relative z-10 bg-[#060606]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#F0B90B] mb-4 flex items-center gap-2">
            <Sparkles size={14} /> AI Market Desk · Powered by Claude
          </p>
          <h2 className="font-head text-3xl md:text-5xl font-bold tracking-tight max-w-3xl">
            Instant institutional briefings.
          </h2>
          <p className="mt-5 text-white/55 max-w-xl leading-relaxed">
            Pick an asset and our AI desk generates a live briefing using current market data —
            no predictions, just clear OTC context.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <div className="flex md:flex-col gap-2 flex-wrap">
              {ASSETS.map((a) => (
                <button
                  key={a}
                  data-testid={`insight-asset-${a}`}
                  onClick={() => generate(a)}
                  className={`font-mono text-sm px-5 py-4 border text-left transition-colors md:w-full flex items-center justify-between ${
                    active === a && data
                      ? "bg-[#F0B90B] text-black border-[#F0B90B]"
                      : "border-white/15 text-white/70 hover:border-[#F0B90B]/60"
                  }`}
                >
                  <span className="font-bold">{a}</span>
                  <ArrowUpRight size={15} />
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-8">
            <div className="min-h-[280px] border border-white/10 bg-[#0C0C0C] p-8 md:p-10 relative">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3 text-white/50 font-mono text-sm h-full">
                    <Loader2 className="animate-spin" size={18} /> Generating {active} briefing…
                  </motion.div>
                ) : data ? (
                  <motion.div key={data.symbol + data.insight.slice(0, 8)} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} data-testid="insight-result">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="font-head font-black text-3xl">{data.symbol}</span>
                      {data.market && (
                        <span className="font-mono text-sm flex items-center gap-2 text-white/70">
                          ${data.market.price?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                          <span className="flex items-center gap-0.5" style={{ color: data.market.change >= 0 ? "#0ECB81" : "#F6465D" }}>
                            {data.market.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {Math.abs(data.market.change).toFixed(2)}%
                          </span>
                        </span>
                      )}
                    </div>
                    <div
                      className="text-white/75 leading-relaxed text-sm md:text-base whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{ __html: data.insight.replace(/\*\*(.+?)\*\*/g, "<b class='text-white'>$1</b>") }}
                    />
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full text-center gap-3 text-white/40">
                    <Sparkles size={32} strokeWidth={1} />
                    <p className="font-mono text-sm">Select an asset to generate an AI briefing.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
