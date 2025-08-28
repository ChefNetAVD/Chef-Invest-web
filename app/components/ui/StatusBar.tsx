import React from 'react';

interface StatusBarProps {
  time?: string;
  variant?: 'dark' | 'light';
  showSignal?: boolean;
  showWifi?: boolean;
  showBattery?: boolean;
  className?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  time = '19:02',
  variant = 'dark',
  showSignal = true,
  showWifi = true,
  showBattery = true,
  className = ''
}) => {
  const textColor = variant === 'dark' ? 'var(--status-bar-text-dark)' : 'var(--status-bar-text-light)';

  return (
    <div
      className={`flex items-center justify-between px-4 py-2 ${className}`}
      style={{
        backgroundColor: 'var(--status-bar-bg)',
        color: textColor
      }}
    >
      {/* Time */}
      <span className="text-sm font-medium">{time}</span>

      {/* Icons */}
      <div className="flex items-center gap-2">
        {/* Signal */}
        {showSignal && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V4zM8 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1H9a1 1 0 01-1-1V4zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        )}

        {/* WiFi */}
        {showWifi && (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7.002 7.002 0 00-9.9 0A1 1 0 114.535 9.464a5.002 5.002 0 017.07 0A1 1 0 0114.95 11.05zM12.12 13.88a3.001 3.001 0 00-4.242 0A1 1 0 018.293 12.293a1.001 1.001 0 011.414 0A1 1 0 0012.12 13.88zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        )}

        {/* Battery */}
        {showBattery && (
          <div className="flex items-center">
            <div className="w-6 h-3 border border-current rounded-sm relative">
              <div
                className="h-full bg-current rounded-sm"
                style={{ width: '75%' }}
              />
              <div className="absolute -right-1 top-0.5 w-0.5 h-1 bg-current rounded-sm" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 