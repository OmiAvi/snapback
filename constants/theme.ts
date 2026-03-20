export const Colors = {
  // Clean, modern LIGHT theme like StockWave
  primary: '#4A5CFF',        // Blue accent (for buttons, actions)
  primaryDark: '#3847E0',    // Darker blue
  primaryLight: '#6B7AFF',   // Lighter blue
  
  // Main accent - blue for primary actions
  accent: '#4A5CFF',
  accentLight: '#E8EAFF',
  accentDim: 'rgba(74, 92, 255, 0.1)',
  
  // Backgrounds - Light theme
  background: '#FFFFFF',
  surface: '#F8F9FA',
  surfaceLight: '#F0F1F3',
  card: '#FFFFFF',
  cardLight: '#FAFBFC',
  
  // Text - Dark on light
  text: '#1A1D26',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textLight: '#FFFFFF',
  
  // Stock colors - Green for gains, Red for losses
  green: '#22C55E',
  greenLight: '#DCFCE7',
  greenDim: 'rgba(34, 197, 94, 0.1)',
  
  red: '#EF4444',
  redLight: '#FEE2E2',
  redDim: 'rgba(239, 68, 68, 0.1)',
  
  // Borders - Subtle gray borders
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderMuted: '#E5E7EB',
  
  // Tab bar - Light
  tabBar: '#FFFFFF',
  white: '#FFFFFF',
  black: '#000000',
  
  // Transparent overlays
  overlay: 'rgba(0, 0, 0, 0.05)',
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
  sm: 6,
  md: 10,
  lg: 14,
  xl: 18,
  round: 999,
};

export const Shadows = {
  sm: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
};
