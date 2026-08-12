import { createBrowserRouter, Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ClientHomePage } from './pages/ClientHomePage'
import { useAuth } from './contexts/useAuth'

function RequireAuth({ children }: { children: ReactNode }) {
  const { session } = useAuth()
  if (!session) return <Navigate to="/entrar" replace />
  return <>{children}</>
}

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/cliente" replace /> },
  { path: '/entrar', element: <LoginPage /> },
  { path: '/cadastro', element: <RegisterPage /> },
  { path: '/cliente', element: <RequireAuth><ClientHomePage /></RequireAuth> },
  // quando a EventDetailsPage existir, descomente — senão "Ver evento" cai no *
  // { path: '/cliente/eventos/:eventId', element: <RequireAuth><EventDetailsPage /></RequireAuth> },
  { path: '*', element: <Navigate to="/cliente" replace /> },
])
