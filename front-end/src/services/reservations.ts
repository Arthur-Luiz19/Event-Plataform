import { http } from '@/lib/http'

export type TicketType = 'FULL' | 'HALF'

export type CreateReservationInput = {
  eventId: string
  seats: { seatId: string; ticketType: TicketType }[]
}

export type ReservationSeatView = {
  seatId: string; seatLabel: string; seatRow: string; seatNumber: number
  ticketType: TicketType; price: number
}

export type ReservationView = {
  id: string; eventId: string; eventTitle: string; status: string
  createdAt: string; totalAmount: number; seats: ReservationSeatView[]
}

export const createReservation = (input: CreateReservationInput) =>
  http.post<ReservationView>('/reservations', input).then((reservation) => reservation.data)

export const listMyReservations = () =>
  http.get<ReservationView[]>('/reservations').then((reservation) => reservation.data)

export const getReservation = (id: string) =>
  http.get<ReservationView>(`/reservations/${id}`).then((reservation) => reservation.data)