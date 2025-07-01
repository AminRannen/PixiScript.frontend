import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider, useSession } from "next-auth/react"
import type { ReactElement, ReactNode } from "react"
import type { NextPage } from "next"
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import "@/lib/i18n"; 

// 🔹 Extend NextPage with optional getLayout
export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
  auth?: boolean // Add auth requirement flag
}

// 🔹 Extend AppProps to use that layout-enabled Component
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

// Session checker component (moved inline for better TypeScript integration)
function AuthWrapper({ children, requireAuth }: { children: ReactNode, requireAuth: boolean }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    
    // Debug logging
    console.log('Session status:', {
      authenticated: status === 'authenticated',
      requiresAuth: requireAuth,
      sessionExpires: session?.expiresAt ? new Date(session.expiresAt) : null,
      currentTime: new Date()
    })

    if (requireAuth && status !== 'authenticated') {
      router.push(`/login?callbackUrl=${encodeURIComponent(router.asPath)}`)
    }

    if (session?.error === 'RefreshAccessTokenError') {
      console.error('Refresh token failed - forcing logout')
      router.push('/login?error=SessionExpired')
    }
  }, [status, requireAuth, session])

  if (requireAuth && status !== 'authenticated') {
    return <div>Loading...</div>
  }

  return <>{children}</>
}

export default function App({ 
  Component, 
  pageProps: { session, ...pageProps } 
}: AppPropsWithLayout) {
  // 🔹 Use the getLayout function if defined, otherwise just render the page
  const getLayout = Component.getLayout ?? ((page) => page)
  const requireAuth = Component.auth ?? false

  return (
    <SessionProvider 
      session={session}
      refetchInterval={5 * 60} // Check session every 5 minutes
      refetchOnWindowFocus={true}
    >
      {getLayout(
        requireAuth ? (
          <AuthWrapper requireAuth={true}>
            <Component {...pageProps} />
          </AuthWrapper>
        ) : (
          <Component {...pageProps} />
        )
      )}
    </SessionProvider>
  )
}