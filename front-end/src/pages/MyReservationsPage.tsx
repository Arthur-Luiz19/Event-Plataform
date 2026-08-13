import { useNavigate } from 'react-router-dom'
import { AppHeader } from '@/components/layout/AppHeader'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { useMyReservations } from '@/features/reservation/hooks/useReservationFlow'
import { cn } from '@/lib/cn'
import { formatBRL, formatDateTime } from '@/lib/format'
import { apiErrorMessage } from '@/lib/http'
import type { ReservationView } from '@/services/reservations'

const badge: Record<string, string> = {
  PENDING_PAYMENT: 'border-warn/50 bg-warn/10 text-warn',
  CONFIRMED: 'border-ok/50 bg-ok/10 text-ok',
  CANCELLED: 'border-line bg-raised text-mute'
}

const label: Record<string, string> = {
  PENDING_PAYMENT: 'Aguardando pagamento',
  CONFIRMED: 'Confirmada',
  CANCELLED: 'Cancelada'
}

export function MyReservationsPage() {
  const navigate = useNavigate()
  const { data: reservations = [], isPending, isError, error, refetch } = useMyReservations()

  const pending = reservations.filter((r) => r.status === 'PENDING_PAYMENT')
  const history = reservations.filter((r) => r.status !== 'PENDING_PAYMENT')

  return (
    <div className="min-h-dvh">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-4xl text-ink">Minhas reservas</h1>

        {isError && (
          <Alert tone="danger" className="mt-6">
            {apiErrorMessage(error)}{' '}
            <button className="font-semibold underline" onClick={() => refetch()}>
              Tentar novamente
            </button>
          </Alert>
        )}

        {isPending ? (
          <div className="mt-6 space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-xl bg-raised" />
            ))}
          </div>
        ) : reservations.length === 0 ? (
          <div className="mt-6 rounded-xl border border-line bg-surface p-10 text-center">
            <p className="text-sm text-mute">Você ainda não fez nenhuma reserva.</p>
            <Button className="mt-4" onClick={() => navigate('/cliente')}>
              Ver eventos em cartaz
            </Button>
          </div>
        ) : (
          <>
            {pending.length > 0 && (
              <section className="mt-8">
                <h2 className="font-display text-xl text-warn">Pagamentos pendentes</h2>
                <p className="mt-1 text-xs text-mute">Os assentos ficam reservados para você até o pagamento ou cancelamento.</p>
                <ul className="mt-4 space-y-3">
                  {pending.map((r) => (
                    <ReservationRow key={r.id} r={r} action={<Button onClick={() => navigate(`/cliente/reservas/${r.id}/pagamento`)}>Continuar pagamento</Button>} />
                  ))}
                </ul>
              </section>
            )}

            {history.length > 0 && (
              <section className="mt-10">
                <h2 className="font-display text-xl text-ink">Histórico</h2>
                <ul className="mt-4 space-y-3">
                  {history.map((r) => (
                    <ReservationRow
                      key={r.id}
                      r={r}
                      action={
                        r.status === 'CONFIRMED' ? (
                          <Button variant="outline" onClick={() => navigate('/cliente/ingressos')}>
                            Ver ingressos
                          </Button>
                        ) : undefined
                      }
                    />
                  ))}
                </ul>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}

function ReservationRow({ r, action }: { r: ReservationView; action?: React.ReactNode }) {
  return (
    <li className="rounded-xl border border-line bg-surface p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-display text-lg text-ink">{r.eventTitle}</p>
          <p className="mt-0.5 text-xs text-mute">
            {formatDateTime(new Date(r.createdAt))} · {r.seats.map((s) => s.seatLabel).join(', ')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-semibold text-accent-hi">{formatBRL(r.totalAmount)}</span>
          <span className={cn('rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider', badge[r.status])}>{label[r.status]}</span>
        </div>
      </div>
      {action && <div className="mt-3">{action}</div>}
    </li>
  )
}
