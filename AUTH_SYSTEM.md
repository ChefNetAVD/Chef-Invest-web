# Система аутентификации ChefInvest

## 📋 Обзор

Полностью функциональная система аутентификации с JWT токенами, интегрированная с торговой системой платформы.

## 🏗️ Архитектура

### Основные компоненты:

1. **JWT токены** - Access и Refresh токены для безопасной аутентификации
2. **UserService** - In-memory сервис для управления пользователями
3. **Auth Middleware** - Защита API эндпоинтов
4. **React Hooks** - Интеграция с фронтендом
5. **API Endpoints** - REST API для аутентификации

### Структура файлов:

```
app/
├── types/
│   └── auth.ts                    # TypeScript типы для аутентификации
├── utils/
│   └── auth.ts                    # Утилиты для работы с JWT
├── services/
│   └── auth/
│       └── userService.ts         # Сервис управления пользователями
├── middleware/
│   └── auth.ts                    # Middleware для защиты API
├── hooks/
│   ├── useAuth.ts                 # Хук для аутентификации
│   ├── useApi.ts                  # Хук для API запросов
│   └── useAuthenticatedTrading.ts # Интегрированный торговый хук
└── api/
    └── auth/
        ├── register/route.ts      # Регистрация
        ├── login/route.ts         # Вход
        ├── me/route.ts            # Профиль пользователя
        └── refresh/route.ts       # Обновление токенов
```

## 🔧 Конфигурация

### Переменные окружения:

Создайте файл `.env.local`:

```env
# JWT токены
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_EXPIRES_IN=7d

# Основные настройки
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

## 🚀 Использование

### 1. Регистрация пользователя:

```typescript
import { useAuth } from './hooks/useAuth';

const { register } = useAuth();

const handleRegister = async () => {
  const success = await register({
    email: 'user@example.com',
    username: 'username',
    password: 'SecurePass123!',
    firstName: 'John',
    lastName: 'Doe',
    referrerId: 'referrer123' // опционально
  });
  
  if (success) {
    console.log('Registration successful');
  }
};
```

### 2. Вход в систему:

```typescript
const { login } = useAuth();

const handleLogin = async () => {
  const success = await login({
    email: 'user@example.com',
    password: 'SecurePass123!'
  });
  
  if (success) {
    console.log('Login successful');
  }
};
```

### 3. Защищенные API запросы:

```typescript
import { useApi } from './hooks/useApi';

const api = useApi();

// Автоматически добавляет токен в заголовки
const response = await api.get('/api/usdt-payments');
const data = await response.json();
```

### 4. Торговая система с аутентификацией:

```typescript
import { useAuthenticatedTrading } from './hooks/useAuthenticatedTrading';

const {
  isAuthenticated,
  user,
  balance,
  portfolio,
  buyShares,
  sellShares,
  deposit
} = useAuthenticatedTrading();

// Покупка акций (только для авторизованных)
const handleBuyShares = async () => {
  if (isAuthenticated) {
    await buyShares(1000, 0.10);
  }
};
```

### 5. Email верификация:

```typescript
const { requestEmailVerification, confirmEmailVerification } = useAuth();

// Запрос верификации email
const handleRequestVerification = async () => {
  const success = await requestEmailVerification('user@example.com');
  if (success) {
    console.log('Verification email sent');
  }
};

// Подтверждение верификации
const handleConfirmVerification = async () => {
  const success = await confirmEmailVerification('123456');
  if (success) {
    console.log('Email verified successfully');
  }
};
```

### 6. Восстановление пароля:

```typescript
const { requestPasswordReset, confirmPasswordReset } = useAuth();

// Запрос сброса пароля
const handleRequestPasswordReset = async () => {
  const success = await requestPasswordReset('user@example.com');
  if (success) {
    console.log('Password reset email sent');
  }
};

// Подтверждение сброса пароля
const handleConfirmPasswordReset = async () => {
  const success = await confirmPasswordReset('token123', 'NewPass123!');
  if (success) {
    console.log('Password reset successfully');
  }
};
```

### 7. Проверка статуса токенов:

```typescript
const { checkTokenStatus } = useAuth();

// Проверка статуса токена верификации email
const checkEmailToken = async () => {
  const status = await checkTokenStatus('123456', 'email-verification');
  if (status?.valid) {
    console.log('Token is valid');
  }
};

// Проверка статуса токена сброса пароля
const checkResetToken = async () => {
  const status = await checkTokenStatus('token123', 'password-reset');
  if (status?.valid) {
    console.log('Reset token is valid');
  }
};
```

## 📡 API Endpoints

### POST /api/auth/register
Регистрация нового пользователя:

```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "referrerId": "referrer123"
}
```

**Ответ:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "username": "username",
    "role": "user",
    "isEmailVerified": false
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "User registered successfully"
}
```

### POST /api/auth/login
Вход в систему:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Ответ:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "username": "username",
    "role": "user",
    "isEmailVerified": false
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

### GET /api/auth/me
Получение профиля пользователя:

**Заголовки:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ответ:**
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "username": "username",
    "firstName": "John",
    "lastName": "Doe",
    "avatar": null,
    "isEmailVerified": false,
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastLoginAt": "2024-01-01T12:00:00.000Z",
    "referrerId": "referrer123"
  }
}
```

### POST /api/auth/refresh
Обновление токенов:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Ответ:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Tokens refreshed successfully"
}
```

