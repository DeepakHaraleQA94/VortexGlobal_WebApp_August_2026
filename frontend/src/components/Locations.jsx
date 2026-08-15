import { Reveal } from "./Reveal";
import { MapPin } from "lucide-react";

const OFFICES = [
  {
    city: "Pune",
    tag: "Headquarters",
    address: "Magarpatta City, Aditi Garden, Hadapsar, Pune, Maharashtra 411013",
    img: "https://images.unsplash.com/photo-1739254831441-b81c435c8ea9?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  },
  {
    city: "Mumbai",
    tag: "Trading Floor",
    address: "Bandra Kurla Complex, Mumbai 400051",
    img: "https://images.unsplash.com/photo-1769271972348-429a8ad18f51?w=1200&q=85",
  },
  {
    city: "Bangalore",
    tag: "Client Desk",
    address: "108, Ramanashree Chambers, 37 Lady Curzon Road, Bangalore 560001",
    img: "https://images.unsplash.com/photo-1596796679119-7cf1a9e5448b?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
  },
];

export const Locations = () => (
  <section id="locations" data-testid="locations-section" className="py-24 md:py-32 relative z-10 vx-bg">
    <div className="max-w-7xl mx-auto px-6 md:px-10">
      <Reveal>
        <p className="font-mono text-xs tracking-[0.2em] uppercase text-[#F0B90B] mb-4">/ Office locations</p>
        <h2 className="font-head text-3xl md:text-5xl font-bold tracking-tight max-w-3xl vx-text">
          Present across India's financial hubs.
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
        {OFFICES.map((o, i) => (
          <Reveal key={o.city} delay={i * 0.1}>
            <div
              data-testid={`office-${o.city}`}
              className="group relative h-[420px] border vx-border overflow-hidden"
            >
              <img
                src={o.img}
                alt={o.city}
                className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:opacity-60 group-hover:scale-105 transition-[opacity,transform] duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060606] via-[#060606]/60 to-transparent" />
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#F0B90B] mb-2">
                  {o.tag}
                </span>
                <h3 className="font-head text-3xl font-bold mb-3 text-white">{o.city}</h3>
                <div className="flex items-start gap-2 text-white/70 text-sm">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-[#F0B90B]" />
                  <span>{o.address}</span>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);
