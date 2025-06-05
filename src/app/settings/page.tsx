'use client'

import { useTheme } from '@/context/ThemeContext'
import { colorPalettes } from '@/utils/colorPalette'

export default function Settings() {
  const {
    colorScheme,
    currentPalette,
    setCurrentPalette,
    wallpaper,
    setWallpaper,
    wallpaperBlur,
    setWallpaperBlur,
    wallpaperOpacity,
    setWallpaperOpacity
  } = useTheme()

  const handleWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setWallpaper(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeWallpaper = () => {
    setWallpaper(null)
  }

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: colorScheme.background }}>
      <h1 className="text-3xl font-bold mb-8" style={{ color: colorScheme.textOnBackground }}>Settings</h1>

      <div className="space-y-8">
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

        {/* Wallpaper Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4" style={{ color: colorScheme.textOnBackground }}>Wallpaper</h2>

            coming soon.
          {/* Wallpaper Preview
          {wallpaper && (
            <div className="mb-4 relative">
              <img 
                src={wallpaper} 
                alt="Wallpaper preview" 
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={removeWallpaper}
                className="absolute top-2 right-2 px-3 py-1 rounded text-white"
                style={{ backgroundColor: colorScheme.primary }}
              >
                Remove
              </button>
            </div>
          )}

          {/* Upload Button */}
          {/* <div className="mb-4">
            <label className="block">
              <span className="text-gray-700">Upload Wallpaper</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleWallpaperUpload}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold"
                style={{
                  backgroundColor: colorScheme.background,
                  color: colorScheme.textOnBackground
                }}
              />
            </label>
          </div> */}

          
          {/* <div className="mb-4">
            <label className="block">
              <span className="text-gray-700">Blur: {wallpaperBlur}px</span>
              <input
                type="range"
                min="0"
                max="20"
                value={wallpaperBlur}
                onChange={(e) => setWallpaperBlur(Number(e.target.value))}
                className="mt-1 block w-full"
              />
            </label>
          </div>
           */}
          
          {/*
        
          <div className="mb-4">
            <label className="block">
              <span className="text-gray-700">Opacity: {Math.round(wallpaperOpacity * 100)}%</span>
              <input
                type="range"
                min="0"
                max="100"
                value={wallpaperOpacity * 100}
                onChange={(e) => setWallpaperOpacity(Number(e.target.value) / 100)}
                className="mt-1 block w-full"
              />
            </label>
          </div> */}
        </div>
      </div>
    </div>
  )
} 