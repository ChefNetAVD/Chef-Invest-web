// Типы для USDT платежной системы

export type NetworkType = 'TRC20' | 'BEP20' | 'ERC20';

export type PaymentStatus = 
  | 'pending'      // Ожидает оплаты
  | 'processing'   // Обрабатывается
  | 'confirmed'    // Подтверждена
  | 'completed'    // Завершена
  | 'failed'       // Ошибка
  | 'expired'      // Истекла
  | 'cancelled';   // Отменена

export interface USDTPaymentRequest {
  id: string;
  userId: string;
  amount: number;
  network: NetworkType;
  walletAddress: string;
  expectedAmount: number;
  status: PaymentStatus;
  createdAt: Date;
  expiresAt: Date;
  completedAt?: Date;
  transactionHash?: string;
  confirmations?: number;
  requiredConfirmations: number;
  metadata?: Record<string, any>;
}

export interface BlockchainTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  confirmations: number;
  blockNumber: number;
  timestamp: number;
  status: 'success' | 'failed' | 'pending';
  gasUsed?: string;
  gasPrice?: string;
}

export interface PaymentValidationResult {
  isValid: boolean;
  error?: string;
  transaction?: BlockchainTransaction;
  amount?: number;
  confirmations?: number;
}

export interface NetworkBalance {
  network: NetworkType;
  balance: number;
  lastUpdated: Date;
  pendingAmount: number;
}

export interface PaymentStats {
  totalPayments: number;
  totalAmount: number;
  successRate: number;
  averageAmount: number;
  byNetwork: Record<NetworkType, {
    count: number;
    amount: number;
    successRate: number;
  }>;
}

// API ответы от блокчейн сканеров
export interface TronScanResponse {
  success: boolean;
  data?: any[];
  error?: string;
}

export interface EtherscanResponse {
  status: string;
  message: string;
  result: any;
}

export interface BscScanResponse {
  status: string;
  message: string;
  result: any;
} 