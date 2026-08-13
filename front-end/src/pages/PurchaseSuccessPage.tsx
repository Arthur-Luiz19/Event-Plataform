import { useNavigate, useParams } from 'react-router-dom'
import { AppHeader } from '@/components/layout/AppHeader'
import { Button } from '@/components/ui/Button'
import { useReservation } from '@/features/reservation/hooks/useReservationFlow'
import { formatBRL } from '@/lib/format'

export function PurchaseSuccessPage() {
  const { reservationId } = useParams<{ reservationId: string }>()
  const navigate = useNavigate()
  const { data: reservation } = useReservation(reservationId)

  return (
    <div className="min-h-dvh">
      <AppHeader />
      <main className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
        <div className="flex size-16 items-center justify-center rounded-full border border-ok/50 bg-ok/10">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-8 text-ok" aria-hidden>
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>

        <h1 className="mt-6 font-display text-4xl text-ink">Compra finalizada!</h1>
        <p className="mt-2 text-sm text-mute">Pagamento aprovado — seus ingressos foram gerados e já estão disponíveis.</p>

        {reservation && (
          <section className="mt-8 w-full rounded-xl border border-line bg-surface p-5 text-left">
            <h2 className="font-display text-xl text-ink">{reservation.eventTitle}</h2>
            <ul className="mt-3 space-y-1 text-sm text-mute">
              {reservation.seats.map((s) => (
                <li key={s.seatId} className="flex justify-between">
                  <span className="font-mono">
                    {s.seatLabel} · {s.ticketType === 'HALF' ? 'Meia' : 'Inteira'}
                  </span>
                  <span className="text-ink">{formatBRL(s.price)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-line pt-3 text-sm">
              <span className="text-mute">Total pago</span>
              <span className="font-semibold text-accent-hi">{formatBRL(reservation.totalAmount)}</span>
            </div>
          </section>
        )}

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          <Button className="flex-1" onClick={() => navigate('/cliente/ingressos')}>
            Ver meus ingressos
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => navigate('/cliente')}>
            Voltar ao início
          </Button>
        </div>
      </main>
    </div>
  )
}
