import { VortexLogo } from "./VortexLogo";
import { Phone, Mail } from "lucide-react";
import { TelegramIcon, WhatsappIcon } from "./ContactIcons";
import { PHONES, WHATSAPP, TELEGRAM, EMAILS } from "../lib/contacts";

const linkCls = "flex items-center gap-2 hover:text-[#F0B90B] transition-colors break-all";

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
              <VortexLogo size={44} />
              <span className="font-head font-extrabold text-lg leading-tight">
                VORTEX GLOBAL
                <span className="block font-mono text-[9px] uppercase tracking-[0.2em] opacity-70 font-normal mt-1">Exchanges & Crypto Services</span>
              </span>
            </div>
            <p className="vx-muted text-sm max-w-xs leading-relaxed">
              Vortex Global Exchanges & Crypto Services — institutional OTC settlement desk.
              Hinjewadi, Pune.
            </p>
            <p className="mt-6 text-sm vx-text leading-relaxed font-medium">
              At Vortex Global Exchanges, client trust is not just our goal — it's our commitment.
            </p>
            <p className="mt-2 vx-muted text-xs leading-relaxed">
              Building a trustworthy future in cryptocurrency — one client relationship at a time.
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest vx-faint mb-3">Call</p>
              <div className="space-y-2 font-mono text-sm vx-muted">
                {PHONES.map((p) => (
                  <a key={p.href} href={p.href} data-testid={`footer-phone-${p.href}`} className={linkCls}><Phone size={14} className="shrink-0" /> {p.label}</a>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest vx-faint mb-3">WhatsApp</p>
              <div className="space-y-2 font-mono text-sm vx-muted">
                {WHATSAPP.map((w) => (
                  <a key={w.href} href={w.href} target="_blank" rel="noopener noreferrer" data-testid={`footer-whatsapp-${w.href}`} className={linkCls}><WhatsappIcon size={14} /> {w.label}</a>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest vx-faint mb-3">Telegram</p>
              <div className="space-y-2 font-mono text-sm vx-muted">
                {TELEGRAM.map((t) => (
                  <a key={t.href} href={t.href} target="_blank" rel="noopener noreferrer" data-testid={`footer-telegram-${t.label}`} className={linkCls}><TelegramIcon size={14} /> {t.label}</a>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest vx-faint mb-3">Email</p>
              <div className="space-y-2 font-mono text-sm vx-muted">
                {EMAILS.map((em) => (
                  <a key={em} href={`mailto:${em}`} data-testid={`footer-email-${em}`} className={linkCls}><Mail size={14} className="shrink-0" /> {em}</a>
                ))}
              </div>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-widest vx-faint mb-3">Offices</p>
              <div className="space-y-2 text-sm vx-muted">
                <div>Magarpatta City, Hadapsar, Pune 411013</div>
                <div>Bandra Kurla Complex, Mumbai 400051</div>
                <div>Lady Curzon Road, Bangalore 560001</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col md:flex-row justify-between items-center gap-4 vx-faint font-mono text-xs">
          <span>© {new Date().getFullYear()} Vortex Global Exchanges & Crypto Services. All rights reserved.</span>
          <span>OTC · USDT · Settlements</span>
        </div>
      </div>
    </footer>
  );
};
