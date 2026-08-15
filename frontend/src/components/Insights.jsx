import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "./Reveal";
import { api } from "../lib/api";
import { Sparkles, Loader2, ArrowUpRight, ArrowDownRight, RotateCw, ArrowRight } from "lucide-react";

const ASSETS = [
  { sym: "BTC", name: "Bitcoin" },
  { sym: "ETH", name: "Ethereum" },
  { sym: "SOL", name: "Solana" },
  { sym: "USDT", name: "Tether" },
  { sym: "USDC", name: "USD Coin" },
];

const fmtPrice = (p) =>
  p >= 1 ? p.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 }) : p.toFixed(4);

const fmtVol = (v) => {
  if (!v) return "—";
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
  return `$${v.toLocaleString()}`;
};

const fmtTime = (iso) => {
  try {
    return new Date(iso).toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour12: false,
    }) + " IST";
  } catch {
    return "—";
  }
};

const Metric = ({ label, children, mono = true, accent }) => (
  <div className="border vx-border p-4">
    <div className="font-mono text-[10px] uppercase tracking-[0.15em] vx-faint mb-2">{label}</div>
    <div className={`${mono ? "font-mono" : "font-head font-semibold"} text-base md:text-lg ${accent || "vx-text"}`}>
      {children}
    </div>
  </div>
);

