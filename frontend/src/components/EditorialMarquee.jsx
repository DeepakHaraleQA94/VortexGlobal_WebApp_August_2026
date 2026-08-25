export const EditorialMarquee = () => (
  <section data-testid="editorial-marquee" className="py-16 md:py-24 border-y vx-border overflow-hidden relative z-10 vx-bg">
    <div className="vx-marquee-track">
      {[0, 1].map((k) => (
        <span key={k} className="flex items-center">
          {["VORTEX GLOBAL", "CLIENT TRUST IS OUR COMMITMENT", "OTC EXECUTION DESK", "USDT SETTLEMENT", "PUNE · MUMBAI · BANGALORE"].map(
            (t, i) => (
              <span key={i} className="flex items-center">
                <span className="vx-glow font-head font-black text-[#F0B90B] text-5xl md:text-8xl px-8 uppercase tracking-tight">{t}</span>
                <span className="text-[#FCD535] text-3xl md:text-5xl px-2">✦</span>
              </span>
            )
          )}
        </span>
      ))}
    </div>
  </section>
);
