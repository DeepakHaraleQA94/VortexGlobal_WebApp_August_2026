import { useEffect } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import { Toaster } from "sonner";
import { ThemeProvider, useTheme } from "./lib/theme";
import Landing from "./pages/Landing";
import Admin from "./pages/Admin";
import Company from "./pages/Company";

function ThemedToaster() {
  const { resolved } = useTheme();
  return (
    <Toaster
      theme={resolved}
      position="top-right"
      toastOptions={{
        style: {
          background: "rgb(var(--surface-rgb))",
          border: "1px solid rgb(var(--line-rgb) / 0.12)",
          color: "rgb(var(--fg-rgb))",
          borderRadius: 0,
        },
      }}
    />
  );
}

function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <ThemeProvider>
      <div className="App vx-bg">
        <ThemedToaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/company" element={<Company />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
