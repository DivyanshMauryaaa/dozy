export interface ColorScheme {
  primary: string;
  textOnPrimary: string;
  secondary: string;
  textOnSecondary: string;
  accent: string;
  textOnAccent: string;
  background: string;
  textOnBackground: string;
  muted: string;
  textOnMuted: string;
}

export const colorPalettes: Record<string, ColorScheme> = {
  ocean: {
    primary: '#1E40AF', // Deep blue
    textOnPrimary: '#FFFFFF',
    secondary: '#60A5FA', // Light blue
    textOnSecondary: '#1E3A8A',
    accent: '#3B82F6', // Bright blue
    textOnAccent: '#FFFFFF',
    background: '#EFF6FF', // Very light blue
    textOnBackground: '#1E3A8A',
    muted: '#93C5FD', // Pale blue
    textOnMuted: '#1E3A8A'
  },
  forest: {
    primary: '#166534', // Deep green
    textOnPrimary: '#FFFFFF',
    secondary: '#4ADE80', // Light green
    textOnSecondary: '#14532D',
    accent: '#22C55E', // Bright green
    textOnAccent: '#FFFFFF',
    background: '#F0FDF4', // Very light green
    textOnBackground: '#14532D',
    muted: '#86EFAC', // Pale green
    textOnMuted: '#14532D'
  },
  sunset: {
    primary: '#9F1239', // Deep rose
    textOnPrimary: '#FFFFFF',
    secondary: '#FB7185', // Light rose
    textOnSecondary: '#881337',
    accent: '#E11D48', // Bright rose
    textOnAccent: '#FFFFFF',
    background: '#FFF1F2', // Very light rose
    textOnBackground: '#881337',
    muted: '#FDA4AF', // Pale rose
    textOnMuted: '#881337'
  },
  midnight: {
    primary: '#1E293B', // Deep slate
    textOnPrimary: '#FFFFFF',
    secondary: '#64748B', // Light slate
    textOnSecondary: '#F8FAFC',
    accent: '#334155', // Bright slate
    textOnAccent: '#FFFFFF',
    background: '#F1F5F9', // Very light slate
    textOnBackground: '#0F172A',
    muted: '#94A3B8', // Pale slate
    textOnMuted: '#0F172A'
  },
  lavender: {
    primary: '#6B21A8', // Deep purple
    textOnPrimary: '#FFFFFF',
    secondary: '#C084FC', // Light purple
    textOnSecondary: '#4C1D95',
    accent: '#9333EA', // Bright purple
    textOnAccent: '#FFFFFF',
    background: '#F5F3FF', // Very light purple
    textOnBackground: '#4C1D95',
    muted: '#D8B4FE', // Pale purple
    textOnMuted: '#4C1D95'
  },
  amber: {
    primary: '#92400E', // Deep amber
    textOnPrimary: '#FFFFFF',
    secondary: '#FBBF24', // Light amber
    textOnSecondary: '#78350F',
    accent: '#F59E0B', // Bright amber
    textOnAccent: '#FFFFFF',
    background: '#FFFBEB', // Very light amber
    textOnBackground: '#78350F',
    muted: '#FCD34D', // Pale amber
    textOnMuted: '#78350F'
  }
}

// Helper function to get a color with opacity
export function withOpacity(color: string, opacity: number): string {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${opacity})`
}

// Helper function to get a lighter version of a color
export function lightenColor(color: string, amount: number): string {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  
  const newR = Math.min(255, r + (255 - r) * amount)
  const newG = Math.min(255, g + (255 - g) * amount)
  const newB = Math.min(255, b + (255 - b) * amount)
  
  return `rgb(${Math.round(newR)}, ${Math.round(newG)}, ${Math.round(newB)})`
}

// Helper function to get a darker version of a color
export function darkenColor(color: string, amount: number): string {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  
  const newR = Math.max(0, r * (1 - amount))
  const newG = Math.max(0, g * (1 - amount))
  const newB = Math.max(0, b * (1 - amount))
  
  return `rgb(${Math.round(newR)}, ${Math.round(newG)}, ${Math.round(newB)})`
} 