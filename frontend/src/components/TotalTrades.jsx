import { useState, useEffect } from "react";
import { Reveal } from "./Reveal";
import { Activity, TrendingUp, IndianRupee, Layers } from "lucide-react";

const RATE_MIN = 101.7, RATE_MAX = 102.4;
const VOL_MIN = 5099000, VOL_MAX = 7523900;

// deterministic pseudo-random in [0,1) from an integer seed
const rand = (seed) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const fmtDate = (d) =>
  `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;

const dayData = (date) => {
  const day = Math.floor(date.getTime() / 86400000);
  const r = rand(day);
  const r2 = rand(day + 0.5);
  const r3 = rand(day + 0.9);
  // keep inner ranges so live ticking stays within bounds
  const rate = 101.75 + r * (102.35 - 101.75);
  const volume = 5160000 + r2 * (7340000 - 5160000);
  const trades = 42 + Math.floor(r3 * 168);
  return { rate, volume, trades };
};

export const TotalTrades = () => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 2500);
    return () => clearInterval(t);
  }, []);

  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    return { date: d, ...dayData(d) };
  });

  const base = days[0];
  const now = Date.now();
  const liveRate = Math.min(RATE_MAX, Math.max(RATE_MIN, base.rate + Math.sin(now / 4000) * 0.05));
  const liveVolume = Math.min(VOL_MAX, base.volume + Math.floor(Math.abs(Math.sin(now / 6000)) * 18000));
  const liveTrades = base.trades + (tick % 5);

  const STATS = [
    { icon: IndianRupee, label: "Live USDT Rate (INR)", value: `₹${liveRate.toFixed(2)}`, sub: "per USDT" },
    { icon: TrendingUp, label: "Today's Volume", value: inr(liveVolume), sub: "INR settled" },
    { icon: Layers, label: "Trades Executed", value: liveTrades, sub: `as on ${fmtDate(today)}` },
  ];

  return (
    <section id="trades" data-testid="total-trades-section" className="py-24 md:py-32 border-t vx-border relative z-10 vx-bg">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#F0B90B] mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0ECB81] animate-pulse" /> Live Desk Activity
          </p>
          <h2 className="font-head text-3xl md:text-5xl font-bold tracking-tight vx-text">Total Trades</h2>
          <p className="mt-5 vx-muted max-w-2xl leading-relaxed">
            Systematic view of our OTC settlement activity — indicative USDT rate, daily INR volume
            and trades executed. Figures update through the day.
          </p>
        </Reveal>

        {/* Live stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px vx-line-bg border vx-border mt-12">
          {STATS.map((s, i) => (
            <div key={i} data-testid={`trade-stat-${i}`} className="vx-surface p-8 md:p-10">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] vx-faint mb-4">
                <s.icon size={15} className="text-[#F0B90B]" /> {s.label}
              </div>
              <div className="font-head font-black text-3xl md:text-5xl vx-text tracking-tight tabular-nums">{s.value}</div>
              <div className="mt-2 font-mono text-xs vx-muted">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Daily table */}
        <Reveal>
          <div className="mt-10 border vx-border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b vx-border font-mono text-xs uppercase tracking-wider vx-faint text-left">
                  <th className="p-4">Date</th>
                  <th className="p-4">USDT Rate (INR)</th>
                  <th className="p-4">Volume (INR)</th>
                  <th className="p-4">Trades Executed</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {days.map((d, i) => {
                  const isToday = i === 0;
                  return (
                    <tr key={i} data-testid={`trade-row-${i}`} className="border-b vx-border vx-row-hover transition-colors vx-text">
                      <td className="p-4 font-mono">{fmtDate(d.date)}</td>
                      <td className="p-4 font-mono text-[#F0B90B]">₹{(isToday ? liveRate : d.rate).toFixed(2)}</td>
                      <td className="p-4 font-mono tabular-nums">{inr(isToday ? liveVolume : d.volume)}</td>
                      <td className="p-4 font-mono">{isToday ? liveTrades : d.trades}</td>
                      <td className="p-4">
                        {isToday ? (
                          <span className="font-mono text-xs inline-flex items-center gap-1.5" style={{ color: "#0ECB81" }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0ECB81] animate-pulse" /> LIVE
                          </span>
                        ) : (
                          <span className="font-mono text-xs vx-faint inline-flex items-center gap-1.5">
                            <Activity size={12} /> Settled
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 font-mono text-[11px] vx-faint">
            Indicative figures shown for reference. Actual execution rate and volume depend on transaction size, liquidity and prevailing market conditions.
          </p>
        </Reveal>
      </div>
    </section>
  );
};
