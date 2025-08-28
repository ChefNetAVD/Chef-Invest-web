import React from 'react';
import { Button } from '../ui/Button';
import { SERVICES_CONTENT } from '../../lib/constants';

export const ServicesSection: React.FC = () => {
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
            {SERVICES_CONTENT.title}
          </h2>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {SERVICES_CONTENT.services.map((service, index) => (
            <div 
              key={index}
              className="p-6 rounded-lg border"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 'var(--radius-lg)',
                borderColor: 'rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Service Icon Placeholder */}
              <div 
                className="w-12 h-12 mb-4 rounded-lg flex items-center justify-center"
                style={{
                  background: 'var(--gradient-primary)',
                  borderRadius: 'var(--radius-lg)'
                }}
              >
                <span className="text-white text-lg font-bold">
                  {index + 1}
                </span>
              </div>
              
              {/* Service Title */}
              <h3 
                className="text-xl font-bold mb-3"
                style={{
                  color: 'var(--color-text)',
                  fontSize: 'var(--font-size-xl)',
                  lineHeight: 'var(--line-height-xl)',
                  fontWeight: 'var(--font-weight-bold)'
                }}
              >
                {service.title}
              </h3>
              
              {/* Service Description */}
              <p 
                className="text-base leading-relaxed mb-4"
                style={{
                  color: 'var(--color-text)',
                  fontSize: 'var(--font-size-base)',
                  lineHeight: 'var(--line-height-base)',
                  fontWeight: 'var(--font-weight-normal)'
                }}
              >
                {service.description}
              </p>
              
              {/* Learn More Button */}
              <Button variant="tertiary" size="small">
                Узнать больше
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 