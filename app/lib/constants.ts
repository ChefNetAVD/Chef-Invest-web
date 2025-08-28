// Design constants
export const DESIGN_CONSTANTS = {
  // Breakpoints
  BREAKPOINTS: {
    mobile: 768,
    tablet: 1024,
    desktop: 1280,
    wide: 1536,
  },
  
  // Layout
  CONTAINER_MAX_WIDTH: 1536,
  HEADER_HEIGHT: 80,
  
  // Hero section
  HERO_HEIGHT: 860,
  HERO_BORDER_RADIUS: 70,
} as const;

// Navigation items
export const NAVIGATION_ITEMS = [
  { label: 'Главная', href: '/' },
  { label: 'О нас', href: '/about' },
  { label: 'Услуги', href: '/services' },
  { label: 'Контакты', href: '/contacts' }
];

// Hero section content
export const HERO_CONTENT = {
  title: 'Инвестируйте в будущее с ChefNet Invest',
  subtitle: 'Профессиональные инвестиционные решения для вашего капитала',
  ctaText: 'Начать инвестировать',
  ctaSecondary: 'Узнать больше'
};

// Features section content
export const FEATURES_CONTENT = {
  title: 'Почему выбирают нас',
  features: [
    {
      title: 'Профессиональный подход',
      description: 'Наша команда экспертов поможет вам принимать обоснованные инвестиционные решения'
    },
    {
      title: 'Безопасность',
      description: 'Ваши инвестиции защищены современными технологиями безопасности'
    },
    {
      title: 'Прозрачность',
      description: 'Полная прозрачность всех операций и комиссий'
    }
  ]
};

// About section content
export const ABOUT_CONTENT = {
  title: 'О компании ChefNet Invest',
  description: 'Мы являемся ведущей инвестиционной платформой, специализирующейся на предоставлении профессиональных инвестиционных решений для частных и корпоративных клиентов.',
  stats: [
    { value: '10+', label: 'Лет опыта' },
    { value: '1000+', label: 'Довольных клиентов' },
    { value: '$50M+', label: 'Под управлением' }
  ]
};

// Services section content
export const SERVICES_CONTENT = {
  title: 'Наши услуги',
  services: [
    {
      title: 'Инвестиционное планирование',
      description: 'Разработка персональной инвестиционной стратегии'
    },
    {
      title: 'Управление портфелем',
      description: 'Профессиональное управление вашими инвестициями'
    },
    {
      title: 'Консультации',
      description: 'Экспертные консультации по инвестиционным вопросам'
    }
  ]
};

// Contact section content
export const CONTACT_CONTENT = {
  title: 'Свяжитесь с нами',
  description: 'Готовы начать инвестировать? Наши эксперты готовы помочь вам.',
  contactInfo: {
    phone: '+7 (800) 555-0123',
    email: 'info@chefnet-invest.com',
    address: 'Москва, ул. Инвестиционная, 1'
  }
}; 