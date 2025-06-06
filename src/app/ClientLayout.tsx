'use client'

import { useTheme } from '@/context/ThemeContext'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { initialPageLoad } from '@/utils/animations'
import { useEffect, useState } from 'react'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { colorScheme } = useTheme()
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    // Set isInitialLoad to false after first render
    setIsInitialLoad(false)
  }, [])

  return (
    <div 
      className="min-h-screen flex"
      style={{ 
        backgroundColor: colorScheme.background
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 transition-all duration-300">
        <Navbar />
        <motion.main 
          className="min-h-[calc(100vh-4rem)] p-6"
          initial={isInitialLoad ? "initial" : false}
          animate={isInitialLoad ? "animate" : false}
          variants={initialPageLoad}
        >
          {children}
        </motion.main>
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