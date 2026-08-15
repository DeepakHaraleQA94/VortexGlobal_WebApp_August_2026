import { createContext, useContext, useEffect, useState } from "react";

const ThemeCtx = createContext({ preference: "dark", resolved: "dark", setPreference: () => {} });
const STORAGE_KEY = "vortex_theme";

const resolve = (pref) =>
  pref === "system"
    ? window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
    : pref;

const apply = (pref) => {
  const r = resolve(pref);
  document.documentElement.setAttribute("data-theme", r);
  return r;
};

export const ThemeProvider = ({ children }) => {
  const [preference, setPreference] = useState(
    () => localStorage.getItem(STORAGE_KEY) || "dark"
  );
  const [resolved, setResolved] = useState(
    () => document.documentElement.getAttribute("data-theme") || "dark"
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, preference);
    setResolved(apply(preference));
  }, [preference]);

  useEffect(() => {
    if (preference !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setResolved(apply("system"));
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [preference]);

  return (
    <ThemeCtx.Provider value={{ preference, resolved, setPreference }}>
      {children}
    </ThemeCtx.Provider>
  );
};

export const useTheme = () => useContext(ThemeCtx);
