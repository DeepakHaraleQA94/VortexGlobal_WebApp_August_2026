import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Linkedin, MapPin, Building2, Users, Globe, CalendarDays, Briefcase,
  Phone, Mail, ArrowUpRight, CheckCircle2, ExternalLink,
} from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { VortexLogo } from "../components/VortexLogo";
import { TelegramIcon, WhatsappIcon } from "../components/ContactIcons";
import { PHONES, WHATSAPP, TELEGRAM, EMAILS } from "../lib/contacts";

const LINKEDIN_URL = "https://www.linkedin.com/company/vortex-global-exchanges";

const FACTS = [
  { icon: Briefcase, label: "Industry", value: "Financial Services · Crypto OTC" },
  { icon: Users, label: "Company size", value: "11–50 employees" },
  { icon: Building2, label: "Headquarters", value: "Hinjewadi, Pune, India" },
  { icon: Globe, label: "Type", value: "Privately Held" },
  { icon: CalendarDays, label: "Specialties", value: "USDT Settlements · OTC Trading" },
];

const SPECIALTIES = [
  "Institutional OTC Trading", "USDT Settlement Services", "Digital Asset Trading",
  "Fixed-Price Execution", "Liquidity & Block Trades", "Dealer-to-Client Execution",
  "Coordinated Settlement", "BTC · ETH · SOL · USDC",
];

const OFFICES = [
  { city: "Pune (HQ)", addr: "Magarpatta City, Aditi Garden, Hadapsar, Pune 411013" },
  { city: "Mumbai", addr: "Bandra Kurla Complex, Mumbai 400051" },
  { city: "Bangalore", addr: "108, Ramanashree Chambers, 37 Lady Curzon Road, Bangalore 560001" },
];

const UPDATES = [
  { tag: "Commitment", text: "At Vortex Global Exchanges, client trust is not just our goal — it's our commitment. Building a trustworthy future in cryptocurrency, one client relationship at a time." },
  { tag: "Service", text: "Institutional OTC desk for large USDT settlements and major digital assets — negotiated pricing, direct dealer execution and coordinated settlement." },
  { tag: "Coverage", text: "Now serving institutional clients across Pune, Mumbai and Bangalore with dedicated trade support from inquiry through settlement." },
];

const Section = ({ title, children, testid }) => (
  <div data-testid={testid} className="vx-surface border vx-border p-6 md:p-8">
    <h2 className="font-head text-lg md:text-xl font-bold vx-text mb-5">{title}</h2>
    {children}
  </div>
);

