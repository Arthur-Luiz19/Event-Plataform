import { useMutation } from '@tanstack/react-query'
import { validateAtGate } from '@/services/gate'

export function useGateValidation() {
  return useMutation({
    mutationFn: ({ code, eventId }: { code: string; eventId: string }) =>
      validateAtGate(code, eventId),
  })
}