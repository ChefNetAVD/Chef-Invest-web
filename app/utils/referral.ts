import { TradingSystem } from './tradingSystem';

/**
 * Генерирует реферальную ссылку для пользователя
 */
export function generateReferralLink(userId: string, baseUrl: string = 'https://chef-invest.com'): string {
  return `${baseUrl}/register?ref=${userId}`;
}

/**
 * Извлекает ID реферера из URL
 */
export function extractReferrerId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const refParam = urlObj.searchParams.get('ref');
    return refParam || null;
  } catch (error) {
    console.error('Error extracting referrer ID from URL:', error);
    return null;
  }
}

/**
 * Валидирует реферальный ID
 */
export function validateReferrerId(referrerId: string, tradingSystem: TradingSystem): boolean {
  if (!referrerId || typeof referrerId !== 'string') {
    return false;
  }

  // Проверяем, что пользователь существует
  const userBalance = tradingSystem.getUserBalance(referrerId);
  if (!userBalance) {
    return false;
  }

  // Проверяем, что это не тот же пользователь
  return true;
}

/**
 * Обрабатывает регистрацию с рефералом
 */
export function processReferralRegistration(
  newUserId: string,
  referrerId: string,
  tradingSystem: TradingSystem
): boolean {
  try {
    // Валидируем реферера
    if (!validateReferrerId(referrerId, tradingSystem)) {
      console.error(`Invalid referrer ID: ${referrerId}`);
      return false;
    }

    // Инициализируем нового пользователя с реферером
    tradingSystem.initializeUser(newUserId, referrerId);

    // Обновляем сеть реферера
    updateReferrerNetwork(referrerId, newUserId, tradingSystem);

    console.log(`✅ Referral registration successful: ${newUserId} referred by ${referrerId}`);
    return true;

  } catch (error) {
    console.error('Error processing referral registration:', error);
    return false;
  }
}

/**
 * Обновляет сеть реферера при добавлении нового партнера
 */
function updateReferrerNetwork(
  referrerId: string,
  newPartnerId: string,
  tradingSystem: TradingSystem
): void {
  const referrerNetwork = tradingSystem.getPartnerNetwork(referrerId);
  if (!referrerNetwork) {
    console.error(`Referrer network not found: ${referrerId}`);
    return;
  }

  // Добавляем нового партнера в список прямых рефералов
  if (!referrerNetwork.level1Partners.includes(newPartnerId)) {
    referrerNetwork.level1Partners.push(newPartnerId);
    referrerNetwork.totalReferrals++;
  }

  console.log(`📈 Updated referrer network: ${referrerId} now has ${referrerNetwork.totalReferrals} referrals`);
}

/**
 * Получает полную реферальную статистику
 */
export function getReferralStats(userId: string, tradingSystem: TradingSystem) {
  const network = tradingSystem.getPartnerNetwork(userId);
  if (!network) {
    return null;
  }

  const balance = tradingSystem.getUserBalance(userId);
  const transactions = tradingSystem.getUserTransactions(userId);
  
  // Фильтруем только комиссионные транзакции
  const commissionTransactions = transactions.filter(tx => tx.type === 'partner_commission');
  const totalCommissions = commissionTransactions.reduce((sum, tx) => sum + tx.amount, 0);

  return {
    // Базовая информация
    userId,
    referrerId: network.referrerId,
    isPartner: network.totalReferrals > 0 || network.totalEarnings > 0,
    
    // Реферальная сеть
    totalReferrals: network.totalReferrals,
    level1Partners: network.level1Partners,
    totalPartners: network.level1Partners.length,
    
    // Заработок
    totalEarnings: network.totalEarnings,
    totalCommissions,
    commissionTransactions: commissionTransactions.length,
    
    // Реферальная ссылка
    referralLink: generateReferralLink(userId),
    
    // Дополнительная статистика
    currentBalance: balance?.usdBalance || 0,
    totalTransactions: transactions.length
  };
}

/**
 * Получает список всех рефералов пользователя
 */
export function getReferralList(userId: string, tradingSystem: TradingSystem) {
  const network = tradingSystem.getPartnerNetwork(userId);
  if (!network) {
    return [];
  }

  return network.level1Partners.map(partnerId => {
    const partnerBalance = tradingSystem.getUserBalance(partnerId);
    const partnerTransactions = tradingSystem.getUserTransactions(partnerId);
    
    // Находим комиссии от этого партнера
    const commissionsFromPartner = tradingSystem.getUserTransactions(userId)
      .filter(tx => tx.type === 'partner_commission' && tx.referenceId?.includes(partnerId));
    
    const totalCommissions = commissionsFromPartner.reduce((sum, tx) => sum + tx.amount, 0);

    return {
      partnerId,
      registrationDate: partnerBalance?.lastUpdated || new Date(),
      totalPurchases: partnerTransactions.filter(tx => tx.type === 'share_buy').length,
      totalSpent: partnerTransactions
        .filter(tx => tx.type === 'share_buy')
        .reduce((sum, tx) => sum + tx.amount, 0),
      commissionsEarned: totalCommissions,
      isActive: (partnerBalance?.usdBalance || 0) > 0 || (partnerBalance?.shareBalance || 0) > 0
    };
  });
}

/**
 * Проверяет, является ли пользователь активным партнером
 */
export function isActivePartner(userId: string, tradingSystem: TradingSystem): boolean {
  const network = tradingSystem.getPartnerNetwork(userId);
  if (!network) {
    return false;
  }

  // Партнер считается активным, если:
  // 1. Есть рефералы
  // 2. Или есть заработок
  // 3. Или есть активные рефералы
  const hasReferrals = network.totalReferrals > 0;
  const hasEarnings = network.totalEarnings > 0;
  const hasActiveReferrals = network.level1Partners.some(partnerId => {
    const partnerBalance = tradingSystem.getUserBalance(partnerId);
    return partnerBalance && (partnerBalance.usdBalance > 0 || partnerBalance.shareBalance > 0);
  });

  return hasReferrals || hasEarnings || hasActiveReferrals;
} 