export default function Company() {
  return (
    <div className="vx-grain relative vx-bg min-h-screen" data-testid="company-page">
      <Header />

      <main className="max-w-5xl mx-auto px-4 md:px-8 pt-24 md:pt-28 pb-20">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="vx-surface border vx-border overflow-hidden"
        >
          {/* Cover */}
          <div className="h-40 md:h-56 relative overflow-hidden" style={{ background: "linear-gradient(120deg, #0B0B0B 0%, #1a1400 55%, #F0B90B 160%)" }}>
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 80% 30%, rgba(240,185,11,0.5), transparent 45%)" }} />
          </div>

          <div className="px-5 md:px-8 pb-8">
            <div className="-mt-14 md:-mt-16">
              <div className="w-28 h-28 md:w-32 md:h-32 vx-surface border vx-border2 flex items-center justify-center">
                <VortexLogo size={92} />
              </div>
              <div className="mt-5">
                <h1 className="font-head text-2xl md:text-3xl font-black vx-text tracking-tight leading-tight">
                  Vortex Global Exchanges & Crypto Services
                </h1>
                <p className="vx-muted mt-1.5 text-sm md:text-base">
                  Institutional OTC Crypto Settlement Desk · USDT Settlements · Digital Assets
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 font-mono text-xs vx-faint">
                  <span className="flex items-center gap-1"><MapPin size={13} /> Hinjewadi, Pune, India</span>
                  <span className="flex items-center gap-1"><Briefcase size={13} /> Financial Services</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <a
                href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer"
                data-testid="company-follow"
                className="inline-flex items-center gap-2 bg-[#0A66C2] text-white font-bold text-sm px-6 py-2.5 rounded-full hover:bg-[#0959a8] transition-colors"
              >
                <Linkedin size={16} /> Follow
              </a>
              <a
                href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer"
                data-testid="company-linkedin"
                className="inline-flex items-center gap-2 border vx-border2 vx-text font-semibold text-sm px-6 py-2.5 rounded-full hover:border-[#F0B90B] transition-colors"
              >
                View on LinkedIn <ExternalLink size={15} />
              </a>
              <Link
                to="/#contact"
                data-testid="company-contact"
                className="inline-flex items-center gap-2 border vx-border2 vx-text font-semibold text-sm px-6 py-2.5 rounded-full hover:border-[#F0B90B] transition-colors"
              >
                Message
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Body grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <Section title="About" testid="company-about">
              <p className="vx-muted leading-relaxed text-sm md:text-base">
                Vortex Global Exchanges & Crypto Services is an institutional Over-the-Counter (OTC)
                crypto settlement desk headquartered in Hinjewadi, Pune. We specialise in high-volume
                USDT buying, selling and settlement, alongside execution across major digital assets
                including BTC, ETH, SOL and USDC.
              </p>
              <p className="vx-muted leading-relaxed text-sm md:text-base mt-4">
                OTC trading is the direct buying and selling of assets between two parties through a
                dealer network rather than a centralized exchange — offering negotiated pricing,
                privacy, deep liquidity and coordinated settlement for larger transactions. From
                initial inquiry through execution and settlement, our desk provides dedicated support
                at every step.
              </p>
              <p className="mt-5 font-mono text-xs uppercase tracking-[0.15em] text-[#F0B90B]">
                ✦ Client Trust Is Our Commitment
              </p>
            </Section>

            <Section title="Recent updates" testid="company-updates">
              <div className="space-y-4">
                {UPDATES.map((u, i) => (
                  <div key={i} className="border vx-border p-5 hover:border-[#F0B90B]/50 transition-colors">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#F0B90B]">{u.tag}</span>
                    <p className="vx-muted text-sm mt-2 leading-relaxed">{u.text}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Specialties" testid="company-specialties">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SPECIALTIES.map((s) => (
                  <div key={s} className="flex items-center gap-2.5 vx-muted text-sm">
                    <CheckCircle2 size={16} className="text-[#F0B90B] shrink-0" /> {s}
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Locations" testid="company-locations">
              <div className="space-y-4">
                {OFFICES.map((o) => (
                  <div key={o.city} className="flex items-start gap-3">
                    <MapPin size={18} className="text-[#F0B90B] mt-0.5 shrink-0" />
                    <div>
                      <div className="vx-text font-semibold text-sm">{o.city}</div>
                      <div className="vx-muted text-sm">{o.addr}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Section title="Overview" testid="company-overview">
              <div className="space-y-4">
                {FACTS.map((f) => (
                  <div key={f.label} className="flex items-start gap-3">
                    <f.icon size={17} className="text-[#F0B90B] mt-0.5 shrink-0" />
                    <div>
                      <div className="font-mono text-[10px] uppercase tracking-widest vx-faint">{f.label}</div>
                      <div className="vx-text text-sm mt-0.5">{f.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Contact" testid="company-contact-card">
              <div className="space-y-4 font-mono text-sm vx-muted">
                <div>
                  <div className="text-[10px] uppercase tracking-widest vx-faint mb-2">Call</div>
                  {PHONES.map((p) => (
                    <a key={p.href} href={p.href} className="flex items-center gap-2 hover:text-[#F0B90B] transition-colors py-0.5"><Phone size={13} /> {p.label}</a>
                  ))}
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest vx-faint mb-2">WhatsApp</div>
                  {WHATSAPP.map((w) => (
                    <a key={w.href} href={w.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#F0B90B] transition-colors py-0.5"><WhatsappIcon size={13} /> {w.label}</a>
                  ))}
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest vx-faint mb-2">Telegram</div>
                  {TELEGRAM.map((t) => (
                    <a key={t.href} href={t.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#F0B90B] transition-colors py-0.5"><TelegramIcon size={13} /> {t.label}</a>
                  ))}
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest vx-faint mb-2">Email</div>
                  {EMAILS.map((em) => (
                    <a key={em} href={`mailto:${em}`} className="flex items-center gap-2 hover:text-[#F0B90B] transition-colors py-0.5 break-all"><Mail size={13} className="shrink-0" /> {em}</a>
                  ))}
                </div>
              </div>
            </Section>

            <Link
              to="/"
              data-testid="company-back-home"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] vx-muted hover:text-[#F0B90B] transition-colors"
            >
              Back to website <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
