# ChefInvest - Настройка GitHub репозитория

## 🚀 Быстрая настройка

### 1. Создание репозитория на GitHub

1. Зайдите на [github.com](https://github.com)
2. Нажмите "New repository"
3. Заполните форму:
   - **Repository name**: `ChefInvest`
   - **Description**: `Платформа инвестиций в FoodTech с развитой бизнес-логикой`
   - **Visibility**: Public или Private (по вашему выбору)
   - **Initialize with**: НЕ ставьте галочки (у нас уже есть файлы)

### 2. Инициализация Git в проекте

```bash
# Инициализация Git
git init

# Добавление всех файлов
git add .

# Первый коммит
git commit -m "Initial commit: ChefInvest platform with business logic"

# Добавление удаленного репозитория
git remote add origin https://github.com/YOUR_USERNAME/ChefInvest.git

# Отправка в GitHub
git branch -M main
git push -u origin main
```

### 3. Настройка веток

```bash
# Создание ветки разработки
git checkout -b develop

# Отправка ветки разработки
git push -u origin develop

# Возврат на main
git checkout main
```

## 📋 Структура репозитория

```
ChefInvest/
├── 📁 app/                    # Основной код приложения
│   ├── 📁 components/         # UI компоненты
│   ├── 📁 hooks/             # React хуки
│   ├── 📁 types/             # TypeScript типы
│   ├── 📁 utils/             # Бизнес-логика
│   ├── layout.tsx            # Основной layout
│   ├── page.tsx              # Главная страница
│   └── globals.css           # Глобальные стили
├── 📁 public/                # Статические файлы
├── 📄 README.md              # Основная документация
├── 📄 API.md                 # Документация API
├── 📄 DEPLOYMENT.md          # Инструкции по развертыванию
├── 📄 GITHUB_SETUP.md        # Эта инструкция
├── 📄 env.example            # Пример переменных окружения
├── 📄 .gitignore             # Исключения Git
├── 📄 package.json           # Зависимости проекта
├── 📄 tsconfig.json          # Конфигурация TypeScript
└── 📄 next.config.ts         # Конфигурация Next.js
```

## 🔧 Настройка GitHub

### 1. Описание репозитория

Добавьте в описание репозитория:
```
🍽️ Платформа инвестиций в FoodTech с развитой бизнес-логикой

✅ 3-уровневая партнерская программа
✅ Торговля акциями по фиксированной цене
✅ Централизованная транзакционная система
✅ Модульная архитектура (Next.js 15 + TypeScript)

🚀 Технологии: Next.js, TypeScript, Tailwind CSS
```

### 2. Топики (Topics)

Добавьте топики для лучшей индексации:
```
nextjs, typescript, investment-platform, foodtech, trading-system, partnership-program, react, tailwindcss, business-logic
```

### 3. README на главной странице

GitHub автоматически покажет содержимое `README.md` на главной странице репозитория.

## 🏷️ Теги и релизы

### Создание первого релиза

```bash
# Создание тега
git tag -a v1.0.0 -m "Initial release with business logic"

# Отправка тега
git push origin v1.0.0
```

### На GitHub:
1. Перейдите в "Releases"
2. Нажмите "Create a new release"
3. Выберите тег `v1.0.0`
4. Заполните описание:
   ```
   ## 🎉 Первый релиз
   
   ### ✅ Реализовано:
   - 3-уровневая партнерская программа
   - Торговля акциями ($0.01 за акцию)
   - Централизованная транзакционная система
   - Модульная архитектура
   - TypeScript интерфейсы
   - React хуки для бизнес-логики
   
   ### 🚀 Технологии:
   - Next.js 15
   - TypeScript
   - Tailwind CSS 4
   - React Hooks
   ```

## 🔄 Рабочий процесс

### Основные ветки:
- `main` - продакшн код
- `develop` - разработка
- `feature/*` - новые функции
- `hotfix/*` - срочные исправления

### Коммиты:
```bash
# Новые функции
git commit -m "feat: add withdrawal functionality"

# Исправления
git commit -m "fix: resolve transaction validation issue"

# Документация
git commit -m "docs: update API documentation"

# Рефакторинг
git commit -m "refactor: improve trading system performance"
```

## 📊 GitHub Actions (опционально)

Создайте `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
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
    
    - name: Type check
      run: npm run type-check
    
    - name: Build
      run: npm run build
```

## 🔒 Безопасность

### Секреты репозитория:
1. Перейдите в Settings → Secrets and variables → Actions
2. Добавьте необходимые секреты:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `API_KEYS`

### Защита веток:
1. Settings → Branches
2. Add rule для `main`:
   - Require pull request reviews
   - Require status checks to pass
   - Restrict pushes that create files

## 📈 Аналитика

### GitHub Insights:
- **Traffic**: Просмотры и клоны
- **Contributors**: Участники проекта
- **Commits**: Активность разработки

### Дополнительные инструменты:
- **Codecov**: Покрытие тестами
- **Snyk**: Безопасность зависимостей
- **Dependabot**: Автоматические обновления

## 🚀 Следующие шаги

1. **Настройте CI/CD** с GitHub Actions
2. **Добавьте Issues** для отслеживания задач
3. **Создайте Projects** для управления проектом
4. **Настройте Wiki** для дополнительной документации
5. **Добавьте CODE_OF_CONDUCT.md** для правил поведения

## 📞 Поддержка

- **GitHub Issues**: Для багов и предложений
- **GitHub Discussions**: Для обсуждений
- **Email**: dev@chefinvest.com
- **Telegram**: @chefinvest_dev

---

**Удачной разработки! 🚀**
