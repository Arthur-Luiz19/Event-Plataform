import { http } from '@/lib/http'

export type Event = {
  id: string
  tmdbMovieId: number
  title: string
  description: string
  posterUrl: string
  startDateTime: string
  location: string
  capacity: number
  ticketPrice: number
  organizerId: string
  organizerName: string
  createdAt: string
}

export async function getEvents(): Promise<Event[]> {
  const response = await http.get<Event[]>('/events')
  return response.data
}

export async function getEvent(id: string): Promise<Event> {
  const response = await http.get<Event>(`/events/${id}`)
  return response.data
}