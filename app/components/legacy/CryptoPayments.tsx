'use client';

import { useState } from 'react';
import { Copy, Check, ExternalLink, Shield, AlertTriangle } from 'lucide-react';

export default function CryptoPayments() {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const cryptoWallets = [
    {
      name: 'USDT TRC20',
      address: 'TKYgHUtQyNA4SxwureyVjLUgGJTUHCQh6T',
      network: 'TRC20',
      icon: '₮',
      description: 'Быстрые транзакции, низкие комиссии'
    },
    {
      name: 'USDT BEP20',
      address: '0x3a204231a7fc012675c7db25145dbb9da1d6f590',
      network: 'BEP20',
      icon: '₿',
      description: 'Совместимость с Ethereum, умеренные комиссии'
    }
  ];

  const copyToClipboard = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Принимаем платежи в криптовалюте
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Вы можете инвестировать, используя следующие криптовалютные кошельки.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {cryptoWallets.map((wallet) => (
            <div key={wallet.name} className="bg-white p-8 rounded-2xl shadow-lg border border-orange-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl font-bold text-orange-600">{wallet.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{wallet.name}</h3>
                    <p className="text-sm text-gray-500">Сеть {wallet.network}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Адрес кошелька:
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gradient-to-r from-gray-50 to-orange-50 p-3 rounded-lg border border-orange-200">
                    <code className="text-sm text-gray-800 break-all font-mono">
                      {wallet.address}
                    </code>
                  </div>
                  <button
                    onClick={() => copyToClipboard(wallet.address)}
                    className="p-3 chef-orange-bg text-white rounded-lg hover:bg-orange-600 transition-colors shadow-md"
                    title="Копировать адрес"
                  >
                    {copiedAddress === wallet.address ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button className="w-full chef-orange-bg text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center shadow-md">
                Купить Долю
                <ExternalLink className="ml-2 h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 p-8 rounded-2xl text-center">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-yellow-600 mr-3" />
            <h3 className="text-2xl font-bold text-yellow-800">
              ⚠️ Важная информация
            </h3>
          </div>
          <p className="text-yellow-700 mb-6 text-lg">
            Убедитесь, что вы используете правильную сеть при отправке средств. 
            Отправка в неправильной сети может привести к потере средств.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-yellow-200">
              <div className="flex items-center mb-3">
                <Shield className="h-6 w-6 text-green-600 mr-2" />
                <h4 className="font-semibold text-gray-900">TRC20 (Tron)</h4>
              </div>
              <p className="text-gray-600 text-sm">Быстрые транзакции, низкие комиссии</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-yellow-200">
              <div className="flex items-center mb-3">
                <Shield className="h-6 w-6 text-blue-600 mr-2" />
                <h4 className="font-semibold text-gray-900">BEP20 (Binance Smart Chain)</h4>
              </div>
              <p className="text-gray-600 text-sm">Совместимость с Ethereum, умеренные комиссии</p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 p-6 rounded-2xl text-center">
          <h4 className="text-lg font-semibold text-blue-800 mb-2">
            🔒 Безопасность превыше всего
          </h4>
          <p className="text-blue-700">
            Все транзакции защищены передовыми протоколами безопасности. 
            Мы используем многоуровневую защиту для ваших инвестиций.
          </p>
        </div>
      </div>
    </section>
  );
} 