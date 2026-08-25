import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Linkedin, MapPin, Building2, Users, Globe, CalendarDays, Briefcase,
  Phone, Mail, ArrowUpRight, CheckCircle2, ExternalLink, Pencil, X, Loader2,
} from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { VortexLogo } from "../components/VortexLogo";
import { TelegramIcon, WhatsappIcon } from "../components/ContactIcons";
import { PHONES, WHATSAPP, TELEGRAM, EMAILS } from "../lib/contacts";
import { api } from "../lib/api";

const FALLBACK = {
  name: "Vortex Global Exchanges & Crypto Services",
  headline: "Institutional OTC Crypto Settlement Desk · USDT Settlements · Digital Assets",
  location: "Hinjewadi, Pune, India",
  industry: "Financial Services · Crypto OTC",
  companySize: "11–50 employees",
  headquarters: "Hinjewadi, Pune, India",
  type: "Privately Held",
  specialtiesLine: "USDT Settlements · OTC Trading",
  linkedinUrl: "https://www.linkedin.com/company/vortex-global-exchanges",
  commitment: "Client Trust Is Our Commitment",
  about: [],
  specialties: [],
  updates: [],
  offices: [],
};

const Section = ({ title, children, testid }) => (
  <div data-testid={testid} className="vx-surface border vx-border p-6 md:p-8">
    <h2 className="font-head text-lg md:text-xl font-bold vx-text mb-5">{title}</h2>
    {children}
  </div>
);

