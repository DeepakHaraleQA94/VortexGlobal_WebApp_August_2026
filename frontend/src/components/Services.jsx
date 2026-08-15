import { Reveal } from "./Reveal";
import { ArrowLeftRight, Layers, Zap, ShieldCheck, Network, ArrowRight, Check } from "lucide-react";

const SERVICES = [
  {
    icon: ArrowLeftRight,
    title: "Institutional OTC Trading",
    desc: "Direct, discreet execution for large digital-asset transactions, with personalized pricing and dedicated trade support.",
    cta: "Discuss a Trade",
  },
  {
    icon: Layers,
    title: "USDT Settlement Services",
    desc: "Efficient USDT buy and sell settlements designed for high-volume transactions, with transparent pricing and coordinated execution.",
    cta: "Request a Quote",
  },
  {
    icon: Zap,
    title: "Digital Asset Trading",
    desc: "Access to major digital assets including BTC, ETH, SOL, USDC and USDT, subject to supported markets and availability.",
    cta: "Explore Assets",
  },
  {
    icon: ShieldCheck,
    title: "Fixed-Price Execution",
    desc: "Agree on pricing before execution and settle the transaction through a streamlined OTC process, reducing exposure to market movement during execution.",
    cta: "Start a Trade",
  },
  {
    icon: Network,
    title: "Liquidity & Block Trades",
    desc: "Execute large-volume digital-asset transactions with access to deep liquidity and structured OTC execution.",
    cta: "Talk to the Desk",
    wide: true,
  },
];

const TRUST = [
  "Dedicated OTC Support",
  "Transparent Trade Process",
  "High-Volume Transaction Handling",
  "Structured Settlement Workflow",
  "KYC/AML Procedures Where Applicable",
];

const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export const Services = () => (
  <section id="services" data-testid="services-section" className="py-24 md:py-32 relative z-10 vx-bg">
    <div className="max-w-7xl mx-auto px-6 md:px-10">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#F0B90B] mb-4">/ What we do</p>
        <h2 className="font-head text-3xl md:text-5xl font-bold tracking-tight max-w-4xl leading-[1.05] vx-text">
          Institutional OTC Trading, Built for Speed and Scale.
        </h2>
        <p className="mt-6 vx-muted max-w-2xl leading-relaxed text-base md:text-lg">
          Professional digital-asset execution and settlement services designed for high-volume
          transactions and institutional clients.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 items-stretch">
        {SERVICES.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.06} className={s.wide ? "md:col-span-2" : ""}>
            <button
              type="button"
              onClick={() => go("contact")}
              data-testid={`service-${i}`}
              className="group h-full w-full text-left vx-surface border vx-border p-8 md:p-10 flex flex-col hover:border-[#F0B90B]/60 transition-colors duration-200"
            >
              <s.icon
                className="text-[#F0B90B]/80 group-hover:text-[#F0B90B] transition-colors duration-200 mb-6"
                size={28}
                strokeWidth={1.5}
              />
              <h3 className="font-head text-xl md:text-2xl font-semibold mb-3 vx-text">{s.title}</h3>
              <p className="vx-muted leading-relaxed text-sm md:text-base flex-1">{s.desc}</p>
              <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-[#F0B90B]">
                {s.cta}
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {/* Trust / process strip */}
      <Reveal>
        <div className="mt-20 border vx-border vx-surface">
          <div className="px-8 md:px-10 pt-8 pb-6 border-b vx-border">
            <h3 className="font-head text-lg md:text-xl font-semibold vx-text">
              Built for Professional Digital-Asset Trading
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {TRUST.map((t, i) => (
              <div
                key={t}
                data-testid={`trust-${i}`}
                className="flex items-start gap-3 p-6 md:p-7 border-b vx-border lg:border-b-0 lg:border-r last:border-r-0 last:border-b-0"
              >
                <Check size={16} className="text-[#F0B90B] mt-0.5 shrink-0" strokeWidth={2} />
                <span className="vx-muted text-sm leading-snug">{t}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* CTA */}
      <Reveal>
        <div className="mt-16 border vx-border vx-surface p-10 md:p-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div className="max-w-xl">
            <h3 className="font-head text-2xl md:text-3xl font-bold vx-text tracking-tight">
              Have a large trade to execute?
            </h3>
            <p className="mt-4 vx-muted leading-relaxed">
              Speak with our OTC desk to discuss your requirements, available assets and
              settlement process.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 shrink-0">
            <button
              data-testid="services-cta-quote"
              onClick={() => go("contact")}
              className="bg-[#F0B90B] text-black font-bold uppercase tracking-wide text-sm px-8 py-4 hover:bg-[#FCD535] transition-colors"
            >
              Request OTC Quote
            </button>
            <button
              data-testid="services-cta-contact"
              onClick={() => go("contact")}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] vx-muted hover:text-[#F0B90B] transition-colors"
            >
              Contact the Desk
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);
