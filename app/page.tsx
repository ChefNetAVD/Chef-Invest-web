import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { HeroSection } from "./components/sections/HeroSection";
import { FeaturesSection } from "./components/sections/FeaturesSection";
import { AboutSection } from "./components/sections/AboutSection";
import { ServicesSection } from "./components/sections/ServicesSection";
import { ContactSection } from "./components/sections/ContactSection";
import { MobileMockupsSection } from "./components/sections/MobileMockupsSection";
import { InvestmentRoundsSection } from "./components/sections/InvestmentRoundsSection";
import { RoadmapSection } from "./components/sections/RoadmapSection";
import { ScrollToTop } from "./components/ui/ScrollToTop";
import { DesignSystemDemo } from "./components/sections/DesignSystemDemo";

export default function Home() {
  return (
    <div className="landing-page">
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* About Section */}
      <AboutSection />
      
      {/* Services Section */}
      <ServicesSection />
      
      {/* Mobile Mockups Section */}
      <MobileMockupsSection />
      
      {/* Investment Rounds Section */}
      <InvestmentRoundsSection />
      
      {/* Roadmap Section */}
      <RoadmapSection />
      
      {/* Contact Section */}
      <ContactSection />
      
      {/* Footer */}
      <Footer />
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
      
      {/* Design System Demo */}
      <DesignSystemDemo />
    </div>
  );
}
