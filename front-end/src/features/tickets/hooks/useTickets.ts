import { useQuery } from '@tanstack/react-query'
import { listMyTickets } from '@/services/tickets'

export function useMyTickets() {
  return useQuery({ queryKey: ['tickets'], queryFn: listMyTickets })
}