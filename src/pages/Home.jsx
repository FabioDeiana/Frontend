import HeroSection from "../components/home/HeroSection";
import MissionSection from "../components/home/MissionSection";
import MapSection from "../components/home/MapSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import CTASection from "../components/home/CTASection";

function Home() {
  return (
    <div>
      <HeroSection />
      <MissionSection />
      <MapSection />
      <HowItWorksSection />
      <CTASection />
    </div>
  );
}

export default Home;