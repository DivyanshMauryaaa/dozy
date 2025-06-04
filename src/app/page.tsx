// app/page.tsx (or wherever your home component is)
'use client'

import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import quotes from './quotes';
import { Plus } from 'lucide-react';

export default function Home() {
  const { session, loading } = useAuthRedirect();
  const currentUser = session?.user.user_metadata;

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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

  const quote = quotes[Math.floor(Math.random() * quotes.length)];

  // Your actual home content here
  return (
    <div className="min-h-screen p-8">

      <div className='text-center'>
        <h1 className="text-7xl font-bold text-gray-900">{timeString}</h1>
        <p>Let's Make it count <span className='font-bold'>{currentUser?.name.split(' ')[0]}!</span></p>
      </div>

      {/* Your home content */}

      <br />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

        {/* Decoration Bars */}
        <div className='bg-blue-700 p-1 rounded-lg hidden lg:block'></div>
        <div className='bg-blue-700 p-1 rounded-lg hidden lg:block'></div>
        <div className='bg-blue-700 p-1 rounded-lg hidden lg:block'></div>

        {/* Main columns */}
        <div className='bg-blue-700 text-white h-auto p-6 rounded-lg transition-shadow leading-tight'>
          <span className='font-bold text-5xl'>"{quote.quote}</span>
          <br />
          <br />
          <br />

          - {quote.author}
        </div>


        <div className="border border-gray-300 py-10 px-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-2">
            <p className="text-gray-600">Tasks Completed: 12</p>
            <p className="text-gray-600">Upcoming: 5</p>
          </div>
        </div>

        <div className="border border-gray-300 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-2">
            <p className="text-gray-600">Last task: 2 hours ago</p>
            <p className="text-gray-600">Productivity score: 85%</p>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-2">
            <button className="w-full bg-gray-100 cursor-pointer text-gray-700 py-2 rounded-md transition-colors hover:bg-gray-200">
              View Tasks
            </button>
            <button className="w-full bg-gray-100 cursor-pointer text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors">
              View Calendar
            </button>
            <button className="w-full bg-gray-100 cursor-pointer text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors">
              View Notes
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-x-2 flex">
            <div className="w-full p-5 h-[140px] rounded bg-blue-700 hover:bg-blue-800 cursor-pointer text-white transition-colors">
              <p className='font-bold text-xl text-center'>New Task</p>
            </div>
            <div className="w-full p-5 h-[140px] rounded bg-blue-700 hover:bg-blue-800 cursor-pointer text-white transition-colors">
              <p className='font-bold text-xl text-center'>New Note</p>
            </div>
            <div className="w-full p-5 h-[140px] rounded bg-blue-700 hover:bg-blue-800 cursor-pointer text-white transition-colors">
              <p className='font-bold text-xl text-center'>New Schedule</p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg border border-gray-300 p-6'>
          Focus Task
        </div>

      </div>
    </div>
  )
}