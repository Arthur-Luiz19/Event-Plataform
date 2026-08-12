import { createContext } from 'react'
import type { Session } from './session'

export type AuthContextValue = {
  session: Session | null
  signIn: (s: Session) => void
  signOut: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)