'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { ColorScheme, colorPalettes } from '@/utils/colorPalette'

interface ThemeContextType {
  colorScheme: ColorScheme
  setColorScheme: (scheme: ColorScheme) => void
  currentPalette: string
  setCurrentPalette: (palette: string) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentPalette, setCurrentPalette] = useState('ocean')
  const [colorScheme, setColorScheme] = useState<ColorScheme>(colorPalettes.ocean)

  useEffect(() => {
    // Load theme settings from localStorage
    const savedPalette = localStorage.getItem('currentPalette')

    if (savedPalette) {
      setCurrentPalette(savedPalette)
      setColorScheme(colorPalettes[savedPalette])
    }
  }, [])

  useEffect(() => {
    // Save theme settings to localStorage
    localStorage.setItem('currentPalette', currentPalette)
  }, [currentPalette])

  const handleSetCurrentPalette = (palette: string) => {
    setCurrentPalette(palette)
    setColorScheme(colorPalettes[palette])
  }

  return (
    <ThemeContext.Provider value={{
      colorScheme,
      setColorScheme,
      currentPalette,
      setCurrentPalette: handleSetCurrentPalette
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 