'use client'

import { ThemeProvider } from '@/context/ThemeContext'
import { SessionProvider } from '@/components/SessionProvider'
import { Toaster } from 'react-hot-toast'
import ClientLayout from '@/app/ClientLayout'

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <ClientLayout>
          {children}
        </ClientLayout>
        <Toaster />
      </ThemeProvider>
    </SessionProvider>
  )
} 