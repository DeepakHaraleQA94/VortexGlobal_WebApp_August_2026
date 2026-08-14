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
    "bg-transparent border-b border-white/20 text-white py-3 focus:outline-none focus:border-[#F0B90B] transition-colors w-full placeholder:text-white/30";

  return (
    <section id="contact" data-testid="contact-section" className="py-24 md:py-32 border-t border-white/10 relative z-10 bg-[#060606]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-16">
        <Reveal>
          <div>
            <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#F0B90B] mb-4">/ Get started</p>
            <h2 className="font-head text-4xl md:text-6xl font-black uppercase tracking-tighter leading-[0.95]">
              Execute large trades <span className="text-[#F0B90B]">confidently.</span>
            </h2>
            <p className="mt-6 text-white/55 leading-relaxed max-w-md">
              Tell us what you want to trade and the volume you're working with. Our desk will
              respond with a quote and settlement terms.
            </p>
            <div className="mt-10 space-y-2 font-mono text-sm text-white/60">
              <div>+91 82620 30386</div>
              <div>+91 72194 50687</div>
              <div>022 45670 0</div>
            </div>
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
              <label className="font-mono text-xs uppercase tracking-widest text-white/40 mb-3 block">Asset</label>
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
                        : "border-white/20 text-white/60 hover:border-white"
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
