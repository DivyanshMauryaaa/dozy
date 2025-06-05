'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { 
  LayoutDashboard, 
  CheckSquare, 
  FileText, 
  Music, 
  Timer, 
  Folder, 
  Settings,
  ChevronLeft,
  Menu,
  Calendar
} from 'lucide-react'

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Tasks', icon: CheckSquare, path: '/tasks' },
  { name: 'Notes', icon: FileText, path: '/notes' },
  { name: 'Calendar', icon: Calendar, path: '/calendar' },
  { name: 'Music', icon: Music, path: '/music' },
  { name: 'Focus Session', icon: Timer, path: '/focus' },
  { name: 'Files', icon: Folder, path: '/files' },
  { name: 'Settings', icon: Settings, path: '/settings' },
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { colorScheme } = useTheme()

  // Handle initial state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true)
      }
    }
    
    handleResize() // Set initial state
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md"
        onClick={toggleMobileMenu}
        style={{ 
          backgroundColor: colorScheme.primary,
          color: colorScheme.textOnPrimary
        }}
      >
        {isMobileMenuOpen ? '✕' : '☰'}
      </button>
      

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-40 transition-all duration-300 border-r border-gray-300
          ${isCollapsed ? 'w-16' : 'w-64'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ backgroundColor: colorScheme.background }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div 
            className="p-4 flex items-center justify-between"
            style={{ backgroundColor: colorScheme.primary }}
          >
            <h1 
              className={`font-bold transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}
              style={{ color: colorScheme.textOnPrimary }}
            >
              Dozy
            </h1>
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md hover:bg-opacity-80 transition-colors"
              style={{ 
                backgroundColor: colorScheme.accent,
                color: colorScheme.textOnAccent
              }}
            >
              {isCollapsed ? '→' : '←'}
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.path
                return (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      className={`flex items-center p-2 rounded-md transition-colors ${
                        isActive ? 'font-semibold' : ''
                      }`}
                      style={{
                        backgroundColor: isActive ? colorScheme.primary : 'transparent',
                        color: isActive ? colorScheme.textOnPrimary : colorScheme.textOnBackground
                      }}
                    >
                      <span className="text-xl mr-3">{Icon ? <Icon size={20} /> : item.name.charAt(0)}</span>
                      <span className={`transition-opacity duration-300 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                        {item.name}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}
    </>
  )
} 