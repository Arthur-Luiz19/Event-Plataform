import { http } from '@/lib/http'
import type { Event } from './events'

// ── Catálogo externo (TMDb via back-end, só ORGANIZER) ──────────────
// A chave do TMDb nunca vai para o browser: o front consome o proxy
// /catalog/movies e recebe um contrato estável.

export type CatalogMovie = {
  tmdbMovieId: number
  title: string
  posterUrl?: string
  overview?: string
  releaseDate?: string
}

export const searchCatalog = (query: string) => http.get<CatalogMovie[]>('/catalog/movies', { params: { query } }).then((event) => event.data)

// ── Criação e gerenciamento de eventos (ORGANIZER) ──────────────────
// Espelha o EventRequestDto / UpdateEventRequestDto do Spring:
//  · tmdbMovieId   → Long @NotNull          (só na criação; filme é imutável)
//  · startDateTime → LocalDateTime @Future  (ISO-8601, no futuro)
//  · location      → @NotBlank @Size(255)
//  · capacity      → @Positive Integer
//  · ticketPrice   → BigDecimal @DecimalMin("0.00") @Digits(8,2)

export type CreateEventInput = {
  tmdbMovieId: number
  startDateTime: string
  location: string
  capacity: number
  ticketPrice: number
}

export type UpdateEventInput = Omit<CreateEventInput, 'tmdbMovieId'>

// POST /events → 201 + EventResponseDto
export const createEvent = (input: CreateEventInput) => http.post<Event>('/events', input).then((event) => event.data)

// PUT /events/{id} → 200 + EventResponseDto (ownership validado no back)
export const updateEvent = (id: string, input: UpdateEventInput) => http.put<Event>(`/events/${id}`, input).then((event) => event.data)

// DELETE /events/{id} → 204 sem corpo
export const deleteEvent = (id: string) => http.delete<void>(`/events/${id}`).then(() => undefined)
