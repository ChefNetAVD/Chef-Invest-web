# ChefInvest - Инструкции по развертыванию

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+ 
- npm или yarn
- Git

### Локальное развертывание

1. **Клонирование репозитория:**
   ```bash
   git clone <repository-url>
   cd ChefInvest
   ```

2. **Установка зависимостей:**
   ```bash
   npm install
   ```

3. **Создание файла окружения:**
   ```bash
   cp .env.example .env.local
   ```

4. **Запуск в режиме разработки:**
   ```bash
   npm run dev
   ```

5. **Открыть в браузере:**
   ```
   http://localhost:3000
   ```

## 🌐 Продакшн развертывание

### Vercel (Рекомендуется)

1. **Подключение к Vercel:**
   - Зайдите на [vercel.com](https://vercel.com)
   - Подключите ваш GitHub репозиторий
   - Vercel автоматически определит Next.js проект

2. **Настройка переменных окружения:**
   ```env
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   DATABASE_URL=your-database-url
   JWT_SECRET=your-jwt-secret
   ```

3. **Деплой:**
   - Vercel автоматически деплоит при каждом push в main ветку
   - Или используйте `vercel --prod` для ручного деплоя

### Netlify

1. **Подключение к Netlify:**
   - Зайдите на [netlify.com](https://netlify.com)
   - Подключите ваш GitHub репозиторий

2. **Настройка сборки:**
   ```bash
   Build command: npm run build
   Publish directory: .next
   ```

3. **Переменные окружения:**
   - Добавьте переменные в настройках Netlify

### Docker

1. **Создание Dockerfile:**
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   RUN npm run build
   
   EXPOSE 3000
   
   CMD ["npm", "start"]
   ```

2. **Сборка и запуск:**
   ```bash
   docker build -t chefinvest .
   docker run -p 3000:3000 chefinvest
   ```

## 🔧 Настройка окружения

### Переменные окружения

Создайте файл `.env.local`:

```env
# Основные настройки
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development

# База данных (для будущего использования)
DATABASE_URL=postgresql://user:password@localhost:5432/chefinvest

# JWT токены
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Криптовалютные кошельки
USDT_TRC20_ADDRESS=your-trc20-address
USDT_BEP20_ADDRESS=your-bep20-address

# API ключи (для будущих интеграций)
COINMARKETCAP_API_KEY=your-api-key
ETHERSCAN_API_KEY=your-api-key

# Email (для уведомлений)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Мониторинг
SENTRY_DSN=your-sentry-dsn
```

### Настройка базы данных

**PostgreSQL (Рекомендуется):**

1. **Установка PostgreSQL:**
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   
   # macOS
   brew install postgresql
   ```

2. **Создание базы данных:**
   ```sql
   CREATE DATABASE chefinvest;
   CREATE USER chefinvest_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE chefinvest TO chefinvest_user;
   ```

3. **Миграции (будущее):**
   ```bash
   npm run migrate
   ```

## 🔒 Безопасность

### SSL/HTTPS
- **Vercel/Netlify**: Автоматически предоставляют SSL
- **Собственный сервер**: Настройте Let's Encrypt

### Заголовки безопасности
Добавьте в `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};
```

### Ограничение доступа
- Настройте CORS для API endpoints
- Используйте rate limiting
- Валидируйте все входные данные

## 📊 Мониторинг

### Логирование
```typescript
// utils/logger.ts
export const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error);
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data);
  }
};
```

### Метрики
- **Vercel Analytics**: Встроенная аналитика
- **Google Analytics**: Для пользовательской аналитики
- **Sentry**: Для отслеживания ошибок

## 🔄 CI/CD

### GitHub Actions

Создайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build application
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 🧪 Тестирование

### Unit тесты
```bash
npm test
```

### E2E тесты
```bash
npm run test:e2e
```

### Проверка типов
```bash
npm run type-check
```

## 📈 Оптимизация

### Производительность
- **Image Optimization**: Next.js автоматически оптимизирует изображения
- **Code Splitting**: Автоматическое разделение кода
- **Caching**: Настройте кэширование статических ресурсов

### Bundle Analysis
```bash
npm run analyze
```

### Lighthouse
- Регулярно проверяйте производительность
- Оптимизируйте Core Web Vitals
- Улучшайте SEO

## 🚨 Troubleshooting

### Частые проблемы

1. **Ошибка сборки:**
   ```bash
   npm run build
   # Проверьте ошибки TypeScript
   npm run type-check
   ```

2. **Проблемы с зависимостями:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Проблемы с портами:**
   ```bash
   # Проверьте занятые порты
   lsof -i :3000
   # Убейте процесс
   kill -9 <PID>
   ```

4. **Проблемы с кэшем:**
   ```bash
   # Очистите кэш Next.js
   rm -rf .next
   npm run dev
   ```

## 📞 Поддержка

### Полезные команды
```bash
# Проверка версий
node --version
npm --version

# Очистка кэша
npm cache clean --force

# Обновление зависимостей
npm update

# Проверка безопасности
npm audit
npm audit fix
```

### Логи
- **Vercel**: Логи доступны в dashboard
- **Netlify**: Логи в настройках сайта
- **Собственный сервер**: Проверьте systemd logs

### Контакты
- **Техническая поддержка**: dev@chefinvest.com
- **Telegram**: @chefinvest_dev
- **GitHub Issues**: [repository-url]/issues
