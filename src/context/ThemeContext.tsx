'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { ColorScheme, colorPalettes } from '@/utils/colorPalette'

interface ThemeContextType {
  colorScheme: ColorScheme
  setColorScheme: (scheme: ColorScheme) => void
  currentPalette: string
  setCurrentPalette: (palette: string) => void
  wallpaper: string | null
  setWallpaper: (url: string | null) => void
  wallpaperBlur: number
  setWallpaperBlur: (blur: number) => void
  wallpaperOpacity: number
  setWallpaperOpacity: (opacity: number) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentPalette, setCurrentPalette] = useState('ocean')
  const [colorScheme, setColorScheme] = useState<ColorScheme>(colorPalettes.ocean)
  const [wallpaper, setWallpaper] = useState<string | null>(null)
  const [wallpaperBlur, setWallpaperBlur] = useState(0)
  const [wallpaperOpacity, setWallpaperOpacity] = useState(1)

  useEffect(() => {
    // Load theme settings from localStorage
    const savedPalette = localStorage.getItem('currentPalette')
    const savedWallpaper = localStorage.getItem('wallpaper')
    const savedBlur = localStorage.getItem('wallpaperBlur')
    const savedOpacity = localStorage.getItem('wallpaperOpacity')

    if (savedPalette) {
      setCurrentPalette(savedPalette)
      setColorScheme(colorPalettes[savedPalette])
    }
    if (savedWallpaper) setWallpaper(savedWallpaper)
    if (savedBlur) setWallpaperBlur(Number(savedBlur))
    if (savedOpacity) setWallpaperOpacity(Number(savedOpacity))
  }, [])

  useEffect(() => {
    // Save theme settings to localStorage
    localStorage.setItem('currentPalette', currentPalette)
    if (wallpaper) localStorage.setItem('wallpaper', wallpaper)
    localStorage.setItem('wallpaperBlur', wallpaperBlur.toString())
    localStorage.setItem('wallpaperOpacity', wallpaperOpacity.toString())
  }, [currentPalette, wallpaper, wallpaperBlur, wallpaperOpacity])

  const handleSetCurrentPalette = (palette: string) => {
    setCurrentPalette(palette)
    setColorScheme(colorPalettes[palette])
  }

  return (
    <ThemeContext.Provider value={{
      colorScheme,
      setColorScheme,
      currentPalette,
      setCurrentPalette: handleSetCurrentPalette,
      wallpaper,
      setWallpaper,
      wallpaperBlur,
      setWallpaperBlur,
      wallpaperOpacity,
      setWallpaperOpacity
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