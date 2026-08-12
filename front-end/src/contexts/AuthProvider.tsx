import { useMemo, useState, type ReactNode } from 'react'
import { AuthContext, type AuthContextValue } from './AuthContext'
import { clearSession, getSession, setSession, type Session } from './session'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, set] = useState<Session | null>(() => getSession())
  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      signIn: (s) => { setSession(s); set(s) },
      signOut: () => { clearSession(); set(null) },
    }),
    [session],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}