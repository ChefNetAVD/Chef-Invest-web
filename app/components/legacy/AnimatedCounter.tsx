'use client';

import { useState, useEffect } from 'react';

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
  onComplete?: () => void;
}

export default function AnimatedCounter({ 
  value, 
  suffix = '', 
  prefix = '', 
  duration = 2000,
  className = '',
  onComplete 
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const increment = value / (duration / 16);
    let currentCount = 0;
    
    const timer = setInterval(() => {
      currentCount += increment;
      
      if (currentCount >= value) {
        setCount(value);
        setIsAnimating(false);
        clearInterval(timer);
        onComplete?.();
      } else {
        setCount(Math.floor(currentCount));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [value, duration, onComplete]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  return (
    <span className={`inline-block ${className} ${isAnimating ? 'animate-count-up' : ''}`}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
} 