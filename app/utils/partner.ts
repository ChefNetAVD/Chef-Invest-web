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
  }

  return updatedNetwork;
}

/**
 * Находит уровень партнера в сети
 */
export function findPartnerLevel(
  network: PartnerNetwork, 
  partnerId: string
): 1 | null {
  if (network.level1Partners.includes(partnerId)) return 1;
  return null;
}

/**
 * Рассчитывает комиссии для прямых продаж (уровень 1)
 */
export function calculatePartnerCommissions(
  saleAmount: number,
  buyerId: string,
  partnerNetwork: PartnerNetwork
): PartnerCommission[] {
  const commissions: PartnerCommission[] = [];
  const transactionId = generateTransactionId();

  // Комиссия только для прямого партнера (уровень 1)
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

  return commissions;
}

/**
 * Создает комиссию партнера
 */
function createCommission(
  referrerId: string,
  buyerId: string,
  level: 1,
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
 * Получает статистику партнерской сети
 */
export function getPartnerStats(network: PartnerNetwork) {
  return {
    totalReferrals: network.totalReferrals,
    level1Partners: network.level1Partners.length,
    totalPartners: network.level1Partners.length,
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
export function getPartnerLevel(network: PartnerNetwork): 1 | null {
  if (network.totalReferrals >= 1) return 1;
  return null;
} 