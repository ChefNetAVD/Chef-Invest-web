import React from 'react';
import { Button } from '../ui/Button';
import { CONTACT_CONTENT } from '../../lib/constants';

export const ContactSection: React.FC = () => {
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
            {CONTACT_CONTENT.title}
          </h2>
          <p 
            className="text-lg"
            style={{
              color: 'var(--color-text)',
              fontSize: 'var(--font-size-lg)',
              lineHeight: 'var(--line-height-lg)',
              fontWeight: 'var(--font-weight-normal)'
            }}
          >
            {CONTACT_CONTENT.description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 
              className="text-2xl font-bold mb-6"
              style={{
                color: 'var(--color-text)',
                fontSize: 'var(--font-size-2xl)',
                lineHeight: 'var(--line-height-2xl)',
                fontWeight: 'var(--font-weight-bold)'
              }}
            >
              Контактная информация
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center">
                <div 
                  className="w-8 h-8 mr-3 rounded-full flex items-center justify-center"
                  style={{
                    background: 'var(--color-primary)',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  <span className="text-white text-sm">📞</span>
                </div>
                <span 
                  className="text-base"
                  style={{
                    color: 'var(--color-text)',
                    fontSize: 'var(--font-size-base)',
                    lineHeight: 'var(--line-height-base)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}
                >
                  {CONTACT_CONTENT.contactInfo.phone}
                </span>
              </div>
              
              <div className="flex items-center">
                <div 
                  className="w-8 h-8 mr-3 rounded-full flex items-center justify-center"
                  style={{
                    background: 'var(--color-primary)',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  <span className="text-white text-sm">✉️</span>
                </div>
                <span 
                  className="text-base"
                  style={{
                    color: 'var(--color-text)',
                    fontSize: 'var(--font-size-base)',
                    lineHeight: 'var(--line-height-base)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}
                >
                  {CONTACT_CONTENT.contactInfo.email}
                </span>
              </div>
              
              <div className="flex items-center">
                <div 
                  className="w-8 h-8 mr-3 rounded-full flex items-center justify-center"
                  style={{
                    background: 'var(--color-primary)',
                    borderRadius: 'var(--radius-full)'
                  }}
                >
                  <span className="text-white text-sm">📍</span>
                </div>
                <span 
                  className="text-base"
                  style={{
                    color: 'var(--color-text)',
                    fontSize: 'var(--font-size-base)',
                    lineHeight: 'var(--line-height-base)',
                    fontWeight: 'var(--font-weight-normal)'
                  }}
                >
                  {CONTACT_CONTENT.contactInfo.address}
                </span>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div>
            <h3 
              className="text-2xl font-bold mb-6"
              style={{
                color: 'var(--color-text)',
                fontSize: 'var(--font-size-2xl)',
                lineHeight: 'var(--line-height-2xl)',
                fontWeight: 'var(--font-weight-bold)'
              }}
            >
              Отправить сообщение
            </h3>
            
            <form className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Ваше имя"
                  className="w-full p-3 rounded-lg border"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'var(--color-text)'
                  }}
                />
              </div>
              
              <div>
                <input
                  type="email"
                  placeholder="Ваш email"
                  className="w-full p-3 rounded-lg border"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'var(--color-text)'
                  }}
                />
              </div>
              
              <div>
                <textarea
                  placeholder="Ваше сообщение"
                  rows={4}
                  className="w-full p-3 rounded-lg border resize-none"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: 'var(--radius-lg)',
                    color: 'var(--color-text)'
                  }}
                />
              </div>
              
              <Button variant="primary" size="standard" className="w-full">
                Отправить
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}; 