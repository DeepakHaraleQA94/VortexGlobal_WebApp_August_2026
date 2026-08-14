import { VortexLogo } from "./VortexLogo";
import { Phone, Mail } from "lucide-react";

export const Footer = () => {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <footer data-testid="site-footer" className="relative z-10 bg-[#060606] border-t border-white/10 pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <button
          onClick={() => go("contact")}
          data-testid="footer-talk-cta"
          className="font-head font-black uppercase tracking-tighter text-[16vw] md:text-[12vw] leading-[0.85] text-white hover:text-[#F0B90B] transition-colors block text-left"
        >
          Let's Talk
        </button>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/10 pt-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <VortexLogo size={30} />
              <span className="font-head font-extrabold text-lg">VORTEX<span className="text-[#F0B90B]">.</span></span>
            </div>
            <p className="text-white/45 text-sm max-w-xs leading-relaxed">
              Vortex Crypto Services — institutional OTC settlement desk. Hinjewadi, Pune.
            </p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-white/40 mb-4">Contact</p>
            <div className="space-y-2 font-mono text-sm text-white/70">
              <a href="tel:+918262030386" className="flex items-center gap-2 hover:text-[#F0B90B] transition-colors"><Phone size={14} /> +91 82620 30386</a>
              <a href="tel:+917219450687" className="flex items-center gap-2 hover:text-[#F0B90B] transition-colors"><Phone size={14} /> +91 72194 50687</a>
              <a href="tel:0224567000" className="flex items-center gap-2 hover:text-[#F0B90B] transition-colors"><Phone size={14} /> 022 45670 0</a>
            </div>
            <div className="mt-5 space-y-2 font-mono text-sm text-white/70">
              {["finance@vortexglobal.info", "adirajpatel@vortexglobal.info", "saurabhi.kumari@vortexglobal.info", "traders@vortexglobal.info"].map((em) => (
                <a key={em} href={`mailto:${em}`} data-testid={`footer-email-${em}`} className="flex items-center gap-2 hover:text-[#F0B90B] transition-colors break-all"><Mail size={14} className="shrink-0" /> {em}</a>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-white/40 mb-4">Offices</p>
            <div className="space-y-2 text-sm text-white/60">
              <div>Magarpatta City, Hadapsar, Pune 411013</div>
              <div>Bandra Kurla Complex, Mumbai 400051</div>
              <div>Lady Curzon Road, Bangalore 560001</div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col md:flex-row justify-between items-center gap-4 text-white/30 font-mono text-xs">
          <span>© {new Date().getFullYear()} Vortex Crypto Services. All rights reserved.</span>
          <span>OTC · USDT · Settlements</span>
        </div>
      </div>
    </footer>
  );
};
