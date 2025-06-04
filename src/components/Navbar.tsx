'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from '@/components/SessionProvider';
import supabase from '@/lib/supabase';
import Image from 'next/image';

export default function Navbar() {
  const router = useRouter()
  const { session, loading } = useSession()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
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
                {session && (
                  <div className='flex gap-4'>

                    {/* Profile Image & Display name */}
                    <div className='flex gap-3'>
                      <Image
                        src={session.user.user_metadata.avatar_url}
                        width={34}
                        height={24}
                        alt='User'
                        className='rounded-full hover:ring-2 ring-black'
                      />
                      <p className="text-black font-bold">{session.user.user_metadata.name}</p>
                    </div>

                    {/* Sign out Button */}
                    <button
                      onClick={handleSignOut}
                      className="px-4 py-2 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                    >
                      Sign Out
                    </button>
                  
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 