import HeroSection from "../components/home/HeroSection";
import MissionSection from "../components/home/MissionSection";
import MapSection from "../components/home/MapSection";
import HowItWorksSection from "../components/home/HowItWorksSection";
import CTASection from "../components/home/CTASection";
import NewsletterSection from "../components/home/NewsletterSection";

function Home() {
  return (
    <div>
      <HeroSection />
      <MissionSection />
      <MapSection />
      <HowItWorksSection />
      <NewsletterSection />
      <CTASection />
    </div>
  );
}

export default Home;