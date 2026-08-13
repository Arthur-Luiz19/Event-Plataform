import { http } from '@/lib/http'

export type PaymentStatus = 'APPROVED' | 'REFUSED'
export type PaymentView = { id: string; amount: number; status: PaymentStatus; processedAt: string }

export const processPayment = (input: { reservationId: string; status: PaymentStatus }) =>
  http.post<PaymentView>('/payments', input).then((payment) => payment.data)