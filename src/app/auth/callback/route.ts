import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session }, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (sessionError) {
      console.error('Error exchanging code for session:', sessionError)
      return NextResponse.redirect(new URL('/auth/signin', requestUrl.origin))
    }

    if (session?.user) {
      // Check if profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching profile:', fetchError)
        return NextResponse.redirect(new URL('/auth/signin', requestUrl.origin))
      }

      if (!existingProfile) {
        // Create new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: session.user.id,
              email: session.user.email,
              username: session.user.email?.split('@')[0], // Default username from email
              first_name: session.user.user_metadata?.full_name?.split(' ')[0],
              last_name: session.user.user_metadata?.full_name?.split(' ').slice(1).join(' '),
              avatar_url: session.user.user_metadata?.avatar_url,
            }
          ])

        if (insertError) {
          console.error('Error creating profile:', insertError)
          return NextResponse.redirect(new URL('/auth/signin', requestUrl.origin))
        }
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/', requestUrl.origin))
} 