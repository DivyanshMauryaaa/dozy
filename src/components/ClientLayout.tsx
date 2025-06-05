'use client'

import { SessionProvider } from '@/components/SessionProvider'
import { ThemeProvider } from '@/context/ThemeContext'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { usePathname } from 'next/navigation'

function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuthPage = pathname === '/auth'

  if (isAuthPage) {
    return <div className="flex-1">{children}</div>
  }

  return (
    <>
      <Sidebar />
      {children}
    </>
  )
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <div className="flex min-h-screen">
          <SidebarWrapper>
            <div className="flex-1 transition-all duration-300 lg:ml-20">
              <Navbar />
              <main className="p-5">
                {children}
              </main>
            </div>
          </SidebarWrapper>
        </div>
      </ThemeProvider>
    </SessionProvider>
  );
} 