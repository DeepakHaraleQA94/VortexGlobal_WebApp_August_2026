import { Reveal } from "./Reveal";

const CHAPTERS = [
  {
    n: "01",
    title: "Direct Dealer Execution",
    body: "OTC trading is the direct buying and selling of financial assets between two parties through a dealer network, rather than on a centralized exchange. You trade with us — not an order book.",
  },
  {
    n: "02",
    title: "Zero Slippage",
    body: "Large orders are quoted and filled at a single agreed price. No fragmentation across the book, no market impact, no chasing liquidity across venues.",
  },
  {
    n: "03",
    title: "Immediate Settlement",
    body: "Trades clear directly between the two parties. Funds and tokens are settled immediately — the way institutional counterparties expect to operate.",
  },
  {
    n: "04",
    title: "Deep Liquidity",
    body: "Handling ₹20–50 lakhs in daily USDT volume for eight major clients means the depth to absorb size without moving the market against you.",
  },
];

export const Manifesto = () => (
  <section id="manifesto" data-testid="manifesto-section" className="py-24 md:py-40 border-t border-white/10 relative z-10 bg-[#060606]">
    <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-12">
      <div className="md:col-span-4">
        <div className="md:sticky md:top-28">
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#F0B90B] mb-6">/ The manifesto</p>
          <h2 className="font-head text-3xl md:text-5xl font-bold tracking-tight leading-[1.05]">
            Why an OTC desk beats the exchange.
          </h2>
          <p className="mt-6 text-white/50 leading-relaxed">
            Centralized exchanges are built for retail. Institutions move differently. Here is
            how Vortex settles serious size.
          </p>
        </div>
      </div>

      <div className="md:col-span-8 md:col-start-5">
        <div className="space-y-16 md:space-y-24">
          {CHAPTERS.map((c) => (
            <Reveal key={c.n}>
              <div data-testid={`chapter-${c.n}`} className="border-t border-white/10 pt-8">
                <div className="flex items-start gap-6 md:gap-10">
                  <span className="font-mono text-[#F0B90B]/40 text-4xl md:text-6xl font-bold leading-none shrink-0">
                    {c.n}
                  </span>
                  <div>
                    <h3 className="font-head text-2xl md:text-3xl font-semibold mb-4">{c.title}</h3>
                    <p className="text-white/55 text-base md:text-lg leading-relaxed max-w-xl">
                      {c.body}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);
