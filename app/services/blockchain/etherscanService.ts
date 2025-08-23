import { BlockchainConfig } from '../../config/blockchain';
import { BlockchainTransaction, PaymentValidationResult, EtherscanResponse } from '../../types/usdtPayment';

export class EtherscanService {
  private config: BlockchainConfig;

  constructor(config: BlockchainConfig) {
    this.config = config;
  }

  /**
   * Получает баланс USDT на адресе
   */
  async getUSDTBalance(address: string): Promise<number> {
    try {
      const url = `${this.config.baseUrl}?module=account&action=tokenbalance&contractaddress=${this.config.contractAddress}&address=${address}&tag=latest&apikey=${this.config.apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: EtherscanResponse = await response.json();
      
      if (data.status !== '1') {
        throw new Error(data.message || 'Failed to fetch balance');
      }

      // Конвертируем из smallest unit в USDT
      return parseInt(data.result) / Math.pow(10, this.config.decimals);
    } catch (error) {
      console.error('Error fetching Etherscan USDT balance:', error);
      throw error;
    }
  }

  /**
   * Получает транзакции USDT для адреса
   */
  async getUSDTTokenTransfers(address: string, limit: number = 50): Promise<BlockchainTransaction[]> {
    try {
      const url = `${this.config.baseUrl}?module=account&action=tokentx&contractaddress=${this.config.contractAddress}&address=${address}&page=1&offset=${limit}&sort=desc&apikey=${this.config.apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: EtherscanResponse = await response.json();
      
      if (data.status !== '1') {
        throw new Error(data.message || 'Failed to fetch transactions');
      }

      return (data.result || []).map((tx: any) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        confirmations: parseInt(tx.confirmations) || 0,
        blockNumber: parseInt(tx.blockNumber),
        timestamp: parseInt(tx.timeStamp) * 1000, // Конвертируем в миллисекунды
        status: tx.isError === '0' ? 'success' : 'failed',
        gasUsed: tx.gasUsed,
        gasPrice: tx.gasPrice
      }));
    } catch (error) {
      console.error('Error fetching Etherscan USDT transactions:', error);
      throw error;
    }
  }

  /**
   * Получает информацию о конкретной транзакции
   */
  async getTransactionInfo(txHash: string): Promise<BlockchainTransaction | null> {
    try {
      const url = `${this.config.baseUrl}?module=proxy&action=eth_getTransactionByHash&txhash=${txHash}&apikey=${this.config.apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: EtherscanResponse = await response.json();
      
      if (data.status !== '1' || !data.result) {
        return null;
      }

      const tx = data.result;
      
      // Проверяем, что это USDT транзакция
      if (tx.to?.toLowerCase() !== this.config.contractAddress?.toLowerCase()) {
        return null;
      }

      // Получаем дополнительную информацию о транзакции
      const receiptUrl = `${this.config.baseUrl}?module=proxy&action=eth_getTransactionReceipt&txhash=${txHash}&apikey=${this.config.apiKey}`;
      const receiptResponse = await fetch(receiptUrl);
      const receiptData: EtherscanResponse = await receiptResponse.json();

      const isSuccess = receiptData.result?.status === '0x1';

      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: tx.value,
        confirmations: 0, // Будет рассчитано отдельно
        blockNumber: parseInt(tx.blockNumber, 16),
        timestamp: 0, // Будет получено отдельно
        status: isSuccess ? 'success' : 'failed',
        gasUsed: receiptData.result?.gasUsed,
        gasPrice: tx.gasPrice
      };
    } catch (error) {
      console.error('Error fetching Etherscan transaction:', error);
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

      // Получаем количество подтверждений
      const currentBlock = await this.getCurrentBlockNumber();
      const confirmations = currentBlock - transaction.blockNumber + 1;

      // Конвертируем сумму (для ERC-20 это обычно в hex формате)
      const amount = parseInt(transaction.value, 16) / Math.pow(10, this.config.decimals);
      
      // Проверяем сумму (допускаем небольшую погрешность)
      const tolerance = 0.01; // 1 цент
      if (Math.abs(amount - expectedAmount) > tolerance) {
        return {
          isValid: false,
          error: `Amount mismatch. Expected: ${expectedAmount}, Got: ${amount}`
        };
      }

      // Проверяем подтверждения
      if (confirmations < this.config.minConfirmations) {
        return {
          isValid: false,
          error: `Insufficient confirmations. Required: ${this.config.minConfirmations}, Got: ${confirmations}`,
          transaction: { ...transaction, confirmations },
          amount,
          confirmations
        };
      }

      return {
        isValid: true,
        transaction: { ...transaction, confirmations },
        amount,
        confirmations
      };
    } catch (error) {
      console.error('Error validating Etherscan payment:', error);
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
      const url = `${this.config.baseUrl}?module=proxy&action=eth_blockNumber&apikey=${this.config.apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: EtherscanResponse = await response.json();
      
      if (data.status !== '1') {
        throw new Error(data.message || 'Failed to fetch latest block');
      }

      return parseInt(data.result, 16);
    } catch (error) {
      console.error('Error fetching current block number:', error);
      throw error;
    }
  }
} 