import { Header } from './components/layout/Header';
import { HeroSection } from './components/sections/HeroSection';
import { FeaturesHeadline } from './components/sections/FeaturesHeadline';
import SecondSection from './components/sections/SecondSection';

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col">
      {/* Background Image */}
      <div style={{
        position: 'absolute',
        left: '0%',
        right: '0%',
        top: '0%',
        bottom: '0%',
        background: 'url(/2-10.jpg) center/cover no-repeat',
        borderRadius: '0px 0px 70px 70px'
      }} />
      
      {/* Header */}
      <Header />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Headline Section */}
      <FeaturesHeadline />
      
      {/* Second Section */}
      <SecondSection />
    </main>
  );
}