export const Insights = () => {
  const [active, setActive] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const generate = async (sym) => {
    setActive(sym);
    setLoading(true);
    setError(false);
    setData(null);
    try {
      const res = await api.post("/insights", { symbol: sym });
      setData(res.data);
    } catch (e) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const up = data?.market?.change >= 0;

  return (
    <section id="insights" data-testid="insights-section" className="py-24 md:py-32 border-t vx-border relative z-10 vx-bg">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#F0B90B] mb-4 flex items-center gap-2">
            <Sparkles size={14} /> AI Market Desk · Vortex Intelligence
          </p>
          <h2 className="font-head text-3xl md:text-5xl font-bold tracking-tight max-w-3xl vx-text">
            Real-Time Market Intelligence.
          </h2>
          <p className="mt-5 vx-muted max-w-2xl leading-relaxed">
            Select an asset to view a concise market briefing with current pricing, liquidity
            indicators and OTC execution context.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          {/* Asset selector */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="flex md:flex-col gap-2 flex-wrap">
              {ASSETS.map((a) => {
                const isActive = active === a.sym;
                return (
                  <button
                    key={a.sym}
                    data-testid={`insight-asset-${a.sym}`}
                    onClick={() => generate(a.sym)}
                    className={`group font-mono px-5 py-4 border text-left transition-colors md:w-full flex items-center justify-between gap-3 ${
                      isActive
                        ? "bg-[#F0B90B] text-black border-[#F0B90B]"
                        : "vx-border2 hover:border-[#F0B90B]/60"
                    }`}
                  >
                    <span className="flex flex-col">
                      <span className={`font-bold text-sm ${isActive ? "text-black" : "vx-text"}`}>{a.sym}</span>
                      <span className={`text-[11px] ${isActive ? "text-black/70" : "vx-faint"}`}>{a.name}</span>
                    </span>
                    <ArrowRight size={15} className={isActive ? "text-black" : "vx-faint group-hover:text-[#F0B90B]"} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Briefing dashboard */}
          <div className="md:col-span-8 lg:col-span-9">
            <div className="min-h-[420px] border vx-border vx-surface p-6 md:p-8">
              <AnimatePresence mode="wait">
                {loading ? (
                  <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3 vx-muted font-mono text-sm min-h-[380px]">
                    <Loader2 className="animate-spin" size={18} /> Analyzing current market data…
                  </motion.div>
                ) : error ? (
                  <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} data-testid="insight-error" className="flex flex-col items-center justify-center text-center gap-4 min-h-[380px]">
                    <p className="vx-text font-head text-lg">Market briefing temporarily unavailable.</p>
                    <button
                      data-testid="insight-retry"
                      onClick={() => active && generate(active)}
                      className="bg-[#F0B90B] text-black font-bold uppercase tracking-wide text-xs px-6 py-3 hover:bg-[#FCD535] transition-colors"
                    >
                      Try Again
                    </button>
                  </motion.div>
                ) : data ? (
                  <motion.div key={data.symbol + data.updated} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} data-testid="insight-result" className="space-y-8">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-head font-black text-3xl vx-text leading-none">{data.symbol}</div>
                        <div className="font-mono text-xs vx-muted mt-1">{data.name}</div>
                      </div>
                      <button
                        data-testid="insight-refresh"
                        onClick={() => generate(data.symbol)}
                        className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest vx-muted hover:text-[#F0B90B] transition-colors border vx-border2 px-4 py-2.5"
                      >
                        Refresh Briefing <RotateCw size={13} />
                      </button>
                    </div>

                    {/* Market snapshot */}
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F0B90B] mb-3">Market Snapshot</div>
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-px vx-line-bg border vx-border">
                        <div className="vx-surface"><Metric label="Current Price">${fmtPrice(data.market.price)}</Metric></div>
                        <div className="vx-surface">
                          <Metric label="24h Change" accent={up ? "" : ""}>
                            <span className="flex items-center gap-1" style={{ color: up ? "#0ECB81" : "#F6465D" }}>
                              {up ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                              {Math.abs(data.market.change).toFixed(2)}%
                            </span>
                          </Metric>
                        </div>
                        <div className="vx-surface"><Metric label="24h Volume">{fmtVol(data.market.volume)}</Metric></div>
                        <div className="vx-surface"><Metric label="Liquidity" mono={false} accent="text-[#F0B90B]">{data.market.liquidity}</Metric></div>
                        <div className="vx-surface"><Metric label="Volatility" mono={false}>{data.market.volatility}</Metric></div>
                        <div className="vx-surface"><Metric label="Market Status" mono={false}>{data.market.status}</Metric></div>
                      </div>
                      <div className="flex flex-wrap gap-x-6 gap-y-1 mt-3 font-mono text-[11px] vx-faint">
                        <span>Market data source: {data.source}</span>
                        <span>Updated: {fmtTime(data.updated)}</span>
                      </div>
                    </div>

                    {/* AI Market Brief */}
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F0B90B] mb-3">AI Market Brief</div>
                      <div className="vx-muted leading-relaxed text-sm md:text-base space-y-3 whitespace-pre-wrap">
                        {data.brief.split(/\n{2,}/).map((p, i) => (
                          <p key={i} dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.+?)\*\*/g, "<b class='vx-text'>$1</b>") }} />
                        ))}
                      </div>
                    </div>

                    {/* OTC Execution Context */}
                    <div className="border-t vx-border pt-6">
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F0B90B] mb-3">OTC Execution Context</div>
                      <p className="vx-muted leading-relaxed text-sm md:text-base whitespace-pre-wrap">{data.otc_context}</p>
                    </div>

                    {/* Key Market Factors */}
                    <div className="border-t vx-border pt-6">
                      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#F0B90B] mb-4">Key Market Factors</div>
                      <div className="space-y-4">
                        {data.key_factors.map((f) => (
                          <div key={f.n} className="flex items-start gap-4">
                            <span className="font-mono text-[#F0B90B]/50 text-sm font-bold shrink-0">{f.n}</span>
                            <div>
                              <div className="font-head font-semibold text-sm vx-text">{f.title}</div>
                              <div className="vx-muted text-sm mt-0.5">{f.detail}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="border-t vx-border pt-6 space-y-1.5">
                      <p className="vx-faint text-xs leading-relaxed">
                        Market information is provided for informational purposes only and does not
                        constitute financial advice or a recommendation to trade.
                      </p>
                      <p className="vx-faint text-[11px] leading-relaxed opacity-80">
                        AI-generated commentary may contain errors. Verify important information against
                        reliable market-data sources.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[380px] text-center gap-3 vx-faint">
                    <Sparkles size={32} strokeWidth={1} />
                    <p className="font-mono text-sm">Select an asset to generate a market briefing.</p>
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
