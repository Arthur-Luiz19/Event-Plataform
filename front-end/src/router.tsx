import { createBrowserRouter, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { ClientHomePage } from './pages/ClientHomePage'
import { RequireRole } from './components/guards/RequireRole'
import NotFoundPage from './pages/NotFoundPage'
import { CheckoutPage, EventDetailsPage, GatePage, MyReservationsPage, MyTicketsPage, OrganizerEventFormPage, OrganizerPage, PurchaseSuccessPage, RegisterPage, ReservationPage, TicketSharePage } from './pages/lazy'

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/entrar" replace /> },
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
  {
    path: '/cliente/eventos/:eventId/reserva',
    element: (
      <RequireRole role="ROLE_CLIENT">
        <ReservationPage />
      </RequireRole>
    )
  },
  {
    path: '/cliente/reservas/:reservationId/pagamento',
    element: (
      <RequireRole role="ROLE_CLIENT">
        <CheckoutPage />
      </RequireRole>
    )
  },

  {
    path: '/cliente/compra/:reservationId/sucesso',
    element: (
      <RequireRole role="ROLE_CLIENT">
        <PurchaseSuccessPage />
      </RequireRole>
    )
  },

  {
    path: '/cliente/ingressos',
    element: (
      <RequireRole role="ROLE_CLIENT">
        <MyTicketsPage />
      </RequireRole>
    )
  },

  {
    path: '/cliente/reservas',
    element: (
      <RequireRole role="ROLE_CLIENT">
        <MyReservationsPage />
      </RequireRole>
    )
  },

  { path: '/compartilhar/:token', element: <TicketSharePage /> },
  { path: '*', element: <NotFoundPage /> }
])
