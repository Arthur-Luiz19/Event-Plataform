import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { processPayment } from '@/services/payments'
import { createReservation, getReservation, listMyReservations } from '@/services/reservations'
import { getSeats } from '@/services/seats'

export function useSeats(eventId?: string) {
  return useQuery({ queryKey: ['seats', eventId], queryFn: () => getSeats(eventId!), enabled: !!eventId })
}

export function useReservation(id?: string) {
  return useQuery({ queryKey: ['reservation', id], queryFn: () => getReservation(id!), enabled: !!id })
}

export function useMyReservations() {
  return useQuery({
    queryKey: ['reservations', 'mine'],
    queryFn: listMyReservations
  })
}

export function useCreateReservation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createReservation,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['seats'] })
  })
}

export function useProcessPayment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: processPayment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reservation'] })
      qc.invalidateQueries({ queryKey: ['tickets'] })
      qc.invalidateQueries({ queryKey: ['seats'] })
    }
  })
}
