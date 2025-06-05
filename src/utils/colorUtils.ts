// Convert hex to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  // Remove the hash if it exists
  hex = hex.replace(/^#/, '');
  
  // Handle shorthand hex (e.g., "#fff")
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  const bigint = parseInt(hex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

// Calculate relative luminance using WCAG formula
export function getLuminance(hex: string): number {
  try {
    const { r, g, b } = hexToRgb(hex);
    // Convert RGB to relative luminance using WCAG formula
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  } catch (error) {
    console.error('Error calculating luminance:', error);
    return 0.5; // Default to middle luminance
  }
}

// Determine if text should be black or white based on background color
export function getContrastTextColor(hex: string): string {
  try {
    const luminance = getLuminance(hex);
    // For very light colors (near white), always use dark text
    if (luminance > 0.85) {
      return '#000000';
    }
    // For very dark colors (near black), always use light text
    if (luminance < 0.15) {
      return '#FFFFFF';
    }
    // For medium colors, use standard contrast calculation
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  } catch (error) {
    console.error('Error getting contrast text color:', error);
    return '#000000'; // Default to black for better visibility
  }
}

// Create a color with opacity
export function withOpacity(hex: string, opacity: number): string {
  try {
    const { r, g, b } = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  } catch (error) {
    console.error('Error creating color with opacity:', error);
    return hex; // Return original color if there's an error
  }
}

// Get a lighter version of a color
export function lightenColor(hex: string, amount: number): string {
  try {
    const { r, g, b } = hexToRgb(hex);
    // For very light colors, ensure we don't go too light
    const isVeryLight = r > 240 && g > 240 && b > 240;
    if (isVeryLight) {
      return hex; // Keep original color if it's already very light
    }
    
    const newR = Math.min(255, r + (255 - r) * (1 - amount));
    const newG = Math.min(255, g + (255 - g) * (1 - amount));
    const newB = Math.min(255, b + (255 - b) * (1 - amount));
    
    return `rgb(${Math.round(newR)}, ${Math.round(newG)}, ${Math.round(newB)})`;
  } catch (error) {
    console.error('Error lightening color:', error);
    return hex;
  }
}

// Get a darker version of a color
export function darkenColor(hex: string, amount: number): string {
  try {
    const { r, g, b } = hexToRgb(hex);
    // For very light colors, ensure we darken enough to be visible
    const isVeryLight = r > 240 && g > 240 && b > 240;
    if (isVeryLight) {
      amount = Math.max(amount, 0.3); // Ensure minimum darkening for very light colors
    }
    
    const newR = Math.max(0, r * (1 - amount));
    const newG = Math.max(0, g * (1 - amount));
    const newB = Math.max(0, b * (1 - amount));
    
    return `rgb(${Math.round(newR)}, ${Math.round(newG)}, ${Math.round(newB)})`;
  } catch (error) {
    console.error('Error darkening color:', error);
    return hex;
  }
}

// Get a color that ensures good contrast with the background
export function getContrastColor(hex: string): string {
  try {
    const { r, g, b } = hexToRgb(hex);
    // For very light colors (near white), use a darker shade of the accent color
    if (r > 240 && g > 240 && b > 240) {
      return darkenColor(hex, 0.3);
    }
    // For very dark colors, use a lighter shade
    if (r < 15 && g < 15 && b < 15) {
      return lightenColor(hex, 0.3);
    }
    // For medium colors, use the original color
    return hex;
  } catch (error) {
    console.error('Error getting contrast color:', error);
    return hex;
  }
} 