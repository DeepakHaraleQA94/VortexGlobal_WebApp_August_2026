import { VortexLogo } from "./VortexLogo";
import { Phone, Mail } from "lucide-react";

const TelegramIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

export const Footer = () => {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <footer data-testid="site-footer" className="relative z-10 vx-bg border-t vx-border pt-24 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <button
          onClick={() => go("contact")}
          data-testid="footer-talk-cta"
          className="font-head font-black uppercase tracking-tighter text-[16vw] md:text-[12vw] leading-[0.85] vx-text hover:text-[#F0B90B] transition-colors block text-left"
        >
          Let's Talk
        </button>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 border-t vx-border pt-12">
          <div>
            <div className="flex items-center gap-3 mb-4 vx-text">
              <VortexLogo size={30} />
              <span className="font-head font-extrabold text-lg">VORTEXGLOBAL<span className="text-[#F0B90B]">.</span></span>
            </div>
            <p className="vx-muted text-sm max-w-xs leading-relaxed">
              Vortex Global — institutional OTC settlement desk. Hinjewadi, Pune.
            </p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest vx-faint mb-4">Contact</p>
            <div className="space-y-2 font-mono text-sm vx-muted">
              <a href="tel:+918262030386" className="flex items-center gap-2 hover:text-[#F0B90B] transition-colors"><Phone size={14} /> +91 82620 30386</a>
              <a href="tel:+917219450687" className="flex items-center gap-2 hover:text-[#F0B90B] transition-colors"><Phone size={14} /> +91 72194 50687</a>
              <a href="tel:0224567000" className="flex items-center gap-2 hover:text-[#F0B90B] transition-colors"><Phone size={14} /> 022 45670 0</a>
            </div>
            <div className="mt-5 space-y-2 font-mono text-sm vx-muted">
              {["finance@vortexglobal.info", "adirajpatel@vortexglobal.info", "saurabhi.kumari@vortexglobal.info", "traders@vortexglobal.info"].map((em) => (
                <a key={em} href={`mailto:${em}`} data-testid={`footer-email-${em}`} className="flex items-center gap-2 hover:text-[#F0B90B] transition-colors break-all"><Mail size={14} className="shrink-0" /> {em}</a>
              ))}
            </div>
            <a
              href="https://t.me/VortexGlobalServices"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="footer-telegram"
              className="mt-5 inline-flex items-center gap-2 font-mono text-sm vx-muted hover:text-[#F0B90B] transition-colors"
            >
              <TelegramIcon size={15} /> @VortexGlobalServices
            </a>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest vx-faint mb-4">Offices</p>
            <div className="space-y-2 text-sm vx-muted">
              <div>Magarpatta City, Hadapsar, Pune 411013</div>
              <div>Bandra Kurla Complex, Mumbai 400051</div>
              <div>Lady Curzon Road, Bangalore 560001</div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col md:flex-row justify-between items-center gap-4 vx-faint font-mono text-xs">
          <span>© {new Date().getFullYear()} Vortex Global. All rights reserved.</span>
          <span>OTC · USDT · Settlements</span>
        </div>
      </div>
    </footer>
  );
};
