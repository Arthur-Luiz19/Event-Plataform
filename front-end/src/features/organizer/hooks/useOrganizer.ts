import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useAuth } from '@/contexts/useAuth'
import { useEvents } from '@/features/clients/hooks/useEvents'
import { createEvent, deleteEvent, searchCatalog, updateEvent, type CreateEventInput, type UpdateEventInput } from '@/services/organizer'

export function useMyEvents() {
  const { session } = useAuth()
  const query = useEvents()
  const data = useMemo(() => (query.data ?? []).filter((e) => e.organizerId === session?.user.userId), [query.data, session])
  return { ...query, data }
}

export function useCatalogSearch(query: string) {
  return useQuery({
    queryKey: ['catalog', query],
    queryFn: () => searchCatalog(query),
    enabled: query.trim().length >= 2,
    placeholderData: keepPreviousData
  })
}

export function useCreateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CreateEventInput) => createEvent(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] })
  })
}

export function useUpdateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateEventInput }) => updateEvent(id, input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] })
  })
}

export function useDeleteEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteEvent(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['events'] })
  })
}
