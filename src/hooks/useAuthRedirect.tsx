// hooks/useAuthRedirect.ts
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from '@/components/SessionProvider'

export function useAuthRedirect() {
  const { session, loading } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !session) {
      router.push('/auth')
    }
  }, [session, loading, router])

  return { session, loading }
}