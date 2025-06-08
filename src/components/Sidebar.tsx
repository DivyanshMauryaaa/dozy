'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/context/ThemeContext'
import { motion, AnimatePresence } from 'framer-motion'
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
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md"
        style={{ 
          backgroundColor: colorScheme.primary,
          color: colorScheme.textOnPrimary
        }}
      >
        <Menu size={24} />
      </button>
      

      {/* Sidebar */}
      <motion.aside
        className={`
          fixed top-0 left-0 h-full z-40 border-r border-gray-300
          ${isCollapsed ? 'w-16' : 'w-64'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        style={{ backgroundColor: colorScheme.background }}
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <motion.div 
            className="p-4 flex items-center justify-between"
            style={{ backgroundColor: colorScheme.primary }}
            layout
          >
            <motion.h1 
              className={`font-bold ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}
              style={{ color: colorScheme.textOnPrimary }}
              layout
            >
              Dozy
            </motion.h1>
            <motion.button
              onClick={toggleSidebar}
              className="p-1 rounded-md hover:bg-opacity-80 transition-colors"
              style={{ 
                backgroundColor: colorScheme.accent,
                color: colorScheme.textOnAccent
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isCollapsed ? '→' : '←'}
            </motion.button>
          </motion.div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2 px-2">
              {menuItems.map((item) => (
                <motion.li key={item.path} layout>
                  <Link href={item.path}>
                    <motion.div
                      className={`
                        flex items-center p-2 rounded-md cursor-pointer
                        ${pathname === item.path ? 'bg-opacity-20' : ''}
                      `}
                      style={{ 
                        backgroundColor: pathname === item.path ? colorScheme.primary : 'transparent',
                        color: pathname === item.path ? colorScheme.textOnPrimary : colorScheme.textOnBackground
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <item.icon size={20} />
                      <AnimatePresence>
                        {!isCollapsed && (
                          <motion.span
                            className="ml-3"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>
        </div>
      </motion.aside>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobileMenu}
          />
        )}
      </AnimatePresence>
    </>
  )
} 