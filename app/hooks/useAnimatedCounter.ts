import { useState, useEffect, useCallback, useMemo } from 'react';
import { formatLargeNumber } from '../utils/formatters';

interface UseAnimatedCounterOptions {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  autoStart?: boolean;
  onComplete?: () => void;
}

export function useAnimatedCounter({
  value,
  duration = 2000,
  prefix = '',
  suffix = '',
  autoStart = true,
  onComplete
}: UseAnimatedCounterOptions) {
  // Состояние
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Вычисляемые значения
  const increment = useMemo(() => {
    return value / (duration / 16); // 60 FPS
  }, [value, duration]);

  // Форматированное значение для отображения
  const formattedValue = useMemo(() => {
    return `${prefix}${formatLargeNumber(count)}${suffix}`;
  }, [count, prefix, suffix]);

  // Запуск анимации
  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    setIsCompleted(false);
    setCount(0);
  }, []);

  // Остановка анимации
  const stopAnimation = useCallback(() => {
    setIsAnimating(false);
  }, []);

  // Сброс счетчика
  const resetCounter = useCallback(() => {
    setCount(0);
    setIsAnimating(false);
    setIsCompleted(false);
  }, []);

  // Установка значения без анимации
  const setValueImmediately = useCallback((newValue: number) => {
    setCount(newValue);
    setIsAnimating(false);
    setIsCompleted(true);
  }, []);

  // Эффект анимации
  useEffect(() => {
    if (!isAnimating) return;

    let currentCount = 0;
    const timer = setInterval(() => {
      currentCount += increment;
      
      if (currentCount >= value) {
        setCount(value);
        setIsAnimating(false);
        setIsCompleted(true);
        clearInterval(timer);
        onComplete?.();
      } else {
        setCount(Math.floor(currentCount));
      }
    }, 16); // ~60 FPS
    
    return () => clearInterval(timer);
  }, [isAnimating, value, increment, onComplete]);

  // Автозапуск при изменении значения
  useEffect(() => {
    if (autoStart) {
      startAnimation();
    }
  }, [value, autoStart, startAnimation]);

  // Прогресс анимации (0-1)
  const progress = useMemo(() => {
    if (value === 0) return 1;
    return Math.min(count / value, 1);
  }, [count, value]);

  // Проверка, завершена ли анимация
  const isFinished = useMemo(() => {
    return isCompleted && !isAnimating;
  }, [isCompleted, isAnimating]);

  return {
    // Состояние
    count,
    isAnimating,
    isCompleted,
    isFinished,
    
    // Вычисляемые значения
    formattedValue,
    progress,
    
    // Обработчики
    startAnimation,
    stopAnimation,
    resetCounter,
    setValueImmediately
  };
} 