import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { api } from "../lib/api";
import {
  Wallet, ArrowUpFromLine, Send, ArrowDownToLine, X, Loader2, RefreshCw, TrendingUp,
} from "lucide-react";

const ACTIONS = {
  withdraw: { label: "Withdraw", icon: ArrowUpFromLine, verb: "Withdraw USDT", cta: "Confirm Withdrawal" },
  send: { label: "Send", icon: Send, verb: "Send USDT", cta: "Send Now" },
  receive: { label: "Receive", icon: ArrowDownToLine, verb: "Receive USDT", cta: "Add to Balance" },
};

const fmt = (n) => (n ?? 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const AssetsPanel = () => {
  const [data, setData] = useState(null);
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [a, t] = await Promise.all([api.get("/assets"), api.get("/assets/transactions")]);
      setData(a.data);
      setTxns(t.data);
    } catch (e) {
      toast.error("Could not load assets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading || !data) {
    return <div className="flex items-center gap-2 vx-muted font-mono text-sm py-20 justify-center"><Loader2 className="animate-spin" size={18} /> Loading assets…</div>;
  }

  return (
    <div data-testid="assets-panel">
      <div className="flex items-baseline justify-between mb-8">
        <h1 className="font-head text-3xl md:text-4xl font-bold vx-text">Total Assets Available</h1>
        <button data-testid="assets-refresh" onClick={load} className="border vx-border2 p-3 hover:border-[#F0B90B] transition-colors vx-text"><RefreshCw size={16} /></button>
      </div>

      {/* Balance card */}
      <div className="border vx-border vx-surface overflow-hidden">
        <div className="p-8 md:p-12 relative overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(240,185,11,0.14), transparent 55%)" }}>
          <div className="absolute -right-16 -top-20 w-72 h-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(240,185,11,0.18), transparent 70%)" }} />
          <div className="relative">
            <div className="flex items-center gap-2.5 font-mono text-xs md:text-sm uppercase tracking-[0.25em] font-semibold text-[#F0B90B] mb-5">
              <Wallet size={18} /> Available USDT Stock
            </div>
            <div className="flex items-end gap-3 flex-wrap">
              <span data-testid="assets-usdt-balance" className="font-head font-black text-5xl md:text-7xl vx-text tracking-tighter leading-none" style={{ textShadow: "0 2px 30px rgba(240,185,11,0.18)" }}>
                {fmt(data.usdt_balance)}
              </span>
              <span className="font-head font-black text-2xl md:text-3xl text-[#F0B90B] mb-1.5">USDT</span>
            </div>

            {/* INR volume */}
            <div className="mt-6 inline-flex items-center gap-3 border vx-border2 px-5 py-3">
              <TrendingUp size={18} className="text-[#0ECB81]" />
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] vx-faint">INR Volume</span>
              <span data-testid="assets-inr-value" className="font-head font-black text-xl md:text-2xl vx-text">
                ₹{fmt(data.inr_value)}
              </span>
            </div>

            {/* Binance-style actions */}
            <div className="mt-8 flex flex-wrap gap-3">
              {Object.entries(ACTIONS).map(([key, a]) => (
                <button
                  key={key}
                  data-testid={`assets-${key}-btn`}
                  onClick={() => setAction(key)}
                  className={`inline-flex items-center gap-2 font-bold text-sm px-7 py-3.5 transition-all hover:-translate-y-0.5 ${
                    key === "withdraw"
                      ? "bg-[#F0B90B] text-black hover:bg-[#FCD535] shadow-[0_8px_24px_rgba(240,185,11,0.3)]"
                      : "border vx-border2 vx-text hover:border-[#F0B90B]"
                  }`}
                >
                  <a.icon size={16} /> {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <h2 className="font-head text-lg font-bold vx-text mt-12 mb-4">Recent Transactions</h2>
      {txns.length === 0 ? (
        <div className="border vx-border py-12 text-center vx-faint font-mono text-sm">No transactions yet.</div>
      ) : (
        <div className="border vx-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b vx-border font-mono text-xs uppercase tracking-wider vx-faint text-left">
                <th className="p-4">Type</th><th className="p-4">Amount (USDT)</th><th className="p-4">Counterparty / Note</th><th className="p-4">Balance After</th><th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {txns.map((t) => (
                <tr key={t.id} data-testid={`txn-${t.id}`} className="border-b vx-border vx-row-hover transition-colors vx-text">
                  <td className="p-4">
                    <span className="font-mono text-xs uppercase px-2 py-1" style={{
                      background: t.type === "receive" ? "rgba(14,203,129,0.15)" : "rgba(246,70,93,0.15)",
                      color: t.type === "receive" ? "#0ECB81" : "#F6465D",
                    }}>{t.type}</span>
                  </td>
                  <td className="p-4 font-mono" style={{ color: t.type === "receive" ? "#0ECB81" : "#F6465D" }}>
                    {t.type === "receive" ? "+" : "−"}{fmt(t.amount)}
                  </td>
                  <td className="p-4 vx-muted">{t.counterparty || t.note || "—"}</td>
                  <td className="p-4 font-mono vx-text">{fmt(t.balance_after)}</td>
                  <td className="p-4 vx-faint font-mono text-xs">{new Date(t.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {action && (
          <TxnModal
            action={action}
            balance={data.usdt_balance}
            rate={data.inr_rate}
            onClose={() => setAction(null)}
            onDone={(res) => { setData({ usdt_balance: res.usdt_balance, inr_rate: res.inr_rate, inr_value: res.inr_value }); setAction(null); load(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

function TxnModal({ action, balance, rate, onClose, onDone }) {
  const a = ACTIONS[action];
  const [amount, setAmount] = useState("");
  const [counterparty, setCounterparty] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const amt = parseFloat(amount) || 0;
  const input = "vx-input bg-transparent border vx-border2 px-3 py-2.5 w-full text-sm focus:outline-none focus:border-[#F0B90B] transition-colors";

  const submit = async (e) => {
    e.preventDefault();
    if (amt <= 0) { toast.error("Enter a valid amount."); return; }
    if ((action === "withdraw" || action === "send") && amt > balance) { toast.error("Insufficient USDT balance."); return; }
    setBusy(true);
    try {
      const { data } = await api.post("/assets/transaction", { type: action, amount: amt, counterparty, note });
      toast.success(`${a.label} of ${amt.toLocaleString()} USDT successful.`);
      onDone(data);
    } catch (err) {
      toast.error(err.response?.data?.detail || "Transaction failed.");
    } finally { setBusy(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="vx-surface border vx-border2 w-full max-w-md" data-testid="txn-modal">
        <div className="flex items-center justify-between p-5 border-b vx-border">
          <h3 className="font-head font-bold vx-text flex items-center gap-2"><a.icon size={18} className="text-[#F0B90B]" /> {a.verb}</h3>
          <button onClick={onClose} data-testid="txn-close" className="vx-muted hover:text-[#F0B90B]"><X size={20} /></button>
        </div>
        <form onSubmit={submit} className="p-6 space-y-5">
          <div className="font-mono text-xs vx-faint">Available: <span className="text-[#F0B90B]">{fmt(balance)} USDT</span></div>
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest vx-faint block mb-1.5">Amount (USDT)</label>
            <input data-testid="txn-amount" type="number" step="0.01" min="0" className={input} placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} autoFocus />
            {amt > 0 && <div className="mt-1.5 font-mono text-xs vx-muted">≈ ₹{fmt(amt * rate)}</div>}
          </div>
          {action !== "withdraw" && (
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest vx-faint block mb-1.5">{action === "receive" ? "From (sender)" : "To (address / client)"}</label>
              <input data-testid="txn-counterparty" className={input} placeholder={action === "receive" ? "Sender name / wallet" : "Recipient name / wallet"} value={counterparty} onChange={(e) => setCounterparty(e.target.value)} />
            </div>
          )}
          <div>
            <label className="font-mono text-[10px] uppercase tracking-widest vx-faint block mb-1.5">Note (optional)</label>
            <input data-testid="txn-note" className={input} placeholder="Reference / remark" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <button data-testid="txn-submit" disabled={busy} className="w-full bg-[#F0B90B] text-black font-bold uppercase tracking-wide text-sm px-6 py-3 flex items-center justify-center gap-2 hover:bg-[#FCD535] transition-colors disabled:opacity-60">
            {busy && <Loader2 size={15} className="animate-spin" />} {a.cta}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
