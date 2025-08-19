'use client';

import { useState } from 'react';
import { TrendingUp, DollarSign, Percent, Users, Calculator, Target, Zap } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

export default function InvestmentCalculator() {
  const [selectedRound, setSelectedRound] = useState('pre-seed');
  const [investmentAmount, setInvestmentAmount] = useState(1000);
  const [referralAmount, setReferralAmount] = useState(10000);

  const rounds = {
    'pre-seed': { 
      min: 1000, 
      max: 10000, 
      multiplier: 35, 
      risk: 'Высокий', 
      color: 'from-orange-500 to-red-500', 
      bgColor: 'from-orange-50 to-red-50',
      borderColor: 'border-orange-200',
      icon: '🍳',
      description: 'Старт идеи - высокий риск, высокая доходность'
    },
    'seed': { 
      min: 5000, 
      max: 50000, 
      multiplier: 15, 
      risk: 'Средний', 
      color: 'from-green-500 to-emerald-500', 
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200',
      icon: '🌱',
      description: 'Первые шаги - проверенная команда'
    },
    'private': { 
      min: 10000, 
      max: 100000, 
      multiplier: 8, 
      risk: 'Умеренный', 
      color: 'from-blue-500 to-cyan-500', 
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      icon: '🚀',
      description: 'Масштабирование - стабильный рост'
    },
    'public': { 
      min: 5000, 
      max: 50000, 
      multiplier: 3, 
      risk: 'Низкий', 
      color: 'from-purple-500 to-violet-500', 
      bgColor: 'from-purple-50 to-violet-50',
      borderColor: 'border-purple-200',
      icon: '🏆',
      description: 'Зрелость - доказанная модель'
    }
  };

  const currentRound = rounds[selectedRound as keyof typeof rounds];
  const potentialReturn = investmentAmount * currentRound.multiplier;
  const referralBonus = referralAmount * 0.05;
  const totalIncome = potentialReturn + referralBonus;

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-orange-50 relative overflow-hidden" id="calculator">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse-glow">
              <Calculator className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 premium-heading">
            <span className="gradient-heading">Калькулятор доходности</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto premium-text">
            Рассчитайте потенциальный доход от ваших инвестиций в foodtech-проекты
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Calculator Form */}
          <div className="bg-white p-8 rounded-2xl premium-shadow premium-hover">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 premium-heading">
              Параметры инвестиции
            </h3>

            {/* Investment Round Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4 premium-text">
                Выберите раунд инвестиции:
              </label>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(rounds).map(([key, round]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedRound(key)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 premium-hover ${
                      selectedRound === key
                        ? `bg-gradient-to-br ${round.bgColor} ${round.borderColor} border-orange-500`
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{round.icon}</span>
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 premium-text capitalize">
                          {key.replace('-', ' ')}
                        </div>
                        <div className="text-sm text-gray-500 premium-text">
                          {round.risk} риск
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Investment Amount */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4 premium-text">
                Сумма инвестиции: ${investmentAmount.toLocaleString()}
              </label>
              <input
                type="range"
                min={currentRound.min}
                max={currentRound.max}
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                className="slider w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2 premium-text">
                <span>${currentRound.min.toLocaleString()}</span>
                <span>${currentRound.max.toLocaleString()}</span>
              </div>
            </div>

            {/* Referral Amount */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-4 premium-text">
                Реферальные инвестиции: ${referralAmount.toLocaleString()}
              </label>
              <input
                type="range"
                min={0}
                max={100000}
                value={referralAmount}
                onChange={(e) => setReferralAmount(Number(e.target.value))}
                className="slider w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2 premium-text">
                <span>$0</span>
                <span>$100,000</span>
              </div>
            </div>

            {/* Round Info */}
            <div className={`p-4 rounded-xl bg-gradient-to-br ${currentRound.bgColor} border ${currentRound.borderColor}`}>
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">{currentRound.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-900 premium-text capitalize">
                    {selectedRound.replace('-', ' ')}
                  </h4>
                  <p className="text-sm text-gray-600 premium-text">
                    {currentRound.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl premium-shadow premium-hover animated-border">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse-glow">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 premium-heading">
                  Потенциальный доход
                </h3>
                <div className="text-4xl md:text-5xl font-bold chef-orange mb-2">
                  <AnimatedCounter 
                    value={totalIncome} 
                    prefix="$" 
                    className="gradient-heading"
                    duration={3000}
                  />
                </div>
                <p className="text-gray-600 premium-text">
                  За весь период инвестиции
                </p>
              </div>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Investment Return */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl premium-shadow premium-hover">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 premium-text">Инвестиционный доход</h4>
                    <p className="text-sm text-gray-500 premium-text">{currentRound.multiplier}x доходность</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  <AnimatedCounter 
                    value={potentialReturn} 
                    prefix="$" 
                    className="animate-pulse"
                    duration={2000}
                  />
                </div>
              </div>

              {/* Referral Bonus */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl premium-shadow premium-hover">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 premium-text">Реферальный бонус</h4>
                    <p className="text-sm text-gray-500 premium-text">5% от рефералов</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  <AnimatedCounter 
                    value={referralBonus} 
                    prefix="$" 
                    className="animate-pulse"
                    duration={2000}
                  />
                </div>
              </div>
            </div>

            {/* Risk Level */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl premium-shadow premium-hover">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 premium-text">Уровень риска</h4>
                  <p className="text-sm text-gray-500 premium-text">
                    {currentRound.risk} - {currentRound.description}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button className="w-full chef-orange-bg text-white py-4 px-8 rounded-xl hover:bg-orange-600 transition-all duration-300 premium-hover flex items-center justify-center space-x-2 shadow-2xl hover:shadow-orange-500/25">
              <DollarSign className="h-5 w-5" />
              <span className="premium-text">Инвестировать сейчас</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
} 