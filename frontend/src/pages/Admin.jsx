import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../lib/api";
import { VortexLogo } from "../components/VortexLogo";
import { LogOut, RefreshCw, Loader2, Inbox } from "lucide-react";

export default function Admin() {
  const [authed, setAuthed] = useState(!!localStorage.getItem("vortex_token"));
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/leads");
      setLeads(data);
    } catch (e) {
      if (e.response?.status === 401) {
        localStorage.removeItem("vortex_token");
        setAuthed(false);
        toast.error("Session expired. Please log in again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authed) loadLeads();
  }, [authed]);

  const login = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    try {
      const { data } = await api.post("/auth/login", creds);
      localStorage.setItem("vortex_token", data.token);
      setAuthed(true);
      toast.success("Welcome back.");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Login failed");
    } finally {
      setLoggingIn(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("vortex_token");
    setAuthed(false);
    setLeads([]);
  };

  const inputCls =
    "bg-transparent border-b border-white/20 text-white py-3 focus:outline-none focus:border-[#F0B90B] transition-colors w-full placeholder:text-white/30";

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 bg-[#060606]">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-3 mb-10">
            <VortexLogo size={34} />
            <span className="font-head font-extrabold text-lg">VORTEX<span className="text-[#F0B90B]">.</span></span>
          </Link>
          <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#F0B90B] mb-3">/ Admin portal</p>
          <h1 className="font-head text-3xl font-bold mb-10">Sign in to view leads</h1>
          <form data-testid="admin-login-form" onSubmit={login} className="space-y-8">
            <input data-testid="admin-email" type="email" className={inputCls} placeholder="Email" value={creds.email} onChange={(e) => setCreds({ ...creds, email: e.target.value })} />
            <input data-testid="admin-password" type="password" className={inputCls} placeholder="Password" value={creds.password} onChange={(e) => setCreds({ ...creds, password: e.target.value })} />
            <button data-testid="admin-login-submit" disabled={loggingIn} className="bg-[#F0B90B] text-black font-bold uppercase tracking-wide px-8 py-4 hover:bg-[#FCD535] transition-colors w-full flex items-center justify-center gap-2 disabled:opacity-60">
              {loggingIn && <Loader2 size={16} className="animate-spin" />} Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="admin-dashboard" className="min-h-screen bg-[#060606]">
      <header className="border-b border-white/10 sticky top-0 bg-[#060606]/90 backdrop-blur-xl z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <VortexLogo size={30} />
            <span className="font-head font-extrabold">VORTEX<span className="text-[#F0B90B]">.</span> <span className="text-white/40 font-mono text-xs font-normal ml-1">ADMIN</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <button data-testid="admin-refresh" onClick={loadLeads} className="border border-white/20 p-3 hover:border-[#F0B90B] transition-colors"><RefreshCw size={16} /></button>
            <button data-testid="admin-logout" onClick={logout} className="border border-white/20 px-4 py-3 hover:border-[#F0B90B] transition-colors flex items-center gap-2 font-mono text-xs uppercase"><LogOut size={14} /> Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="flex items-baseline justify-between mb-8">
          <h1 className="font-head text-3xl md:text-4xl font-bold">OTC Lead Requests</h1>
          <span data-testid="lead-count" className="font-mono text-[#F0B90B]">{leads.length} total</span>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-white/50 font-mono text-sm py-20 justify-center"><Loader2 className="animate-spin" size={18} /> Loading…</div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center gap-3 text-white/40 py-24 border border-white/10">
            <Inbox size={40} strokeWidth={1} />
            <span className="font-mono text-sm">No leads yet.</span>
          </div>
        ) : (
          <div className="border border-white/10 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 font-mono text-xs uppercase tracking-wider text-white/40 text-left">
                  <th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Phone</th><th className="p-4">Asset</th><th className="p-4">Volume</th><th className="p-4">Message</th><th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id} data-testid={`lead-row-${l.id}`} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-medium">{l.name}</td>
                    <td className="p-4 text-white/60">{l.email}</td>
                    <td className="p-4 text-white/60 font-mono">{l.phone || "—"}</td>
                    <td className="p-4"><span className="font-mono text-xs bg-[#F0B90B] text-black px-2 py-1">{l.asset}</span></td>
                    <td className="p-4 font-mono text-[#F0B90B]">{l.volume}</td>
                    <td className="p-4 text-white/50 max-w-[220px] truncate">{l.message || "—"}</td>
                    <td className="p-4 text-white/40 font-mono text-xs">{new Date(l.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
