// app/page.tsx (or wherever your home component is)
'use client'

import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import quotes from './quotes';
import { useTheme } from '@/context/ThemeContext';
import { getContrastTextColor, withOpacity, lightenColor, darkenColor, getContrastColor } from '@/utils/colorUtils';
import Link from 'next/link';

export default function Home() {
  const { session, loading } = useAuthRedirect();
  const currentUser = session?.user.user_metadata;
  const { colorScheme } = useTheme();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: colorScheme.primary }}></div>
      </div>
    )
  }

  // If no session, useAuthRedirect will handle the redirect
  if (!session) {
    return null
  }

  //Main App Code
  const currentTime = new Date();
  const hours = currentTime.getHours() % 12 || 12; // Convert to 12-hour format
  const minutes = currentTime.getMinutes().toString().padStart(2, '0'); // Ensure 2 digits
  const ampm = currentTime.getHours() >= 12 ? 'PM' : 'AM';
  const timeString = `${hours}:${minutes} ${ampm}`;

  //Today's quote
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const quote = quotes[dayOfYear % quotes.length];

  // Your actual home content here
  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: colorScheme.background }}>
      <div className='text-center'>
        <h1 
          className="text-7xl font-bold" 
          style={{ color: colorScheme.textOnBackground }}
        >
          {timeString}
        </h1>
        <p style={{ color: colorScheme.textOnBackground }}>
          Let's Make it count <span className='font-bold'>{currentUser?.name.split(' ')[0]}!</span>
        </p>
      </div>

      <br />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {/* Decoration Bars */}
        <div 
          className="p-1 rounded-lg hidden lg:block" 
          style={{ backgroundColor: colorScheme.primary }}
        />
        <div 
          className="p-1 rounded-lg hidden lg:block" 
          style={{ backgroundColor: colorScheme.secondary }}
        />
        <div 
          className="p-1 rounded-lg hidden lg:block" 
          style={{ backgroundColor: colorScheme.accent }}
        />

        {/* Quote Card */}
        <div 
          className="h-auto p-6 rounded-lg transition-shadow leading-tight"
          style={{ 
            backgroundColor: colorScheme.primary,
            color: colorScheme.textOnPrimary
          }}
        >
          <span className='font-bold text-5xl'>"{quote.quote}</span>
          <br />
          <br />
          <br />
          - {quote.author}
        </div>

        {/* Quick Stats */}
        <div 
          className="py-10 px-5 rounded-xl"
          style={{ backgroundColor: colorScheme.background }}
        >
          <h2 
            className="text-xl font-semibold mb-4"
            style={{ color: colorScheme.textOnBackground }}
          >
            Quick Stats
          </h2>
          <div className="space-y-2">
            <p 
              className="p-2 rounded"
              style={{ 
                color: colorScheme.textOnBackground,
                backgroundColor: colorScheme.muted
              }}
            >
              Tasks Completed: 12
            </p>
            <p 
              className="p-2 rounded"
              style={{ 
                color: colorScheme.textOnBackground,
                backgroundColor: colorScheme.muted
              }}
            >
              Upcoming: 5
            </p>
          </div>
        </div>

        {/* Recent Activity */}
        <div 
          className="py-10 px-5 rounded-xl"
          style={{ backgroundColor: colorScheme.background }}
        >
          <h2 
            className="text-xl font-semibold mb-4"
            style={{ color: colorScheme.textOnBackground }}
          >
            Recent Activity
          </h2>
          <div className="space-y-2">
            <p 
              className="p-2 rounded"
              style={{ 
                color: colorScheme.textOnBackground,
                backgroundColor: colorScheme.muted
              }}
            >
              Last task: 2 hours ago
            </p>
            <p 
              className="p-2 rounded"
              style={{ 
                color: colorScheme.textOnBackground,
                backgroundColor: colorScheme.muted
              }}
            >
              Productivity score: 85%
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="space-y-2">
            <Link href={'/tasks'}>
              <button 
                className="w-full cursor-pointer py-2 rounded-md transition-colors"
                style={{ 
                  backgroundColor: colorScheme.muted,
                  color: colorScheme.textOnMuted
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = colorScheme.secondary}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = colorScheme.muted}
              >
                View Tasks
              </button>
            </Link>
            <Link href={'/calendar'}>
              <button 
                className="w-full cursor-pointer py-2 rounded-md transition-colors"
                style={{ 
                  backgroundColor: colorScheme.muted,
                  color: colorScheme.textOnMuted
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = colorScheme.secondary}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = colorScheme.muted}
              >
                View Calendar
              </button>
            </Link>
            <Link href={'/notes'}>
              <button 
                className="w-full cursor-pointer py-2 rounded-md transition-colors"
                style={{ 
                  backgroundColor: colorScheme.muted,
                  color: colorScheme.textOnMuted
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = colorScheme.secondary}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = colorScheme.muted}
              >
                View Notes
              </button>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6">
          <div className="space-x-2 flex">
            <div 
              className="w-full p-5 h-[140px] rounded cursor-pointer transition-colors"
              style={{ 
                backgroundColor: colorScheme.primary,
                color: colorScheme.textOnPrimary
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = colorScheme.accent}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = colorScheme.primary}
            >
              <p className='font-bold text-xl text-center'>New Task</p>
            </div>
            <div 
              className="w-full p-5 h-[140px] rounded cursor-pointer transition-colors"
              style={{ 
                backgroundColor: colorScheme.primary,
                color: colorScheme.textOnPrimary
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = colorScheme.accent}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = colorScheme.primary}
            >
              <p className='font-bold text-xl text-center'>New Note</p>
            </div>
            <div 
              className="w-full p-5 h-[140px] rounded cursor-pointer transition-colors"
              style={{ 
                backgroundColor: colorScheme.primary,
                color: colorScheme.textOnPrimary
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = colorScheme.accent}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = colorScheme.primary}
            >
              <p className='font-bold text-xl text-center'>New Schedule</p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg border border-gray-300 p-6'>
        </div>
      </div>
    </div>
  )
}