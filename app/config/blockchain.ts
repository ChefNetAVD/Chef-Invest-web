// Конфигурация блокчейн API
export interface BlockchainConfig {
  name: string;
  network: 'TRC20' | 'BEP20' | 'ERC20';
  apiKey: string;
  baseUrl: string;
  contractAddress?: string; // USDT контракт
  walletAddress: string;
  minConfirmations: number;
  decimals: number;
  symbol: string;
}

export const BLOCKCHAIN_CONFIG: Record<string, BlockchainConfig> = {
  TRC20: {
    name: 'Tron (TRC20)',
    network: 'TRC20',
    apiKey: 'dcdfd38e-7da3-433d-81d0-e0446116a61f',
    baseUrl: 'https://api.trongrid.io',
    walletAddress: 'TKYgHUtQyNA4SxwureyVjLUgGJTUHCQh6T',
    minConfirmations: 12,
    decimals: 6,
    symbol: 'USDT'
  },
  BEP20: {
    name: 'Binance Smart Chain (BEP20)',
    network: 'BEP20',
    apiKey: 'XI96Y999CWTD3726U55SG4IMM1XMSZFBVS',
    baseUrl: 'https://api.bscscan.com/api',
    contractAddress: '0x55d398326f99059fF775485246999027B3197955', // USDT на BSC
    walletAddress: '0x3a204231a7fc012675c7db25145dbb9da1d6f590',
    minConfirmations: 15,
    decimals: 18,
    symbol: 'USDT'
  },
  ERC20: {
    name: 'Ethereum (ERC20)',
    network: 'ERC20',
    apiKey: 'XI96Y999CWTD3726U55SG4IMM1XMSZFBVS',
    baseUrl: 'https://api.etherscan.io/api',
    contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT на Ethereum
    walletAddress: '0x3a204231a7fc012675c7db25145dbb9da1d6f590', // Временно тот же адрес
    minConfirmations: 12,
    decimals: 6,
    symbol: 'USDT'
  }
};

// Константы для платежей
export const PAYMENT_CONSTANTS = {
  MIN_AMOUNT: 10, // Минимальная сумма в USDT
  MAX_AMOUNT: 100000, // Максимальная сумма в USDT
  TIMEOUT: 30 * 60 * 1000, // 30 минут на оплату
  CHECK_INTERVAL: 30 * 1000, // Проверка каждые 30 секунд
  MAX_RETRIES: 3 // Максимальное количество попыток
}; 