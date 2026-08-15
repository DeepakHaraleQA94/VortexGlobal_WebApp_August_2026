import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { VortexLogo } from "./VortexLogo";
import { ThemeSwitcher } from "./ThemeSwitcher";

const NAV = [
  { label: "Services", id: "services" },
  { label: "Assets", id: "assets" },
  { label: "Manifesto", id: "manifesto" },
  { label: "AI Desk", id: "insights" },
  { label: "Locations", id: "locations" },
];

export const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const onHero = !scrolled && pathname === "/";
  const linkColor = onHero ? "text-white/70 hover:text-white" : "vx-muted hover:vx-text";
  const logoColor = onHero ? "text-white" : "vx-text";

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "vx-header backdrop-blur-xl border-b vx-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 h-20 flex items-center justify-between">
        <Link to="/" data-testid="logo-link" className={`flex items-center gap-3 ${logoColor}`}>
          <VortexLogo size={42} />
          <span className="font-head font-extrabold text-base sm:text-lg tracking-tight leading-tight">
            VORTEX GLOBAL<span className="text-[#F0B90B]">.</span>
            <span className="hidden sm:block font-mono text-[8px] uppercase tracking-[0.2em] opacity-70 font-normal mt-0.5">Exchanges & Crypto Services</span>
          </span>
        </Link>

        {pathname === "/" && (
          <nav className="hidden md:flex items-center gap-9">
            {NAV.map((n) => (
              <button
                key={n.id}
                data-testid={`nav-${n.id}`}
                onClick={() => go(n.id)}
                className={`font-mono text-xs uppercase tracking-[0.15em] transition-colors ${linkColor}`}
              >
                {n.label}
              </button>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-4 md:gap-5">
          <ThemeSwitcher variant={onHero ? "hero" : "solid"} />
          <Link
            to="/admin"
            data-testid="admin-portal-link"
            className={`hidden sm:inline-block font-mono text-xs uppercase tracking-[0.15em] transition-colors ${linkColor}`}
          >
            Admin
          </Link>
          <button
            data-testid="header-trade-cta"
            onClick={() => go("contact")}
            className="bg-[#F0B90B] text-black font-bold uppercase tracking-wide text-xs px-5 py-3 hover:bg-[#FCD535] transition-colors"
          >
            Trade Now
          </button>
        </div>
      </div>
    </header>
  );
};
