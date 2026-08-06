export const physicalTokens = {
  colors: {
    base: {
      white: '#FFFFFF',
      black: '#000000',
    },
    slate: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
      950: '#020617',
    },
    amber: {
      400: '#FBBF24',
      500: '#F59E0B',
      600: '#D97706',
    },
    background: {
      default: '#0A0A0B',
      elevated: '#121214',
      subtle: '#050506',
    }
  },
  typography: {
    fontFamily: {
      sans: '"Inter", sans-serif',
      brand: '"Tilt Warp", sans-serif',
    },
    scale: {
      'Display XL': { fontSize: 'clamp(2.5rem, 5vw + 1rem, 4.5rem)', lineHeight: '1', tracking: '-0.04em' },      // 40px to 72px
      'Display L': { fontSize: 'clamp(2.25rem, 4vw + 1rem, 3.75rem)', lineHeight: '1.05', tracking: '-0.03em' },   // 36px to 60px
      'Display M': { fontSize: 'clamp(2rem, 3vw + 1rem, 3rem)', lineHeight: '1.1', tracking: '-0.02em' },       // 32px to 48px
      'Heading XL': { fontSize: 'clamp(1.75rem, 2vw + 1rem, 2.25rem)', lineHeight: '1.15', tracking: '-0.02em' },  // 28px to 36px
      'Heading L': { fontSize: 'clamp(1.5rem, 1.5vw + 1rem, 1.875rem)', lineHeight: '1.2', tracking: '-0.01em' },   // 24px to 30px
      'Heading M': { fontSize: '1.5rem', lineHeight: '1.3', tracking: '0' },           // 24px
      'Body XL': { fontSize: '1.25rem', lineHeight: '1.6', tracking: '0' },            // 20px
      'Body L': { fontSize: '1.125rem', lineHeight: '1.65', tracking: '0' },           // 18px
      'Body M': { fontSize: '1rem', lineHeight: '1.7', tracking: '0' },                // 16px
      'Body S': { fontSize: '0.875rem', lineHeight: '1.6', tracking: '0' },            // 14px
      'Caption': { fontSize: '0.75rem', lineHeight: '1.5', tracking: '0.02em' },       // 12px
      'Label': { fontSize: '0.6875rem', lineHeight: '1.4', tracking: '0.1em' },        // 11px
      'Metric': { fontSize: '2.5rem', lineHeight: '1.1', tracking: '-0.02em' },        // 40px
    },
    weight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    }
  },
  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    6: '24px',
    8: '32px',
    12: '48px',
    16: '64px',
    24: '96px',
    32: '128px',
    section: '160px',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  motion: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      epic: '1000ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      out: 'cubic-bezier(0.0, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      snappy: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    }
  },
  layout: {
    maxWidth: {
      reading: '68ch',
      article: '72ch',
      executive: '80ch',
      metric: '32ch',
      hero: '15ch',
      narrative: '48ch',
      container: '1280px', // max-w-7xl
    }
  },
  zIndex: {
    hide: -1,
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  }
};
