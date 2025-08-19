import { CryptoWallet, CRYPTO_WALLETS, AddressValidation } from '../types/crypto';

/**
 * Получает все доступные криптокошельки
 */
export function getAvailableWallets(): CryptoWallet[] {
  return CRYPTO_WALLETS;
}

/**
 * Получает кошелек по ID
 */
export function getWalletById(walletId: string): CryptoWallet | null {
  return CRYPTO_WALLETS.find(wallet => wallet.id === walletId) || null;
}

/**
 * Копирует адрес в буфер обмена
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Валидирует криптовалютный адрес
 */
export function validateCryptoAddress(address: string, network: string): AddressValidation {
  // Базовая валидация для TRC20 (Tron)
  if (network === 'TRC20') {
    if (!address.startsWith('T') || address.length !== 34) {
      return {
        isValid: false,
        network: 'TRC20',
        error: 'Неверный формат TRC20 адреса'
      };
    }
  }

  // Базовая валидация для BEP20 (Binance Smart Chain)
  if (network === 'BEP20') {
    if (!address.startsWith('0x') || address.length !== 42) {
      return {
        isValid: false,
        network: 'BEP20',
        error: 'Неверный формат BEP20 адреса'
      };
    }
  }

  return {
    isValid: true,
    network
  };
}

/**
 * Форматирует адрес для отображения
 */
export function formatAddress(address: string, network: string): string {
  if (network === 'TRC20') {
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  }
  
  if (network === 'BEP20') {
    return `${address.slice(0, 10)}...${address.slice(-8)}`;
  }

  return address;
}

/**
 * Получает информацию о сети по адресу
 */
export function getNetworkByAddress(address: string): string | null {
  if (address.startsWith('T') && address.length === 34) {
    return 'TRC20';
  }
  
  if (address.startsWith('0x') && address.length === 42) {
    return 'BEP20';
  }

  return null;
}

/**
 * Рассчитывает комиссию за транзакцию
 */
export function calculateTransactionFee(network: string, amount: number): number {
  const fees = {
    'TRC20': 1, // 1 USDT
    'BEP20': 0.5 // 0.5 USDT
  };

  return fees[network as keyof typeof fees] || 0;
}

/**
 * Проверяет статус транзакции
 */
export function checkTransactionStatus(txHash: string): Promise<'pending' | 'completed' | 'failed'> {
  // Здесь будет логика проверки статуса транзакции
  // Пока возвращаем заглушку
  return Promise.resolve('pending');
} 