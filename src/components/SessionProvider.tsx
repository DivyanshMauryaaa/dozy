'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import supabase from '@/lib/supabase'

type SessionContextType = {
  session: Session | null
  user: User | null
  loading: boolean
  error: Error | null
}

const SessionContext = createContext<SessionContextType>({
  session: null,
  user: null,
  loading: true,
  error: null,
})

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let mounted = true
    console.log('SessionProvider: Initializing...')
    
    const initializeSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) throw sessionError
        
        if (mounted) {
          console.log('SessionProvider: Initial session:', session ? 'Found' : 'Not found')
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
        }
      } catch (err) {
        console.error('SessionProvider: Error getting session:', err)
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to get session'))
          setLoading(false)
        }
      }
    }

    initializeSession()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('SessionProvider: Auth state changed:', event, session ? 'Session found' : 'No session')
      if (mounted) {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    })

    return () => {
      console.log('SessionProvider: Cleaning up...')
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const value = {
    session,
    user,
    loading,
    error,
  }

  console.log('SessionProvider: Current state:', { loading, hasSession: !!session, hasUser: !!user, hasError: !!error })

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
} 