## 📧 Email верификация

### POST /api/auth/verify-email/request
Запрос верификации email:

```json
{
  "email": "user@example.com"
}
```

**Ответ:**
```json
{
  "success": true,
  "message": "Verification email sent successfully",
  "verificationToken": "123456",
  "verificationLink": "http://localhost:3000/verify-email?token=123456"
}
```

### POST /api/auth/verify-email/confirm
Подтверждение верификации email:

```json
{
  "token": "123456"
}
```

**Ответ:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

## 🔑 Восстановление пароля

### POST /api/auth/reset-password/request
Запрос сброса пароля:

```json
{
  "email": "user@example.com"
}
```

**Ответ:**
```json
{
  "success": true,
  "message": "If an account with this email exists, a password reset link has been sent.",
  "resetToken": "abc123def456...",
  "resetLink": "http://localhost:3000/reset-password?token=abc123def456..."
}
```

### POST /api/auth/reset-password/confirm
Подтверждение сброса пароля:

```json
{
  "token": "abc123def456...",
  "newPassword": "NewSecurePass123!"
}
```

**Ответ:**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

## 🔍 Проверка статуса токенов

### GET /api/auth/token-status?token=123456&type=email-verification
Проверка статуса токена:

**Ответ:**
```json
{
  "success": true,
  "exists": true,
  "valid": true,
  "expired": false,
  "used": false,
  "expiresAt": "2024-01-02T00:00:00.000Z",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## 📊 Статистика токенов (только для админов)

### GET /api/auth/token-stats
Получение статистики токенов:

**Заголовки:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Ответ:**
```json
{
  "success": true,
  "stats": {
    "tokens": {
      "emailVerificationTokens": 5,
      "passwordResetTokens": 2,
      "activeEmailVerifications": 3,
      "activePasswordResets": 1
    },
    "users": {
      "total": 10,
      "active": 9,
      "verified": 7,
      "byRole": {
        "user": 8,
        "admin": 1,
        "moderator": 1
      }
    }
  }
}
```

## 🔒 Безопасность

### Валидация паролей:
- Минимум 8 символов
- Содержит заглавные и строчные буквы
- Содержит цифры и специальные символы

### Валидация email:
- Проверка формата email
- Уникальность в системе

### Валидация username:
- 3-20 символов
- Только буквы, цифры и подчеркивания
- Уникальность в системе

### JWT токены:
- Access токен: 24 часа
- Refresh токен: 7 дней
- Автоматическое обновление при истечении

## 🛡️ Middleware

### requireAuth
Защищает API эндпоинты:

```typescript
import { requireAuth } from './middleware/auth';

export const GET = requireAuth(async (request: NextRequest) => {
  // Только для авторизованных пользователей
  const user = getUserFromRequest(request);
  // ...
});
```

### requireRole
Проверяет роли пользователей:

```typescript
import { requireRole } from './middleware/auth';

export const GET = requireRole('admin')(requireAuth(async (request: NextRequest) => {
  // Только для админов
}));
```

## 🔄 Интеграция с торговой системой

### Автоматическая инициализация:
При регистрации пользователь автоматически инициализируется в торговой системе:

```typescript
// В userService.registerUser()
const newUser = await userService.registerUser(credentials);

// Автоматически создается:
// - Баланс пользователя
// - Портфель акций
// - Партнерская сеть (если есть referrerId)
```

### Защищенные операции:
Все торговые операции теперь требуют аутентификации:

```typescript
// Покупка акций
const result = await buyShares(1000, 0.10);

// Пополнение через USDT
const success = await deposit(100, 'TRC20');

// Получение реферальной статистики
const stats = await getReferralStats();
```

## 📊 Роли пользователей

### user (обычный пользователь)
- Покупка/продажа акций
- Пополнение баланса
- Участие в реферальной программе
- Просмотр своего профиля

### moderator (модератор)
- Все права пользователя
- Просмотр статистики пользователей
- Модерация контента

### admin (администратор)
- Все права модератора
- Управление пользователями
- Доступ к системной статистике
- Обработка платежей

## 🧪 Тестирование

### Тестовые пользователи:
Для демонстрации созданы тестовые пользователи:

```typescript
// Тестовый пароль для всех пользователей
const testPassword = 'password123';

// Примеры тестовых пользователей:
// admin@chefinvest.com / password123 (роль: admin)
// user@chefinvest.com / password123 (роль: user)
```

### Тестирование API:

```bash
# Регистрация
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"testuser","password":"password123"}'

# Вход
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Получение профиля
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🚨 Важные замечания

1. **In-memory хранилище**: Пользователи хранятся в памяти и теряются при перезапуске
2. **Тестовые пароли**: В production используйте реальную БД с хешированными паролями
3. **JWT Secret**: Обязательно измените JWT_SECRET в production
4. **HTTPS**: В production используйте только HTTPS для передачи токенов

## 📞 Поддержка

Система аутентификации полностью готова к использованию и интеграции с фронтендом. Все API эндпоинты защищены и готовы к работе.

Для вопросов и предложений:
- Email: dev@chefinvest.com
- GitHub Issues: [repository-url]/issues
