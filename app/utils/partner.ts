import { 
  PartnerNetwork, 
  PartnerCommission, 
  PARTNER_LEVELS,
  getCommissionRate,
  calculateCommission 
} from '../types/partner';
import { generateTransactionId } from '../types/transactions';

/**
 * Создает новую партнерскую сеть для пользователя
 */
export function createPartnerNetwork(
  userId: string, 
  referrerId: string | null = null
): PartnerNetwork {
  return {
    userId,
    referrerId,
    level1Partners: [],
    level2Partners: [],
    level3Partners: [],
    totalReferrals: 0,
    totalEarnings: 0
  };
}

/**
 * Добавляет партнера в сеть
 */
export function addPartnerToNetwork(
  network: PartnerNetwork,
  newPartnerId: string,
  referrerId: string
): PartnerNetwork {
  const updatedNetwork = { ...network };

  // Если новый партнер приглашен текущим пользователем
  if (referrerId === network.userId) {
    updatedNetwork.level1Partners.push(newPartnerId);
    updatedNetwork.totalReferrals++;
  } else {
    // Находим уровень партнера в сети
    const level = findPartnerLevel(network, referrerId);
    if (level === 1) {
      updatedNetwork.level2Partners.push(newPartnerId);
    } else if (level === 2) {
      updatedNetwork.level3Partners.push(newPartnerId);
    }
  }

  return updatedNetwork;
}

/**
 * Находит уровень партнера в сети
 */
export function findPartnerLevel(
  network: PartnerNetwork, 
  partnerId: string
): 1 | 2 | 3 | null {
  if (network.level1Partners.includes(partnerId)) return 1;
  if (network.level2Partners.includes(partnerId)) return 2;
  if (network.level3Partners.includes(partnerId)) return 3;
  return null;
}

/**
 * Рассчитывает комиссии для всех уровней партнерской сети
 */
export function calculatePartnerCommissions(
  saleAmount: number,
  buyerId: string,
  partnerNetwork: PartnerNetwork
): PartnerCommission[] {
  const commissions: PartnerCommission[] = [];
  const transactionId = generateTransactionId();

  // Комиссия для прямого партнера (уровень 1)
  if (partnerNetwork.referrerId) {
    const level1Commission = createCommission(
      partnerNetwork.referrerId,
      buyerId,
      1,
      saleAmount,
      transactionId
    );
    commissions.push(level1Commission);
  }

  // Комиссия для партнера 2-го уровня
  if (partnerNetwork.referrerId) {
    const level2PartnerId = findReferrerByLevel(partnerNetwork, 2);
    if (level2PartnerId) {
      const level2Commission = createCommission(
        level2PartnerId,
        buyerId,
        2,
        saleAmount,
        transactionId
      );
      commissions.push(level2Commission);
    }
  }

  // Комиссия для партнера 3-го уровня
  if (partnerNetwork.referrerId) {
    const level3PartnerId = findReferrerByLevel(partnerNetwork, 3);
    if (level3PartnerId) {
      const level3Commission = createCommission(
        level3PartnerId,
        buyerId,
        3,
        saleAmount,
        transactionId
      );
      commissions.push(level3Commission);
    }
  }

  return commissions;
}

/**
 * Создает комиссию партнера
 */
function createCommission(
  referrerId: string,
  buyerId: string,
  level: 1 | 2 | 3,
  saleAmount: number,
  transactionId: string
): PartnerCommission {
  const rate = getCommissionRate(level);
  const amount = calculateCommission(saleAmount, level);

  return {
    id: generateTransactionId(),
    userId: referrerId,
    referrerId: buyerId,
    level,
    amount,
    percentage: rate * 100,
    transactionId,
    timestamp: new Date(),
    status: 'pending'
  };
}

/**
 * Находит реферера по уровню (рекурсивно)
 */
function findReferrerByLevel(
  network: PartnerNetwork, 
  targetLevel: number
): string | null {
  // Это упрощенная версия - в реальной системе нужно
  // рекурсивно проходить по всей партнерской сети
  // Здесь возвращаем null для демонстрации
  return null;
}

/**
 * Получает статистику партнерской сети
 */
export function getPartnerStats(network: PartnerNetwork) {
  return {
    totalReferrals: network.totalReferrals,
    level1Partners: network.level1Partners.length,
    level2Partners: network.level2Partners.length,
    level3Partners: network.level3Partners.length,
    totalPartners: network.level1Partners.length + 
                   network.level2Partners.length + 
                   network.level3Partners.length,
    totalEarnings: network.totalEarnings
  };
}

/**
 * Проверяет, является ли пользователь партнером
 */
export function isPartner(network: PartnerNetwork): boolean {
  return network.totalReferrals > 0 || network.totalEarnings > 0;
}

/**
 * Получает уровень партнера
 */
export function getPartnerLevel(network: PartnerNetwork): 1 | 2 | 3 | null {
  if (network.totalReferrals >= 10) return 1;
  if (network.totalReferrals >= 5) return 2;
  if (network.totalReferrals >= 1) return 3;
  return null;
} 