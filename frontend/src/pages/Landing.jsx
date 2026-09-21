import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { PriceTicker } from "../components/PriceTicker";
import { Highlights } from "../components/Highlights";
import { TotalTrades } from "../components/TotalTrades";
import { Stats } from "../components/Stats";
import { Services } from "../components/Services";
import { Tokens } from "../components/Tokens";
import { Manifesto } from "../components/Manifesto";
import { Insights } from "../components/Insights";
import { TrustBanner } from "../components/TrustBanner";
import { EditorialMarquee } from "../components/EditorialMarquee";
import { Locations } from "../components/Locations";
import { LeadForm } from "../components/LeadForm";
import { Footer } from "../components/Footer";
import { ChatWidget } from "../components/ChatWidget";

export default function Landing() {
  return (
    <div data-testid="landing-page" className="vx-grain relative vx-bg min-h-screen">
      <Header />
      <Hero />
      <PriceTicker />
      <Highlights />
      <Stats />
      <TotalTrades />
      <Services />
      <Tokens />
      <Manifesto />
      <Insights />
      <EditorialMarquee />
      <Locations />
      <TrustBanner />
      <LeadForm />
      <Footer />
      <ChatWidget />
    </div>
  );
}
