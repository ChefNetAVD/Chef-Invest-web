import React from 'react';
import { ABOUT_CONTENT } from '../../lib/constants';

export const AboutSection: React.FC = () => {
  return (
    <section 
      className="py-16 px-4"
      style={{
        paddingTop: 'var(--spacing-3xl)',
        paddingBottom: 'var(--spacing-3xl)',
        background: 'var(--color-secondary)'
      }}
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 
              className="text-4xl font-bold mb-6"
              style={{
                color: 'var(--color-text)',
                fontSize: 'var(--font-size-4xl)',
                lineHeight: 'var(--line-height-4xl)',
                fontWeight: 'var(--font-weight-bold)'
              }}
            >
              {ABOUT_CONTENT.title}
            </h2>
            
            <p 
              className="text-lg leading-relaxed mb-8"
              style={{
                color: 'var(--color-text)',
                fontSize: 'var(--font-size-lg)',
                lineHeight: 'var(--line-height-lg)',
                fontWeight: 'var(--font-weight-normal)'
              }}
            >
              {ABOUT_CONTENT.description}
            </p>
          </div>
          
          {/* Statistics */}
          <div className="grid grid-cols-3 gap-6">
            {ABOUT_CONTENT.stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center p-6 rounded-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-lg)'
                }}
              >
                <div 
                  className="text-3xl font-bold mb-2"
                  style={{
                    color: 'var(--color-primary)',
                    fontSize: 'var(--font-size-3xl)',
                    lineHeight: 'var(--line-height-3xl)',
                    fontWeight: 'var(--font-weight-bold)'
                  }}
                >
                  {stat.value}
                </div>
                <div 
                  className="text-sm"
                  style={{
                    color: 'var(--color-text)',
                    fontSize: 'var(--font-size-sm)',
                    lineHeight: 'var(--line-height-sm)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}; 