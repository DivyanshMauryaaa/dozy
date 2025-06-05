'use client'

import { useTheme } from '@/context/ThemeContext'
import { useState } from 'react'
import Link from 'next/link'
import { Bell, Search, User } from 'lucide-react'
import { useSession } from './SessionProvider'
import supabase from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { colorScheme } = useTheme()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const session = useSession();
  const router = useRouter();

  const signOut = () => {
    supabase.auth.signOut();
    router.push('/auth');
  }

  return (
    <nav 
      className="h-16 px-6 flex items-center justify-between"
      style={{ backgroundColor: colorScheme.background }}
    >
      {/* Left Section - Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 rounded-lg transition-colors"
            style={{ 
              backgroundColor: colorScheme.muted,
              color: colorScheme.textOnMuted,
              border: 'none'
            }}
          />
          <span 
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: colorScheme.textOnMuted }}
          >
            <Search />
          </span>
        </div>
      </div>

      {/* Right Section - Actions & Profile */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button
          className="p-2 rounded-lg transition-colors hover:opacity-80"
          style={{ 
            backgroundColor: colorScheme.muted,
            color: colorScheme.textOnMuted
          }}
        >
          <Bell />
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg transition-colors hover:opacity-80"
            style={{ 
              backgroundColor: colorScheme.muted,
              color: colorScheme.textOnMuted
            }}
          >
            <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colorScheme.primary }}>
              <User color={colorScheme.textOnAccent} />
            </span>
            <span>{session.user?.user_metadata.name}</span>
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div 
              className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg"
              style={{ 
                backgroundColor: colorScheme.background,
                border: `1px solid ${colorScheme.muted}`
              }}
            >
              <div className="py-1">
                <Link 
                  href="/profile"
                  className="block px-4 py-2 transition-colors hover:opacity-80"
                  style={{ color: colorScheme.textOnBackground }}
                >
                  Profile
                </Link>
                <Link 
                  href="/settings"
                  className="block px-4 py-2 transition-colors hover:opacity-80"
                  style={{ color: colorScheme.textOnBackground }}
                >
                  Settings
                </Link>
                <button
                  className="block w-full text-left px-4 py-2 transition-colors hover:opacity-80"
                  style={{ color: colorScheme.textOnBackground }}
                  onClick={signOut}
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
} 