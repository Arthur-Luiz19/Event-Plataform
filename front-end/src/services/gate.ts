import axios from 'axios'
import { http } from '@/lib/http'

export type GateSuccess = {
  ticketId: string
  ticketCode: string
  status: string
  eventTitle: string
  clientName: string
  usedAt: string | null
}

export type GateOutcome =
  | { kind: 'valid'; data: GateSuccess }
  | { kind: 'invalid' }
  | { kind: 'used' }
  | { kind: 'wrong-event'; data?: GateSuccess }

export async function validateAtGate(code: string, eventId: string): Promise<GateOutcome> {
  try {
    const { data } = await http.post<GateSuccess>('/gate/validate', { code, eventId })
    return { kind: 'valid', data }
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status
      const body = err.response?.data as GateSuccess | undefined
      if (status === 404) return { kind: 'invalid' }
      if (status === 409) return { kind: 'used' }
      if (status === 422) return { kind: 'wrong-event', data: body }
    }
    throw err
  }
}