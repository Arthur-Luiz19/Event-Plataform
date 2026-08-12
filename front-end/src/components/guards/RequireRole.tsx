import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { roleHome, type Role } from '@/contexts/session'
import { useAuth } from '@/contexts/useAuth'

export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { session } = useAuth()
  if (!session) return <Navigate to="/entrar" replace />
  if (session.user.role !== role) return <Navigate to={roleHome(session.user.role)} replace />
  return <>{children}</>
}