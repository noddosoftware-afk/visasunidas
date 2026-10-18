import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { TrustStory } from "./components/TrustStory";
import { Acrostic } from "./components/Acrostic";
import { Services } from "./components/Services";
import { ContactCTA } from "./components/ContactCTA";
import { Ubicacion } from "./components/Ubicacion";
import { Footer } from "./components/Footer";
import { MobileActionBar } from "./components/MobileActionBar";

export default function Home() {
  return (
    <div className="pb-20 md:pb-0">
      <Header />
      <main>
        <Hero />
        <TrustStory />
        <Acrostic />
        <Services />
        <ContactCTA />
        <Ubicacion />
      </main>
      <Footer />
      <MobileActionBar />
    </div>
  );
}
