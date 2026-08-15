import { useState } from "react";
import { toast } from "sonner";
import { Reveal } from "./Reveal";
import { api } from "../lib/api";
import { Loader2 } from "lucide-react";

const ASSETS = ["USDT", "BTC", "ETH", "SOL", "USDC", "Other"];
const empty = { name: "", email: "", phone: "", asset: "USDT", volume: "", message: "" };

export const LeadForm = () => {
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(false);

  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.volume) {
      toast.error("Please fill in your name, email and expected volume.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/leads", form);
      toast.success("Request received. Our OTC desk will contact you shortly.");
      setForm(empty);
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "vx-input bg-transparent border-b vx-border2 py-3 focus:outline-none focus:border-[#F0B90B] transition-colors w-full";

  return (
    <section id="contact" data-testid="contact-section" className="py-24 md:py-32 border-t vx-border relative z-10 vx-bg">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-16">
        <Reveal>
          <div>
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#F0B90B] mb-4">/ Get started</p>
            <h2 className="font-head text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95] vx-text">
              Execute large trades <span className="text-[#F0B90B]">confidently.</span>
            </h2>
            <p className="mt-6 vx-muted leading-relaxed max-w-md">
              Tell us what you want to trade and the volume you're working with. Our desk will
              respond with a quote and settlement terms.
            </p>
            <div className="mt-10 space-y-2 font-mono text-sm vx-muted">
              <div>+91 82620 30386</div>
              <div>+91 72194 50687</div>
              <div>022 45670 0</div>
            </div>
            <div className="mt-5 space-y-2 font-mono text-sm vx-muted">
              {["finance@vortexglobal.info", "adirajpatel@vortexglobal.info", "saurabhi.kumari@vortexglobal.info", "traders@vortexglobal.info"].map((em) => (
                <a key={em} href={`mailto:${em}`} data-testid={`contact-email-${em}`} className="block hover:text-[#F0B90B] transition-colors break-all">{em}</a>
              ))}
            </div>
            <a
              href="https://t.me/VortexGlobalServices"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="contact-telegram"
              className="mt-5 inline-flex items-center gap-2 font-mono text-sm vx-muted hover:text-[#F0B90B] transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              @VortexGlobalServices
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <form data-testid="lead-form" onSubmit={submit} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <input data-testid="lead-name" className={inputCls} placeholder="Full name" value={form.name} onChange={upd("name")} />
              <input data-testid="lead-email" type="email" className={inputCls} placeholder="Email" value={form.email} onChange={upd("email")} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <input data-testid="lead-phone" className={inputCls} placeholder="Phone (optional)" value={form.phone} onChange={upd("phone")} />
              <input data-testid="lead-volume" className={inputCls} placeholder="Expected volume (e.g. ₹25L)" value={form.volume} onChange={upd("volume")} />
            </div>
            <div>
              <label className="font-mono text-xs uppercase tracking-widest vx-faint mb-3 block">Asset</label>
              <div className="flex flex-wrap gap-2">
                {ASSETS.map((a) => (
                  <button
                    type="button"
                    key={a}
                    data-testid={`asset-${a}`}
                    onClick={() => setForm({ ...form, asset: a })}
                    className={`font-mono text-xs px-4 py-2 border transition-colors ${
                      form.asset === a
                        ? "bg-[#F0B90B] text-black border-[#F0B90B]"
                        : "vx-border2 vx-muted hover:border-[#F0B90B]"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <textarea data-testid="lead-message" rows={3} className={inputCls + " resize-none"} placeholder="Message (optional)" value={form.message} onChange={upd("message")} />
            <button
              data-testid="lead-submit"
              type="submit"
              disabled={loading}
              className="bg-[#F0B90B] text-black font-bold uppercase tracking-wide px-8 py-4 hover:bg-[#FCD535] transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              Request a Quote
            </button>
          </form>
        </Reveal>
      </div>
    </section>
  );
};
