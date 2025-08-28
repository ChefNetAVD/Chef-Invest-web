// Component props types
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'filled' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
}

export interface LogoProps {
  className?: string;
}

export interface NavigationProps {
  className?: string;
}

export interface BackgroundImageProps {
  className?: string;
  imageSrc?: string;
}

// Design tokens types
export interface DesignTokens {
  colors: {
    primary: string;
    secondary: string;
    text: string;
    background: string;
  };
  typography: {
    fontFamily: string;
    fontSize: Record<string, string>;
    fontWeight: Record<string, number>;
  };
  spacing: Record<string, string>;
} 