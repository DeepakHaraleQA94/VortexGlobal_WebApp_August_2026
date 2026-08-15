import { ShieldCheck, Zap, Layers, Globe } from "lucide-react";

const ITEMS = [
  { icon: ShieldCheck, text: "Client Trust Is Our Output" },
  { icon: Zap, text: "Direct OTC Execution" },
  { icon: Layers, text: "USDT Settlement Specialists" },
  { icon: Globe, text: "Pune · Mumbai · Bangalore" },
];

export const Highlights = () => (
  <section data-testid="highlights-strip" className="vx-surface border-b vx-border relative z-10">
    <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-2 lg:grid-cols-4 gap-px vx-line-bg">
      {ITEMS.map((it, i) => (
        <div
          key={i}
          data-testid={`highlight-${i}`}
          className="vx-surface flex items-center gap-3 px-5 py-6 md:py-7 group"
        >
          <it.icon size={20} className="text-[#F0B90B] shrink-0" strokeWidth={1.6} />
          <span className={`font-mono text-[11px] sm:text-xs uppercase tracking-[0.12em] ${i === 0 ? "text-[#F0B90B]" : "vx-muted"}`}>
            {it.text}
          </span>
        </div>
      ))}
    </div>
  </section>
);
