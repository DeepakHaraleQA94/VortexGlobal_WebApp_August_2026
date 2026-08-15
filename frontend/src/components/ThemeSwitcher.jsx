import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Monitor, Check, SunMoon } from "lucide-react";
import { useTheme } from "../lib/theme";

const OPTIONS = [
  { value: "dark", label: "Dark", icon: Moon },
  { value: "light", label: "Light", icon: Sun },
  { value: "system", label: "System", icon: Monitor },
];

export const ThemeSwitcher = ({ variant = "solid" }) => {
  const { preference, setPreference } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const triggerColor = variant === "hero" ? "text-white/70 hover:text-white" : "vx-muted hover:vx-text";

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        data-testid="theme-switcher-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Change theme"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] transition-colors ${triggerColor}`}
      >
        <SunMoon size={16} />
        <span className="hidden lg:inline">Theme</span>
      </button>

      {open && (
        <div
          role="menu"
          data-testid="theme-switcher-menu"
          className="absolute right-0 mt-3 w-40 vx-surface vx-border border shadow-[0_16px_40px_rgba(0,0,0,0.35)] p-1.5 z-[70]"
        >
          {OPTIONS.map((o) => {
            const active = preference === o.value;
            return (
              <button
                key={o.value}
                role="menuitemradio"
                aria-checked={active}
                data-testid={`theme-option-${o.value}`}
                onClick={() => {
                  setPreference(o.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                  active ? "text-[#F0B90B]" : "vx-muted hover:vx-text"
                }`}
              >
                <o.icon size={15} />
                <span className="flex-1 text-left">{o.label}</span>
                {active && <Check size={14} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
