import { Reveal } from "./Reveal";
import { ArrowRight } from "lucide-react";

const CHAPTERS = [
  {
    n: "01",
    title: "Direct Dealer Execution",
    body: "Trade directly with our OTC desk through a negotiated execution process, rather than relying on a public order book.",
  },
  {
    n: "02",
    title: "Agreed-Price Execution",
    body: "Receive a quoted price before execution, allowing both parties to agree on transaction terms before the trade is completed.",
  },
  {
    n: "03",
    title: "Efficient Settlement",
    body: "A coordinated settlement process between counterparties, designed to reduce unnecessary delays and provide clear transaction completion.",
  },
  {
    n: "04",
    title: "Liquidity for Larger Transactions",
    body: "Access available liquidity for larger OTC transactions, with execution structured around the asset, order size and prevailing market conditions.",
  },
  {
    n: "05",
    title: "Dedicated Trade Support",
    body: "From initial inquiry through execution and settlement, our desk provides coordinated support throughout the transaction process.",
  },
];

const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

export const Manifesto = () => (
  <section id="manifesto" data-testid="manifesto-section" className="py-24 md:py-40 border-t vx-border relative z-10 vx-bg">
    <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-12">
      <div className="md:col-span-4">
        <div className="md:sticky md:top-28">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#F0B90B] mb-6">/ The manifesto</p>
          <h2 className="font-head text-3xl md:text-5xl font-bold tracking-tight leading-[1.05] vx-text">
            Why Institutions Choose OTC Execution.
          </h2>
          <p className="mt-6 vx-muted leading-relaxed">
            OTC trading is designed for counterparties who value negotiated pricing, direct
            execution, privacy and efficient settlement for larger transactions.
          </p>
        </div>
      </div>

      <div className="md:col-span-8 md:col-start-5">
        <div className="space-y-14 md:space-y-20">
          {CHAPTERS.map((c) => (
            <Reveal key={c.n}>
              <div data-testid={`chapter-${c.n}`} className="group border-t vx-border pt-8">
                <div className="flex items-start gap-6 md:gap-10">
                  <span className="font-mono text-4xl md:text-6xl font-bold leading-none shrink-0 text-[#F0B90B]/40 group-hover:text-[#F0B90B]/80 transition-colors duration-200">
                    {c.n}
                  </span>
                  <div>
                    <h3 className="font-head text-2xl md:text-3xl font-semibold mb-4 vx-text group-hover:text-[#F0B90B] transition-colors duration-200">
                      {c.title}
                    </h3>
                    <p className="vx-muted text-base md:text-lg leading-relaxed max-w-xl">{c.body}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal>
          <div className="mt-16 border vx-border vx-surface p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-md">
              <h3 className="font-head text-2xl md:text-3xl font-bold tracking-tight vx-text">
                Ready to discuss a trade?
              </h3>
              <p className="mt-3 vx-muted leading-relaxed">
                Speak with our OTC desk to discuss your asset, transaction size and settlement
                requirements.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 shrink-0">
              <button
                data-testid="manifesto-cta-quote"
                onClick={() => go("contact")}
                className="bg-[#F0B90B] text-black font-bold uppercase tracking-wide text-sm px-8 py-4 hover:bg-[#FCD535] transition-colors inline-flex items-center gap-2"
              >
                Request OTC Quote
                <ArrowRight size={15} />
              </button>
              <button
                data-testid="manifesto-cta-contact"
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
    </div>
  </section>
);
