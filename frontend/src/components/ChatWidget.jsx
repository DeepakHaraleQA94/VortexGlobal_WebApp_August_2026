import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { api } from "../lib/api";
import { VortexLogo } from "./VortexLogo";

const sessionId = "vx-" + Math.random().toString(36).slice(2, 11);

const WELCOME = {
  role: "assistant",
  content:
    "Hi, I'm Vera — the Vortex OTC concierge. Ask me about USDT settlements, OTC trading, tokens or our locations. Ready to trade? Tell me the volume and I'll get our desk on it.",
};

export const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  const send = async (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);
    try {
      const { data } = await api.post("/chat", { session_id: sessionId, message: text });
      setMessages((m) => [...m, { role: "assistant", content: data.reply }]);
      if (data.lead_captured) toast.success("Your request was sent to our OTC desk.");
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "Sorry, I'm having trouble right now. Please call +91 82620 30386." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        data-testid="chat-toggle"
        onClick={() => setOpen((o) => !o)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 bg-[#F0B90B] text-black flex items-center justify-center shadow-[0_0_30px_rgba(240,185,11,0.4)]"
        aria-label="Open AI chat"
      >
        {open ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="chat-panel"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-6 z-[60] w-[calc(100vw-3rem)] sm:w-[400px] h-[560px] max-h-[75vh] bg-[#0C0C0C] border border-white/15 flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-center gap-3 p-4 border-b border-white/10 bg-[#060606]">
              <VortexLogo size={28} />
              <div>
                <div className="font-head font-bold text-sm leading-none">Vera</div>
                <div className="font-mono text-[10px] text-[#F0B90B] uppercase tracking-widest mt-1 flex items-center gap-1">
                  <Sparkles size={10} /> AI OTC Concierge
                </div>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  data-testid={`chat-msg-${m.role}`}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-[#F0B90B] text-black"
                        : "bg-[#141414] text-white/85 border border-white/5"
                    }`}
                    dangerouslySetInnerHTML={{ __html: m.content.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>") }}
                  />
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#141414] border border-white/5 px-4 py-3 flex items-center gap-2 text-white/50">
                    <Loader2 size={14} className="animate-spin" /> <span className="text-xs font-mono">Vera is typing…</span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={send} className="p-3 border-t border-white/10 flex items-center gap-2 bg-[#060606]">
              <input
                data-testid="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about OTC, USDT, tokens…"
                className="flex-1 bg-transparent text-white text-sm py-2 px-2 focus:outline-none placeholder:text-white/30"
              />
              <button
                data-testid="chat-send"
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-[#F0B90B] text-black w-10 h-10 flex items-center justify-center hover:bg-[#FCD535] transition-colors disabled:opacity-40"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