export default function Company() {
  const [p, setP] = useState(FALLBACK);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    api.get("/company").then(({ data }) => setP({ ...FALLBACK, ...data })).catch(() => {});
  }, []);

  const facts = [
    { icon: Briefcase, label: "Industry", value: p.industry },
    { icon: Users, label: "Company size", value: p.companySize },
    { icon: Building2, label: "Headquarters", value: p.headquarters },
    { icon: Globe, label: "Type", value: p.type },
    { icon: CalendarDays, label: "Specialties", value: p.specialtiesLine },
  ];

  return (
    <div className="vx-grain relative vx-bg min-h-screen" data-testid="company-page">
      <Header />

      <main className="max-w-5xl mx-auto px-4 md:px-8 pt-24 md:pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="vx-surface border vx-border overflow-hidden"
        >
          <div className="h-40 md:h-56 relative overflow-hidden" style={{ background: "linear-gradient(120deg, #0B0B0B 0%, #1a1400 55%, #F0B90B 160%)" }}>
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 80% 30%, rgba(240,185,11,0.5), transparent 45%)" }} />
            <button
              data-testid="company-edit-btn"
              onClick={() => setEditing(true)}
              className="absolute top-4 right-4 inline-flex items-center gap-2 bg-black/40 backdrop-blur text-white border border-white/25 text-xs font-mono uppercase tracking-widest px-4 py-2 rounded-full hover:border-[#F0B90B] hover:text-[#F0B90B] transition-colors"
            >
              <Pencil size={13} /> Edit
            </button>
          </div>

          <div className="px-5 md:px-8 pb-8">
            <div className="-mt-14 md:-mt-16">
              <div className="w-28 h-28 md:w-32 md:h-32 vx-surface border vx-border2 flex items-center justify-center">
                <VortexLogo size={92} />
              </div>
              <div className="mt-5">
                <h1 data-testid="company-name" className="font-head text-2xl md:text-3xl font-black vx-text tracking-tight leading-tight">{p.name}</h1>
                <p className="vx-muted mt-1.5 text-sm md:text-base">{p.headline}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 font-mono text-xs vx-faint">
                  <span className="flex items-center gap-1"><MapPin size={13} /> {p.location}</span>
                  <span className="flex items-center gap-1"><Briefcase size={13} /> {p.industry}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-6">
              <a href={p.linkedinUrl} target="_blank" rel="noopener noreferrer" data-testid="company-follow" className="inline-flex items-center gap-2 bg-[#0A66C2] text-white font-bold text-sm px-6 py-2.5 rounded-full hover:bg-[#0959a8] transition-colors">
                <Linkedin size={16} /> Follow
              </a>
              <a href={p.linkedinUrl} target="_blank" rel="noopener noreferrer" data-testid="company-linkedin" className="inline-flex items-center gap-2 border vx-border2 vx-text font-semibold text-sm px-6 py-2.5 rounded-full hover:border-[#F0B90B] transition-colors">
                View on LinkedIn <ExternalLink size={15} />
              </a>
              <Link to="/#contact" data-testid="company-contact" className="inline-flex items-center gap-2 border vx-border2 vx-text font-semibold text-sm px-6 py-2.5 rounded-full hover:border-[#F0B90B] transition-colors">Message</Link>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <Section title="About" testid="company-about">
              {p.about.map((para, i) => (
                <p key={i} className={`vx-muted leading-relaxed text-sm md:text-base ${i ? "mt-4" : ""}`}>{para}</p>
              ))}
              {p.commitment && <p className="mt-5 font-mono text-xs uppercase tracking-[0.15em] text-[#F0B90B]">✦ {p.commitment}</p>}
            </Section>

            <Section title="Recent updates" testid="company-updates">
              <div className="space-y-4">
                {p.updates.map((u, i) => (
                  <div key={i} className="border vx-border p-5 hover:border-[#F0B90B]/50 transition-colors">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[#F0B90B]">{u.tag}</span>
                    <p className="vx-muted text-sm mt-2 leading-relaxed">{u.text}</p>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Specialties" testid="company-specialties">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {p.specialties.map((s) => (
                  <div key={s} className="flex items-center gap-2.5 vx-muted text-sm"><CheckCircle2 size={16} className="text-[#F0B90B] shrink-0" /> {s}</div>
                ))}
              </div>
            </Section>

            <Section title="Locations" testid="company-locations">
              <div className="space-y-4">
                {p.offices.map((o) => (
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

          <div className="space-y-6">
            <Section title="Overview" testid="company-overview">
              <div className="space-y-4">
                {facts.map((f) => (
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
                  {PHONES.map((c) => <a key={c.href} href={c.href} className="flex items-center gap-2 hover:text-[#F0B90B] transition-colors py-0.5"><Phone size={13} /> {c.label}</a>)}
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest vx-faint mb-2">WhatsApp</div>
                  {WHATSAPP.map((c) => <a key={c.href} href={c.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#F0B90B] transition-colors py-0.5"><WhatsappIcon size={13} /> {c.label}</a>)}
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest vx-faint mb-2">Telegram</div>
                  {TELEGRAM.map((c) => <a key={c.href} href={c.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-[#F0B90B] transition-colors py-0.5"><TelegramIcon size={13} /> {c.label}</a>)}
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest vx-faint mb-2">Email</div>
                  {EMAILS.map((em) => <a key={em} href={`mailto:${em}`} className="flex items-center gap-2 hover:text-[#F0B90B] transition-colors py-0.5 break-all"><Mail size={13} className="shrink-0" /> {em}</a>)}
                </div>
              </div>
            </Section>

            <Link to="/" data-testid="company-back-home" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] vx-muted hover:text-[#F0B90B] transition-colors">Back to website <ArrowUpRight size={14} /></Link>
          </div>
        </div>
      </main>

      <Footer />

      <AnimatePresence>
        {editing && <ProfileEditor profile={p} onClose={() => setEditing(false)} onSaved={(d) => { setP({ ...FALLBACK, ...d }); setEditing(false); }} />}
      </AnimatePresence>
    </div>
  );
}

const toLines = (arr, fn) => (arr || []).map(fn).join("\n");
const linesToUpdates = (t) => t.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
  const [tag, ...rest] = l.split("|");
  return { tag: (tag || "Update").trim(), text: rest.join("|").trim() };
});
const linesToOffices = (t) => t.split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
  const [city, ...rest] = l.split("|");
  return { city: (city || "").trim(), addr: rest.join("|").trim() };
});

function ProfileEditor({ profile, onClose, onSaved }) {
  const authed = !!localStorage.getItem("vortex_token");
  const [step, setStep] = useState(authed ? "edit" : "login");
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [f, setF] = useState({
    name: profile.name, headline: profile.headline, location: profile.location,
    industry: profile.industry, companySize: profile.companySize, headquarters: profile.headquarters,
    type: profile.type, specialtiesLine: profile.specialtiesLine, linkedinUrl: profile.linkedinUrl,
    commitment: profile.commitment,
    about: (profile.about || []).join("\n\n"),
    specialties: (profile.specialties || []).join("\n"),
    updates: toLines(profile.updates, (u) => `${u.tag} | ${u.text}`),
    offices: toLines(profile.offices, (o) => `${o.city} | ${o.addr}`),
  });

  const upd = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const input = "vx-input bg-transparent border vx-border2 px-3 py-2.5 w-full text-sm focus:outline-none focus:border-[#F0B90B] transition-colors";

  const login = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api.post("/auth/login", creds);
      localStorage.setItem("vortex_token", data.token);
      setStep("edit");
      toast.success("Logged in as admin.");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Login failed");
    } finally { setBusy(false); }
  };

  const save = async () => {
    setBusy(true);
    const payload = {
      name: f.name, headline: f.headline, location: f.location, industry: f.industry,
      companySize: f.companySize, headquarters: f.headquarters, type: f.type,
      specialtiesLine: f.specialtiesLine, linkedinUrl: f.linkedinUrl, commitment: f.commitment,
      about: f.about.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean),
      specialties: f.specialties.split("\n").map((s) => s.trim()).filter(Boolean),
      updates: linesToUpdates(f.updates),
      offices: linesToOffices(f.offices),
    };
    try {
      const { data } = await api.put("/company", payload);
      toast.success("Profile updated.");
      onSaved(data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("vortex_token");
        setStep("login");
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error("Save failed.");
      }
    } finally { setBusy(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-start md:items-center justify-center p-4 overflow-y-auto">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="vx-surface border vx-border2 w-full max-w-2xl my-8" data-testid="company-editor">
        <div className="flex items-center justify-between p-5 border-b vx-border">
          <h3 className="font-head font-bold vx-text">{step === "login" ? "Admin Login" : "Edit Company Profile"}</h3>
          <button onClick={onClose} data-testid="editor-close" className="vx-muted hover:text-[#F0B90B]"><X size={20} /></button>
        </div>

        {step === "login" ? (
          <form onSubmit={login} className="p-6 space-y-5" data-testid="company-login-form">
            <p className="vx-muted text-sm">Sign in with your admin credentials to edit this profile.</p>
            <input data-testid="company-login-email" type="email" autoComplete="username" className={input} placeholder="Email" value={creds.email} onChange={(e) => setCreds({ ...creds, email: e.target.value })} />
            <input data-testid="company-login-password" type="password" autoComplete="current-password" className={input} placeholder="Password" value={creds.password} onChange={(e) => setCreds({ ...creds, password: e.target.value })} />
            <button data-testid="company-login-submit" disabled={busy} className="bg-[#F0B90B] text-black font-bold uppercase tracking-wide text-sm px-6 py-3 w-full flex items-center justify-center gap-2 hover:bg-[#FCD535] transition-colors disabled:opacity-60">
              {busy && <Loader2 size={15} className="animate-spin" />} Sign In
            </button>
          </form>
        ) : (
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {[["name","Company name"],["headline","Headline"],["location","Location"],["industry","Industry"],["companySize","Company size"],["headquarters","Headquarters"],["type","Type"],["specialtiesLine","Specialties (overview line)"],["linkedinUrl","LinkedIn URL"],["commitment","Commitment tagline"]].map(([k,label]) => (
              <div key={k}>
                <label className="font-mono text-[10px] uppercase tracking-widest vx-faint block mb-1.5">{label}</label>
                <input className={input} value={f[k]} onChange={upd(k)} data-testid={`editor-${k}`} />
              </div>
            ))}
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest vx-faint block mb-1.5">About (separate paragraphs with a blank line)</label>
              <textarea rows={5} className={input + " resize-none"} value={f.about} onChange={upd("about")} data-testid="editor-about" />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest vx-faint block mb-1.5">Specialties (one per line)</label>
              <textarea rows={4} className={input + " resize-none"} value={f.specialties} onChange={upd("specialties")} data-testid="editor-specialties" />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest vx-faint block mb-1.5">Recent updates (format: Tag | text — one per line)</label>
              <textarea rows={4} className={input + " resize-none"} value={f.updates} onChange={upd("updates")} data-testid="editor-updates" />
            </div>
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest vx-faint block mb-1.5">Locations (format: City | address — one per line)</label>
              <textarea rows={3} className={input + " resize-none"} value={f.offices} onChange={upd("offices")} data-testid="editor-offices" />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button onClick={save} disabled={busy} data-testid="editor-save" className="bg-[#F0B90B] text-black font-bold uppercase tracking-wide text-sm px-6 py-3 flex items-center gap-2 hover:bg-[#FCD535] transition-colors disabled:opacity-60">
                {busy && <Loader2 size={15} className="animate-spin" />} Save Changes
              </button>
              <button onClick={onClose} className="vx-muted hover:text-[#F0B90B] font-mono text-xs uppercase tracking-widest">Cancel</button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
