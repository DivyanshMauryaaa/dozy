'use client'

import { useTheme } from '@/context/ThemeContext'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { Toaster } from 'react-hot-toast'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { colorScheme, wallpaper, wallpaperBlur, wallpaperOpacity } = useTheme()

  return (
    <div 
      className="min-h-screen flex"
      style={{ 
        backgroundColor: colorScheme.background,
        backgroundImage: wallpaper ? `url(${wallpaper})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Wallpaper Overlay */}
      {wallpaper && (
        <div 
          className="fixed inset-0 -z-10 transition-opacity duration-300"
          style={{ 
            backdropFilter: `blur(${wallpaperBlur}px)`,
            backgroundColor: colorScheme.background,
            opacity: wallpaperOpacity
          }}
        />
      )}

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 transition-all duration-300">
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)] p-6">
          {children}
        </main>
      </div>

      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: colorScheme.primary,
            color: colorScheme.textOnPrimary,
          },
        }}
      />
    </div>
  )
} 