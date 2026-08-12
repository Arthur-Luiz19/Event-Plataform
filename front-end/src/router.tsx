import { createBrowserRouter } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { ClientHomePage } from './pages/ClientHomePage'
import { RequireRole } from './components/guards/RequireRole'
import NotFoundPage from './pages/NotFoundPage'
import { EventDetailsPage, GatePage, OrganizerEventFormPage, OrganizerPage, RegisterPage } from './pages/lazy'

export const router = createBrowserRouter([
  { path: '/entrar', element: <LoginPage /> },
  { path: '/cadastro', element: <RegisterPage /> },
  {
    path: '/cliente',
    element: (
      <RequireRole role="ROLE_CLIENT">
        <ClientHomePage />
      </RequireRole>
    )
  },
  {
    path: '/cliente/eventos/:eventId',
    element: (
      <RequireRole role="ROLE_CLIENT">
        <EventDetailsPage />
      </RequireRole>
    )
  },
  {
    path: '/portaria',
    element: (
      <RequireRole role="ROLE_GATE">
        <GatePage />
      </RequireRole>
    )
  },
  {
    path: '/organizador',
    element: (
      <RequireRole role="ROLE_ORGANIZER">
        <OrganizerPage />
      </RequireRole>
    )
  },
  {
    path: '/organizador/novo',
    element: (
      <RequireRole role="ROLE_ORGANIZER">
        <OrganizerEventFormPage />
      </RequireRole>
    )
  },
  {
    path: '/organizador/eventos/:eventId/editar',
    element: (
      <RequireRole role="ROLE_ORGANIZER">
        <OrganizerEventFormPage />
      </RequireRole>
    )
  },
  { path: '*', element: <NotFoundPage /> }
])
