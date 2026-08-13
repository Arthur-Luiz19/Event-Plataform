import { Link, useNavigate, useParams } from 'react-router-dom'
import { AppHeader } from '@/components/layout/AppHeader'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { useProcessPayment, useReservation } from '@/features/reservation/hooks/useReservationFlow'
import { formatBRL } from '@/lib/format'
import { apiErrorMessage } from '@/lib/http'

export function CheckoutPage() {
  const { reservationId } = useParams<{ reservationId: string }>()
  const navigate = useNavigate()
  const { data: reservation, isPending } = useReservation(reservationId)
  const pay = useProcessPayment()

  const awaiting = reservation?.status === 'PENDING_PAYMENT'
  const refused = pay.data?.status === 'REFUSED'

  function payNow(status: 'APPROVED' | 'REFUSED') {
    pay.mutate(
      { reservationId: reservationId!, status },
      {
        onSuccess: (p) => p.status === 'APPROVED' && navigate(`/cliente/compra/${reservationId}/sucesso`)
      }
    )
  }

  return (
    <div className="min-h-dvh">
      <AppHeader />
      <main className="mx-auto max-w-lg px-4 py-10">
        <h1 className="font-display text-3xl text-ink">Pagamento</h1>
        <Link to="/cliente" className="text-sm text-mute transition-colors hover:text-ink">
          ← Voltar ao catálogo
        </Link>

        {isPending && <div className="mt-6 h-64 animate-pulse rounded-xl bg-raised" />}

        {reservation && (
          <section className="mt-6 rounded-xl border border-line bg-surface p-5">
            <h2 className="font-display text-xl text-ink">{reservation.eventTitle}</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {reservation.seats.map((s) => (
                <li key={s.seatId} className="flex justify-between">
                  <span className="font-mono text-mute">
                    {s.seatLabel} · {s.ticketType === 'HALF' ? 'Meia' : 'Inteira'}
                  </span>
                  <span className="text-ink">{formatBRL(s.price)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-between border-t border-line pt-4">
              <span className="text-sm text-mute">Total ({reservation.seats.length})</span>
              <span className="font-display text-2xl text-ink">{formatBRL(reservation.totalAmount)}</span>
            </div>
          </section>
        )}

        {refused && (
          <Alert tone="danger" className="mt-6">
            Pagamento recusado — a reserva foi cancelada e os assentos liberados.
          </Alert>
        )}
        {pay.isError && (
          <Alert tone="danger" className="mt-6">
            {apiErrorMessage(pay.error)}
          </Alert>
        )}
        {reservation && !awaiting && !refused && (
          <Alert tone="warn" className="mt-6">
            Esta reserva não está aguardando pagamento.
          </Alert>
        )}

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button loading={pay.isPending} disabled={!awaiting} onClick={() => payNow('APPROVED')}>
            Aprovar pagamento
          </Button>
          <Button variant="outline" loading={pay.isPending} disabled={!awaiting} onClick={() => payNow('REFUSED')}>
            Simular recusa
          </Button>
        </div>
      </main>
    </div>
  )
}
