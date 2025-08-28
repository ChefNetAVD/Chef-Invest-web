import React from 'react';
import { Button } from '../ui/Button';
import { BackgroundImage } from '../ui/BackgroundImage';
import { HERO_CONTENT } from '../../lib/constants';

export const HeroSection: React.FC = () => {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center"
      style={{ 
        minHeight: 'var(--hero-height)',
        paddingTop: 'var(--header-height)'
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <BackgroundImage />
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Title */}
          <h1 
            className="text-6xl font-bold mb-6 leading-tight"
            style={{
              color: 'var(--color-text)',
              fontSize: 'var(--font-size-6xl)',
              lineHeight: 'var(--line-height-6xl)',
              fontWeight: 'var(--font-weight-bold)'
            }}
          >
            {HERO_CONTENT.title}
          </h1>
          
          {/* Subtitle */}
          <p 
            className="text-xl mb-8 leading-relaxed"
            style={{
              color: 'var(--color-text)',
              fontSize: 'var(--font-size-xl)',
              lineHeight: 'var(--line-height-xl)',
              fontWeight: 'var(--font-weight-normal)'
            }}
          >
            {HERO_CONTENT.subtitle}
          </p>
          
          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="primary" size="big">
              {HERO_CONTENT.ctaText}
            </Button>
            <Button variant="tertiary" size="big">
              {HERO_CONTENT.ctaSecondary}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}; 