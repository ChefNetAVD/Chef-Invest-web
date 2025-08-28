"use client";

import React, { useState } from 'react';

import { StarRating } from '../ui/StarRating';
import { Tabs } from '../ui/Tabs';
import { Checkbox } from '../ui/Checkbox';
import { RadioButton } from '../ui/RadioButton';
import { StatusBar } from '../ui/StatusBar';
import { ArrowIcon } from '../ui/ArrowIcon';

export const DesignSystemDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [checkboxState, setCheckboxState] = useState(false);
  const [radioState, setRadioState] = useState('option1');

  return (
    <section className="py-16 bg-gray-50">
      <div className="container">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          Дизайн-система - Демо компонентов
        </h2>

        {/* Arrow Icons */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Иконки стрелок</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Triangle Arrows */}
            <div className="bg-white p-6 rounded-lg shadow-gray-1">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Triangle Arrows</h4>
              <div className="flex flex-wrap gap-4">
                <ArrowIcon direction="up" variant="triangle" className="text-gray-800" />
                <ArrowIcon direction="down" variant="triangle" className="text-gray-800" />
                <ArrowIcon direction="left" variant="triangle" className="text-gray-800" />
                <ArrowIcon direction="right" variant="triangle" className="text-gray-800" />
              </div>
            </div>

            {/* Line Arrows */}
            <div className="bg-white p-6 rounded-lg shadow-gray-1">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Line Arrows</h4>
              <div className="flex flex-wrap gap-4">
                <ArrowIcon direction="up" variant="line" className="text-gray-800" />
                <ArrowIcon direction="down" variant="line" className="text-gray-800" />
                <ArrowIcon direction="left" variant="line" className="text-gray-800" />
                <ArrowIcon direction="right" variant="line" className="text-gray-800" />
              </div>
            </div>

            {/* Thick Line Arrows */}
            <div className="bg-white p-6 rounded-lg shadow-gray-1">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Thick Line Arrows</h4>
              <div className="flex flex-wrap gap-4">
                <ArrowIcon direction="up" variant="line-thick" className="text-gray-800" />
                <ArrowIcon direction="down" variant="line-thick" className="text-gray-800" />
                <ArrowIcon direction="left" variant="line-thick" className="text-gray-800" />
                <ArrowIcon direction="right" variant="line-thick" className="text-gray-800" />
              </div>
            </div>

            {/* Back Arrows */}
            <div className="bg-white p-6 rounded-lg shadow-gray-1">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Back Arrows</h4>
              <div className="flex flex-wrap gap-4">
                <ArrowIcon direction="left" variant="back" className="text-gray-800" />
                <ArrowIcon direction="right" variant="back" className="text-gray-800" />
              </div>
            </div>

            {/* Double Back Arrows */}
            <div className="bg-white p-6 rounded-lg shadow-gray-1">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Double Back Arrows</h4>
              <div className="flex flex-wrap gap-4">
                <ArrowIcon direction="left" variant="back-double" className="text-gray-800" />
                <ArrowIcon direction="right" variant="back-double" className="text-gray-800" />
              </div>
            </div>

            {/* Different Sizes */}
            <div className="bg-white p-6 rounded-lg shadow-gray-1">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Разные размеры</h4>
              <div className="flex flex-wrap gap-4 items-center">
                <ArrowIcon direction="right" variant="line" size="small" className="text-gray-800" />
                <ArrowIcon direction="right" variant="line" size="medium" className="text-gray-800" />
                <ArrowIcon direction="right" variant="line" size="large" className="text-gray-800" />
              </div>
            </div>
          </div>
        </div>

        {/* Star Rating */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Звездный рейтинг</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-gray-1">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Базовый рейтинг</h4>
              <StarRating rating={4.5} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-gray-1">
              <h4 className="text-lg font-medium text-gray-700 mb-4">С текстом</h4>
              <StarRating rating={3.8} showNumber showReviews reviewCount={127} />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-gray-1">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Разные размеры</h4>
              <div className="space-y-4">
                <StarRating rating={4.2} size="small" />
                <StarRating rating={4.2} size="standard" />
                <StarRating rating={4.2} size="big" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Табы</h3>
          <div className="bg-white p-6 rounded-lg shadow-gray-1">
            <Tabs
              tabs={[
                { id: 'tab1', label: 'Первый таб', content: 'Содержимое первого таба' },
                { id: 'tab2', label: 'Второй таб', content: 'Содержимое второго таба' },
                { id: 'tab3', label: 'Третий таб', content: 'Содержимое третьего таба' }
              ]}
              onTabChange={(tabId) => setActiveTab(parseInt(tabId))}
            />
          </div>
        </div>

        {/* Checkbox */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Чекбоксы</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-gray-1">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Базовый чекбокс</h4>
              <Checkbox
                label="Принять условия"
                checked={checkboxState}
                onChange={setCheckboxState}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-gray-1">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Отключенный</h4>
              <Checkbox
                label="Недоступная опция"
                checked={false}
                disabled
                onChange={() => {}}
              />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-gray-1">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Отключенный активный</h4>
              <Checkbox
                label="Отключенный активный"
                checked={true}
                disabled
                onChange={() => {}}
              />
            </div>
          </div>
        </div>

        {/* Radio Buttons */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Радио кнопки</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-gray-1">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Базовые радио кнопки</h4>
              <div className="space-y-3">
                <RadioButton
                  name="demo"
                  label="Опция 1"
                  value="option1"
                  checked={radioState === 'option1'}
                  onChange={(checked) => checked && setRadioState('option1')}
                />
                <RadioButton
                  name="demo"
                  label="Опция 2"
                  value="option2"
                  checked={radioState === 'option2'}
                  onChange={(checked) => checked && setRadioState('option2')}
                />
                <RadioButton
                  name="demo"
                  label="Опция 3"
                  value="option3"
                  checked={radioState === 'option3'}
                  onChange={(checked) => checked && setRadioState('option3')}
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-gray-1">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Отключенные</h4>
              <div className="space-y-3">
                <RadioButton
                  name="disabled"
                  label="Отключенная опция"
                  value="disabled"
                  checked={false}
                  disabled
                  onChange={() => {}}
                />
                <RadioButton
                  name="disabled"
                  label="Отключенная активная"
                  value="disabled-active"
                  checked={true}
                  disabled
                  onChange={() => {}}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Статус бар</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-gray-1">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Темная тема</h4>
              <StatusBar variant="dark" time="14:30" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-gray-1">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Светлая тема</h4>
              <StatusBar variant="light" time="14:30" showSignal showWifi showBattery />
            </div>
          </div>
        </div>

        {/* Shadows */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Тени</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-gray-1">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Gray Shadow 1</h4>
              <p className="text-gray-600">Легкая тень</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-gray-2">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Gray Shadow 2</h4>
              <p className="text-gray-600">Средняя тень</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-gray-3">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Gray Shadow 3</h4>
              <p className="text-gray-600">Сильная тень</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-orange-1">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Orange Shadow 1</h4>
              <p className="text-gray-600">Оранжевая тень</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-orange-2">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Orange Shadow 2</h4>
              <p className="text-gray-600">Оранжевая тень</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-orange-3">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Orange Shadow 3</h4>
              <p className="text-gray-600">Оранжевая тень</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}; 