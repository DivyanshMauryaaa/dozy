'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from '@/components/SessionProvider'
import supabase from '@/lib/supabase'

export default function Navbar() {
  const router = useRouter()
  const { session, loading } = useSession()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signin')
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              Dozy
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!loading && (
              <>
                {session ? (
                  <>
                    <span className="text-gray-700">{session.user.email}</span>
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/signin"
                      className="px-4 py-2 text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                      Sign Up
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 