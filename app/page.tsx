import { Header } from "./components/layout/Header";
import { HeroSection } from "./components/sections/HeroSection";
import { FeaturesSection } from "./components/sections/FeaturesSection";
import { AboutSection } from "./components/sections/AboutSection";
import { ServicesSection } from "./components/sections/ServicesSection";
import { ContactSection } from "./components/sections/ContactSection";
import InvestmentCalculator from "./components/InvestmentCalculator";
import CryptoPayments from "./components/CryptoPayments";

export default function Home() {
  return (
    <div className="min-h-screen">
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
      
      {/* Contact Section */}
      <ContactSection />
      
      {/* Business Logic Section (Original) */}
      <section className="bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            ChefInvest - Бизнес Логика
          </h1>
          
          {/* Калькулятор инвестиций */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Калькулятор инвестиций
            </h2>
            <InvestmentCalculator />
          </div>

          {/* Криптоплатежи */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Криптоплатежи
            </h2>
            <CryptoPayments />
          </div>
        </div>
      </section>
    </div>
  );
}
