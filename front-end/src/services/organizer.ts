import { http } from '@/lib/http'
import type { Event } from './events'

export type CatalogMovie = {
  tmdbMovieId: number
  title: string
  posterUrl?: string
  overview?: string
  releaseDate?: string
}

export const searchCatalog = (query: string) => http.get<CatalogMovie[]>('/catalog/movies', { params: { query } }).then((event) => event.data)

export type CreateEventInput = {
  tmdbMovieId: number
  startDateTime: string
  location: string
  capacity: number
  ticketPrice: number
}

export type UpdateEventInput = Omit<CreateEventInput, 'tmdbMovieId'>

export const createEvent = (input: CreateEventInput) => http.post<Event>('/events', input).then((event) => event.data)

export const updateEvent = (id: string, input: UpdateEventInput) => http.put<Event>(`/events/${id}`, input).then((event) => event.data)

export const deleteEvent = (id: string) => http.delete<void>(`/events/${id}`).then(() => undefined)
