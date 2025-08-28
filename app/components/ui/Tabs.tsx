"use client";

import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultActiveTab?: string;
  density?: 'densely' | 'normally';
  onTabChange?: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultActiveTab,
  density = 'normally',
  onTabChange,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id);

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const densityClasses = {
    densely: 'gap-4',
    normally: 'gap-8'
  };

  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className={`flex ${densityClasses[density]} border-b border-gray-200`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`px-4 py-2 text-sm font-medium transition-colors duration-200 relative ${
              activeTab === tab.id
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-700 hover:text-orange-600'
            }`}
            style={{
              color: activeTab === tab.id ? 'var(--tab-active)' : 'var(--tab-default)',
              borderBottomColor: activeTab === tab.id ? 'var(--tab-underline)' : 'transparent'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tabs.find(tab => tab.id === activeTab)?.content && (
        <div className="mt-4">
          {tabs.find(tab => tab.id === activeTab)?.content}
        </div>
      )}
    </div>
  );
}; 