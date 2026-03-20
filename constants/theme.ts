export const Colors = {
  // Modern dark theme with orange to mustard yellow gradient accents
  primary: '#1a1a1a',
  primaryDark: '#121212',
  primaryLight: '#2a2a2a',
  
  // Orange to Mustard Yellow gradient colors
  accent: '#FF6B35',           // Vibrant orange
  accentLight: '#FF8C5A',      // Lighter orange
  accentMustard: '#E8A838',    // Mustard yellow
  accentGold: '#F5C142',       // Bright gold
  accentDim: 'rgba(255, 107, 53, 0.15)',
  
  // Gradient definitions (for use with LinearGradient)
  gradientStart: '#FF6B35',    // Orange
  gradientEnd: '#E8A838',      // Mustard yellow
  
  background: '#0f0f0f',
  surface: '#1a1a1a',
  surfaceLight: '#242424',
  card: '#1e1e1e',
  cardLight: '#2a2a2a',
  
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  textMuted: '#707070',
  textDark: '#1a1a1a',
  
  green: '#4ade80',
  greenLight: '#86efac',
  greenDim: 'rgba(74, 222, 128, 0.15)',
  
  red: '#f87171',
  redLight: '#fca5a5',
  redDim: 'rgba(248, 113, 113, 0.15)',
  
  border: 'rgba(255, 107, 53, 0.2)',
  borderLight: 'rgba(255, 107, 53, 0.35)',
  borderMuted: 'rgba(255, 255, 255, 0.1)',
  
  tabBar: '#121212',
  white: '#ffffff',
  black: '#000000',
  
  glow: 'rgba(255, 107, 53, 0.4)',
  glowMustard: 'rgba(232, 168, 56, 0.4)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FontSize = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  title: 34,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};

export const Shadows = {
  glow: {
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  glowSm: {
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
};
