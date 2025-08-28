import React from 'react';
import { FEATURES_CONTENT } from '../../lib/constants';

export const FeaturesSection: React.FC = () => {
  return (
    <section 
      className="py-16 px-4"
      style={{
        paddingTop: 'var(--spacing-3xl)',
        paddingBottom: 'var(--spacing-3xl)',
        background: 'var(--color-background)'
      }}
    >
      <div className="container mx-auto max-w-6xl">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 
            className="text-4xl font-bold mb-4"
            style={{
              color: 'var(--color-text)',
              fontSize: 'var(--font-size-4xl)',
              lineHeight: 'var(--line-height-4xl)',
              fontWeight: 'var(--font-weight-bold)'
            }}
          >
            {FEATURES_CONTENT.title}
          </h2>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES_CONTENT.features.map((feature, index) => (
            <div 
              key={index}
              className="text-center p-6 rounded-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-lg)'
              }}
            >
              {/* Feature Icon Placeholder */}
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{
                  background: 'var(--gradient-primary)',
                  borderRadius: 'var(--radius-full)'
                }}
              >
                <span className="text-white text-2xl font-bold">
                  {index + 1}
                </span>
              </div>
              
              {/* Feature Title */}
              <h3 
                className="text-xl font-bold mb-3"
                style={{
                  color: 'var(--color-text)',
                  fontSize: 'var(--font-size-xl)',
                  lineHeight: 'var(--line-height-xl)',
                  fontWeight: 'var(--font-weight-bold)'
                }}
              >
                {feature.title}
              </h3>
              
              {/* Feature Description */}
              <p 
                className="text-base leading-relaxed"
                style={{
                  color: 'var(--color-text)',
                  fontSize: 'var(--font-size-base)',
                  lineHeight: 'var(--line-height-base)',
                  fontWeight: 'var(--font-weight-normal)'
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 