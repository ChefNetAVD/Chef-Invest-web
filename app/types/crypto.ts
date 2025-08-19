// Типы для криптовалютных кошельков
export interface CryptoWallet {
  id: string;
  name: string;
  address: string;
  network: string;
  description: string;
  transactionSpeed: 'fast' | 'medium' | 'slow';
  fees: 'low' | 'medium' | 'high';
}

// Типы для криптоплатежей
export interface CryptoPayment {
  walletId: string;
  amount: number;
  currency: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
}

// Константы для криптокошельков
export const CRYPTO_WALLETS: CryptoWallet[] = [
  {
    id: 'usdt-trc20',
    name: 'USDT TRC20',
    address: 'TKYgHUtQyNA4SxwureyVjLUgGJTUHCQh6T',
    network: 'TRC20',
    description: 'Быстрые транзакции, низкие комиссии',
    transactionSpeed: 'fast',
    fees: 'low'
  },
  {
    id: 'usdt-bep20',
    name: 'USDT BEP20',
    address: '0x3a204231a7fc012675c7db25145dbb9da1d6f590',
    network: 'BEP20',
    description: 'Совместимость с Ethereum, умеренные комиссии',
    transactionSpeed: 'medium',
    fees: 'medium'
  }
];

// Типы для валидации адресов
export interface AddressValidation {
  isValid: boolean;
  network: string;
  error?: string;
} 