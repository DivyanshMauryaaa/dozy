'use client'

import { useTheme } from '@/context/ThemeContext'
import { colorPalettes } from '@/utils/colorPalette'

export default function Settings() {
  const {
    colorScheme,
    currentPalette,
    setCurrentPalette
  } = useTheme()

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: colorScheme.background }}>
      <h1 className="text-3xl font-bold mb-8" style={{ color: colorScheme.textOnBackground }}>Settings</h1>

      {/* Color Palette Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4" style={{ color: colorScheme.textOnBackground }}>Color Theme</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(colorPalettes).map(([name, scheme]) => (
            <button
              key={name}
              onClick={() => setCurrentPalette(name)}
              className={`
                p-4 rounded-lg border-2 transition-all
                ${currentPalette === name ? 'border-primary' : 'border-transparent'}
              `}
              style={{
                backgroundColor: scheme.background,
                borderColor: currentPalette === name ? scheme.primary : 'transparent'
              }}
            >
              <div className="space-y-2">
                <div className="h-8 rounded" style={{ backgroundColor: scheme.primary }} />
                <div className="h-4 rounded" style={{ backgroundColor: scheme.secondary }} />
                <div className="h-4 rounded" style={{ backgroundColor: scheme.accent }} />
                <p
                  className="text-sm font-medium text-center"
                  style={{ color: scheme.textOnBackground }}
                >
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 