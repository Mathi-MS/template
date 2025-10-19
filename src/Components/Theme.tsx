const theme = {
  colors: {
    // Base colors
    background: {
      primary: '#0A1929',
      secondary: '#1E0A29',
      tertiary: '#0F1E3D',
      quaternary: '#2D1B40'
    },
    // Accent colors
    accent: {
      neonBlue: '#00C2FF',
      electricPurple: '#9D00FF',
      electricIndigo: '#131c4dff',
      white: '#FFFFFF'
    },
    // Text colors
    text: {
      primary: '#E0E0E0',
      secondary: '#A0A0A0',
      accent: '#FFFFFF'
    },
    // Status colors
    status: {
      success: '#00E676',
      warning: '#FFD600',
      error: '#FF3D71',
      info: '#00C2FF'
    }
  },
  // Typography
  typography: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    heading: {
      h1: '32px',
      h2: '24px',
      h3: '18px'
    },
    body: '14px',
    monospace: '"Roboto Mono", monospace'
  },
  // Spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
  },
  // Borders
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    circle: '50%'
  },
  // Shadows
  shadows: {
    card: '0 8px 16px rgba(0, 0, 0, 0.5)',
    neonBlue: '0 0 15px rgba(0, 194, 255, 0.5)',
    electricPurple: '0 0 15px rgba(157, 0, 255, 0.5)',
    electricIndigo: '0 0 15px rgba(110, 0, 255, 0.5)'
  },
  // Transitions
  transitions: {
    default: '0.3s ease',
    fast: '0.2s ease',
    slow: '0.5s ease'
  },
   breakpoints: {
    xs: '480px',
    sm: '768px',
    md: '1024px',
    lg: '1200px',
  },
  containerWidth: {
    sm: '540px',
    md: '720px',
    lg: '960px',
    xl: '1140px',
  },
  zIndex: {
    sidebar: 1000,
    header: 999,
    modal: 1050,
    tooltip: 1100,
  },
};

export default theme;