import { useState, useCallback, useMemo } from 'react';
import { 
  getAvailableWallets, 
  copyToClipboard, 
  validateCryptoAddress,
  formatAddress,
  calculateTransactionFee 
} from '../utils/crypto';
import { CryptoWallet } from '../types/crypto';

export function useCryptoPayments() {
  // Состояние
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [customAddress, setCustomAddress] = useState('');
  const [addressValidation, setAddressValidation] = useState<{
    isValid: boolean;
    error?: string;
  } | null>(null);

  // Доступные кошельки
  const availableWallets = useMemo(() => getAvailableWallets(), []);

  // Текущий выбранный кошелек
  const currentWallet = useMemo(() => {
    if (selectedWallet) {
      return availableWallets.find(wallet => wallet.id === selectedWallet) || null;
    }
    return null;
  }, [selectedWallet, availableWallets]);

  // Копирование адреса
  const handleCopyAddress = useCallback(async (address: string) => {
    const success = await copyToClipboard(address);
    if (success) {
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
    }
    return success;
  }, []);

  // Выбор кошелька
  const handleWalletSelect = useCallback((walletId: string) => {
    setSelectedWallet(walletId);
    setCustomAddress('');
    setAddressValidation(null);
  }, []);

  // Валидация кастомного адреса
  const validateCustomAddress = useCallback((address: string) => {
    if (!address.trim()) {
      setAddressValidation({ isValid: false, error: 'Адрес не может быть пустым' });
      return false;
    }

    const network = getNetworkByAddress(address);
    if (!network) {
      setAddressValidation({ isValid: false, error: 'Неверный формат адреса' });
      return false;
    }

    const validation = validateCryptoAddress(address, network);
    setAddressValidation({
      isValid: validation.isValid,
      error: validation.error
    });

    return validation.isValid;
  }, []);

  // Обработка изменения кастомного адреса
  const handleCustomAddressChange = useCallback((address: string) => {
    setCustomAddress(address);
    if (address.trim()) {
      validateCustomAddress(address);
    } else {
      setAddressValidation(null);
    }
  }, [validateCustomAddress]);

  // Получение адреса для отображения
  const getDisplayAddress = useCallback(() => {
    if (customAddress && addressValidation?.isValid) {
      return customAddress;
    }
    return currentWallet?.address || '';
  }, [customAddress, addressValidation, currentWallet]);

  // Получение сети для отображения
  const getDisplayNetwork = useCallback(() => {
    if (customAddress && addressValidation?.isValid) {
      return getNetworkByAddress(customAddress) || '';
    }
    return currentWallet?.network || '';
  }, [customAddress, addressValidation, currentWallet]);

  // Расчет комиссии
  const getTransactionFee = useCallback((amount: number) => {
    const network = getDisplayNetwork();
    return calculateTransactionFee(network, amount);
  }, [getDisplayNetwork]);

  // Проверка, можно ли использовать адрес
  const canUseAddress = useCallback(() => {
    if (customAddress) {
      return addressValidation?.isValid || false;
    }
    return !!currentWallet;
  }, [customAddress, addressValidation, currentWallet]);

  // Получение информации о кошельке для отображения
  const getWalletInfo = useCallback(() => {
    if (customAddress && addressValidation?.isValid) {
      const network = getNetworkByAddress(customAddress);
      return {
        name: `Custom ${network}`,
        network,
        description: 'Пользовательский адрес',
        transactionSpeed: 'medium' as const,
        fees: 'medium' as const
      };
    }
    return currentWallet;
  }, [customAddress, addressValidation, currentWallet]);

  return {
    // Состояние
    copiedAddress,
    selectedWallet,
    customAddress,
    addressValidation,
    
    // Данные
    availableWallets,
    currentWallet,
    
    // Вычисляемые значения
    displayAddress: getDisplayAddress(),
    displayNetwork: getDisplayNetwork(),
    walletInfo: getWalletInfo(),
    
    // Обработчики
    handleCopyAddress,
    handleWalletSelect,
    handleCustomAddressChange,
    validateCustomAddress,
    getTransactionFee,
    canUseAddress
  };
}

// Вспомогательная функция для определения сети по адресу
function getNetworkByAddress(address: string): string | null {
  if (address.startsWith('T') && address.length === 34) {
    return 'TRC20';
  }
  
  if (address.startsWith('0x') && address.length === 42) {
    return 'BEP20';
  }

  return null;
} 