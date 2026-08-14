import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { api } from "../lib/api";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export const PriceTicker = () => {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const { data } = await api.get("/crypto/prices");
        if (active) setPrices(data.prices || []);
      } catch (e) {
        /* silent */
      }
    };
    load();
    const t = setInterval(load, 45000);
    return () => {
      active = false;
      clearInterval(t);
    };
  }, []);

  if (!prices.length) return null;

  return (
    <div data-testid="price-ticker" className="border-y border-white/10 bg-[#0C0C0C] relative z-10">
      <Marquee speed={45} gradient={false} pauseOnHover>
        {prices.concat(prices).map((p, i) => {
          const up = p.change >= 0;
          return (
            <div key={i} className="flex items-center gap-3 px-8 py-4 border-r border-white/5">
              <span className="font-mono font-bold text-sm text-white">{p.symbol}</span>
              <span className="font-mono text-sm text-white/70">
                ${p.price >= 1 ? p.price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : p.price.toFixed(4)}
              </span>
              <span
                className="font-mono text-xs flex items-center gap-0.5"
                style={{ color: up ? "#0ECB81" : "#F6465D" }}
              >
                {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {Math.abs(p.change).toFixed(2)}%
              </span>
            </div>
          );
        })}
      </Marquee>
    </div>
  );
};
