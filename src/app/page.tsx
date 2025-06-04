// app/page.tsx (or wherever your home component is)
'use client'

import { useAuthRedirect } from '@/hooks/useAuthRedirect'

export default function Home() {
  const { session, loading } = useAuthRedirect()

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

  // Your actual home content here
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Welcome Home!</h1>
      <p>You are logged in as: {session.user.id}</p>
      {/* Your home content */}
    </div>
  )
}