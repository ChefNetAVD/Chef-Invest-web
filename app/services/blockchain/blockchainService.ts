import { BLOCKCHAIN_CONFIG, BlockchainConfig } from '../../config/blockchain';
import { NetworkType, BlockchainTransaction, PaymentValidationResult, NetworkBalance } from '../../types/usdtPayment';
import { TronService } from './tronService';
import { EtherscanService } from './etherscanService';
import { BscScanService } from './bscScanService';

export class BlockchainService {
  private services: Map<NetworkType, TronService | EtherscanService | BscScanService>;

  constructor() {
    this.services = new Map();
    this.initializeServices();
  }

  private initializeServices() {
    // Инициализируем сервисы для каждой сети
    const trc20Config = BLOCKCHAIN_CONFIG.TRC20;
    const bscConfig = BLOCKCHAIN_CONFIG.BEP20;
    const ethConfig = BLOCKCHAIN_CONFIG.ERC20;

    this.services.set('TRC20', new TronService(trc20Config));
    this.services.set('BEP20', new BscScanService(bscConfig));
    this.services.set('ERC20', new EtherscanService(ethConfig));
  }

  /**
   * Получает сервис для конкретной сети
   */
  private getService(network: NetworkType): TronService | EtherscanService | BscScanService {
    const service = this.services.get(network);
    if (!service) {
      throw new Error(`Service not found for network: ${network}`);
    }
    return service;
  }

  /**
   * Получает баланс USDT на адресе для конкретной сети
   */
  async getUSDTBalance(address: string, network: NetworkType): Promise<number> {
    const service = this.getService(network);
    
    if (network === 'TRC20') {
      return (service as TronService).getUSDTBalance(address);
    } else if (network === 'BEP20') {
      return (service as BscScanService).getUSDTBalance(address);
    } else if (network === 'ERC20') {
      return (service as EtherscanService).getUSDTBalance(address);
    }
    
    throw new Error(`Unsupported network: ${network}`);
  }

  /**
   * Получает баланс USDT на всех адресах
   */
  async getAllNetworkBalances(): Promise<NetworkBalance[]> {
    const balances: NetworkBalance[] = [];
    
    for (const [network, config] of Object.entries(BLOCKCHAIN_CONFIG)) {
      try {
        const balance = await this.getUSDTBalance(config.walletAddress, network as NetworkType);
        balances.push({
          network: network as NetworkType,
          balance,
          lastUpdated: new Date(),
          pendingAmount: 0 // Будет рассчитано отдельно
        });
      } catch (error) {
        console.error(`Error fetching balance for ${network}:`, error);
        balances.push({
          network: network as NetworkType,
          balance: 0,
          lastUpdated: new Date(),
          pendingAmount: 0
        });
      }
    }
    
    return balances;
  }

  /**
   * Получает транзакции USDT для адреса
   */
  async getUSDTTokenTransfers(address: string, network: NetworkType, limit: number = 50): Promise<BlockchainTransaction[]> {
    const service = this.getService(network);
    
    if (network === 'TRC20') {
      return (service as TronService).getUSDTTokenTransfers(address, limit);
    } else if (network === 'BEP20') {
      return (service as BscScanService).getUSDTTokenTransfers(address, limit);
    } else if (network === 'ERC20') {
      return (service as EtherscanService).getUSDTTokenTransfers(address, limit);
    }
    
    throw new Error(`Unsupported network: ${network}`);
  }

  /**
   * Получает информацию о транзакции
   */
  async getTransactionInfo(txHash: string, network: NetworkType): Promise<BlockchainTransaction | null> {
    const service = this.getService(network);
    
    if (network === 'TRC20') {
      return (service as TronService).getTransactionInfo(txHash);
    } else if (network === 'BEP20') {
      return (service as BscScanService).getTransactionInfo(txHash);
    } else if (network === 'ERC20') {
      return (service as EtherscanService).getTransactionInfo(txHash);
    }
    
    throw new Error(`Unsupported network: ${network}`);
  }

  /**
   * Проверяет валидность платежа
   */
  async validatePayment(
    txHash: string, 
    expectedAmount: number, 
    expectedTo: string,
    network: NetworkType
  ): Promise<PaymentValidationResult> {
    const service = this.getService(network);
    
    if (network === 'TRC20') {
      return (service as TronService).validatePayment(txHash, expectedAmount, expectedTo);
    } else if (network === 'BEP20') {
      return (service as BscScanService).validatePayment(txHash, expectedAmount, expectedTo);
    } else if (network === 'ERC20') {
      return (service as EtherscanService).validatePayment(txHash, expectedAmount, expectedTo);
    }
    
    throw new Error(`Unsupported network: ${network}`);
  }

  /**
   * Получает текущий номер блока для сети
   */
  async getCurrentBlockNumber(network: NetworkType): Promise<number> {
    const service = this.getService(network);
    
    if (network === 'TRC20') {
      return (service as TronService).getCurrentBlockNumber();
    } else if (network === 'BEP20') {
      return (service as BscScanService).getCurrentBlockNumber();
    } else if (network === 'ERC20') {
      return (service as EtherscanService).getCurrentBlockNumber();
    }
    
    throw new Error(`Unsupported network: ${network}`);
  }

  /**
   * Получает конфигурацию сети
   */
  getNetworkConfig(network: NetworkType): BlockchainConfig {
    const config = BLOCKCHAIN_CONFIG[network];
    if (!config) {
      throw new Error(`Configuration not found for network: ${network}`);
    }
    return config;
  }

  /**
   * Получает адрес кошелька для сети
   */
  getWalletAddress(network: NetworkType): string {
    return this.getNetworkConfig(network).walletAddress;
  }

  /**
   * Получает минимальное количество подтверждений для сети
   */
  getMinConfirmations(network: NetworkType): number {
    return this.getNetworkConfig(network).minConfirmations;
  }

  /**
   * Проверяет, поддерживается ли сеть
   */
  isNetworkSupported(network: string): network is NetworkType {
    return Object.keys(BLOCKCHAIN_CONFIG).includes(network);
  }

  /**
   * Получает список поддерживаемых сетей
   */
  getSupportedNetworks(): NetworkType[] {
    return Object.keys(BLOCKCHAIN_CONFIG) as NetworkType[];
  }
} 