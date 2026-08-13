import { http } from '@/lib/http'

export type SeatStatus = 'AVAILABLE' | 'PENDING_PAYMENT' | 'APPROVED' | 'CANCELLED'

export type SeatView = {
  id: string
  row: string
  number: number
  label: string
  reserved?: boolean
  status?: SeatStatus | string
}

export const getSeats = (eventId: string) =>
  http.get<SeatView[]>(`/events/${eventId}/seats`).then((seat) => seat.data)