// src/theme.ts
// Design System Web3 Moderno para PassPay

export const theme = {
  colors: {
    // Primary
    purple: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
    },
    // Secondary
    cyan: {
      400: '#22d3ee',
      500: '#06b6d4',
      600: '#0891b2',
    },
    // Accent
    amber: {
      400: '#fbbf24',
      500: '#f59e0b',
    },
    // Status
    green: {
      400: '#4ade80',
      500: '#22c55e',
    },
    red: {
      400: '#f87171',
      500: '#ef4444',
    },
    // Background
    gray: {
      900: '#0f172a',
      800: '#1e293b',
      700: '#334155',
      600: '#475569',
    }
  },
  
  gradients: {
    primary: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
    secondary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
    success: 'linear-gradient(135deg, #10b981 0%, #22c55e 100%)',
    background: 'linear-gradient(to bottom, #0f172a 0%, #1e293b 100%)',
  },
  
  shadows: {
    glow: '0 0 40px rgba(139, 92, 246, 0.3)',
    card: '0 8px 32px rgba(0, 0, 0, 0.3)',
    inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  
  blur: {
    glass: 'blur(10px)',
  },
  
  animations: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    }
  }
};

export type Theme = typeof theme;