import { BlockchainConfig } from '../../config/blockchain';
import { BlockchainTransaction, PaymentValidationResult, TronScanResponse } from '../../types/usdtPayment';

export class TronService {
  private config: BlockchainConfig;

  constructor(config: BlockchainConfig) {
    this.config = config;
  }

  /**
   * Получает баланс USDT на адресе
   */
  async getUSDTBalance(address: string): Promise<number> {
    try {
      const response = await fetch(`${this.config.baseUrl}/v1/accounts/${address}/tokens`, {
        headers: {
          'TRON-PRO-API-KEY': this.config.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TronScanResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch balance');
      }

      // Ищем USDT токен (контракт TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t)
      const usdtToken = data.data?.find((token: any) => 
        token.contract_address === 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
      );

      if (!usdtToken) {
        return 0;
      }

      // Конвертируем из smallest unit в USDT
      return parseFloat(usdtToken.balance) / Math.pow(10, this.config.decimals);
    } catch (error) {
      console.error('Error fetching Tron USDT balance:', error);
      throw error;
    }
  }

  /**
   * Получает транзакции USDT для адреса
   */
  async getUSDTTokenTransfers(address: string, limit: number = 50): Promise<BlockchainTransaction[]> {
    try {
      const response = await fetch(
        `${this.config.baseUrl}/v1/accounts/${address}/transactions/trc20?limit=${limit}&contract_address=TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t`,
        {
          headers: {
            'TRON-PRO-API-KEY': this.config.apiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TronScanResponse = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch transactions');
      }

      return (data.data || []).map((tx: any) => ({
        hash: tx.transaction_id,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        confirmations: tx.confirmations || 0,
        blockNumber: tx.block,
        timestamp: tx.block_timestamp,
        status: tx.status === 1 ? 'success' : 'failed'
      }));
    } catch (error) {
      console.error('Error fetching Tron USDT transactions:', error);
      throw error;
    }
  }

  /**
   * Получает информацию о конкретной транзакции
   */
  async getTransactionInfo(txHash: string): Promise<BlockchainTransaction | null> {
    try {
      const response = await fetch(`${this.config.baseUrl}/v1/transactions/${txHash}`, {
        headers: {
          'TRON-PRO-API-KEY': this.config.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TronScanResponse = await response.json();
      
      if (!data.success || !data.data) {
        return null;
      }

      const tx = data.data as any;
      
      // Проверяем, что это USDT транзакция
      if (tx?.contract_address !== 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t') {
        return null;
      }

      return {
        hash: tx.transaction_id,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        confirmations: tx.confirmations || 0,
        blockNumber: tx.block,
        timestamp: tx.block_timestamp,
        status: tx.status === 1 ? 'success' : 'failed'
      };
    } catch (error) {
      console.error('Error fetching Tron transaction:', error);
      return null;
    }
  }

  /**
   * Проверяет, является ли транзакция валидным платежом
   */
  async validatePayment(
    txHash: string, 
    expectedAmount: number, 
    expectedTo: string
  ): Promise<PaymentValidationResult> {
    try {
      const transaction = await this.getTransactionInfo(txHash);
      
      if (!transaction) {
        return {
          isValid: false,
          error: 'Transaction not found'
        };
      }

      // Проверяем получателя
      if (transaction.to.toLowerCase() !== expectedTo.toLowerCase()) {
        return {
          isValid: false,
          error: 'Invalid recipient address'
        };
      }

      // Проверяем статус
      if (transaction.status !== 'success') {
        return {
          isValid: false,
          error: 'Transaction failed'
        };
      }

      // Конвертируем сумму
      const amount = parseFloat(transaction.value) / Math.pow(10, this.config.decimals);
      
      // Проверяем сумму (допускаем небольшую погрешность)
      const tolerance = 0.01; // 1 цент
      if (Math.abs(amount - expectedAmount) > tolerance) {
        return {
          isValid: false,
          error: `Amount mismatch. Expected: ${expectedAmount}, Got: ${amount}`
        };
      }

      // Проверяем подтверждения
      if (transaction.confirmations < this.config.minConfirmations) {
        return {
          isValid: false,
          error: `Insufficient confirmations. Required: ${this.config.minConfirmations}, Got: ${transaction.confirmations}`,
          transaction,
          amount,
          confirmations: transaction.confirmations
        };
      }

      return {
        isValid: true,
        transaction,
        amount,
        confirmations: transaction.confirmations
      };
    } catch (error) {
      console.error('Error validating Tron payment:', error);
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Validation failed'
      };
    }
  }

  /**
   * Получает текущий номер блока
   */
  async getCurrentBlockNumber(): Promise<number> {
    try {
      const response = await fetch(`${this.config.baseUrl}/v1/blocks/latest`, {
        headers: {
          'TRON-PRO-API-KEY': this.config.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TronScanResponse = await response.json();
      
      if (!data.success || !data.data) {
        throw new Error('Failed to fetch latest block');
      }

      return (data.data as any)?.block_header?.raw_data?.number || 0;
    } catch (error) {
      console.error('Error fetching current block number:', error);
      throw error;
    }
  }
} 