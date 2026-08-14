import { Reveal } from "./Reveal";
import { Repeat, Layers, ShieldCheck, Zap } from "lucide-react";

const SERVICES = [
  {
    icon: Repeat,
    title: "OTC Trading",
    desc: "Over-the-counter trading — direct buying and selling of financial assets between two parties through a dealer network, rather than on a centralized exchange.",
  },
  {
    icon: Layers,
    title: "USDT Settlements",
    desc: "Our core business. High-volume USDT buy & sell settlements for institutional clients, handling ₹20–50 lakhs in volume every single day.",
  },
  {
    icon: Zap,
    title: "Buy & Sell Tokens",
    desc: "Instant access to all major crypto tokens — BTC, ETH, SOL, USDC, USDT and tokenized assets — with deep liquidity and tight spreads.",
  },
  {
    icon: ShieldCheck,
    title: "Zero Slippage Execution",
    desc: "Large orders filled at a single agreed price. No order-book slippage, no market impact — settlement completed immediately.",
  },
];

export const Services = () => (
  <section id="services" data-testid="services-section" className="py-24 md:py-32 relative z-10 bg-[#060606]">
    <div className="max-w-7xl mx-auto px-6 md:px-10">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#F0B90B] mb-4">/ What we do</p>
        <h2 className="font-head text-3xl md:text-5xl font-bold tracking-tight max-w-3xl">
          A dealer desk built for size and speed.
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {SERVICES.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <div
              data-testid={`service-${i}`}
              className="group h-full bg-[#0C0C0C] border border-white/10 p-8 md:p-10 hover:border-[#F0B90B]/50 hover:-translate-y-1 transition-[transform,border-color] duration-300"
            >
              <s.icon className="text-[#F0B90B] mb-6" size={30} strokeWidth={1.5} />
              <h3 className="font-head text-xl md:text-2xl font-semibold mb-3">{s.title}</h3>
              <p className="text-white/55 leading-relaxed text-sm md:text-base">{s.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
