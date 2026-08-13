import { http } from '@/lib/http'
import type { TicketType } from './reservations'

export type TicketView = {
  id: string; code: string; shareToken: string; status: 'ACTIVE' | 'USED'
  usedAt: string | null; eventTitle: string; eventLocation: string
  eventStartDateTime: string; seatLabel: string; ticketType: TicketType
}

export const listMyTickets = () => http.get<TicketView[]>('/tickets').then((r) => r.data)
export const getSharedTicket = (token: string) =>
  http.get<TicketView>(`/tickets/share/${token}`).then((ticket) => ticket.data)