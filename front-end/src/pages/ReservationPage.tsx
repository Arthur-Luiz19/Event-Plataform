import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AppHeader } from '@/components/layout/AppHeader'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { useEvent } from '@/features/clients/hooks/useEvents'
import { useCreateReservation, useSeats } from '@/features/reservation/hooks/useReservationFlow'
import { cn } from '@/lib/cn'
import { formatBRL } from '@/lib/format'
import { apiErrorMessage } from '@/lib/http'
import type { TicketType } from '@/services/reservations'

export function ReservationPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const navigate = useNavigate()
  const { data: event } = useEvent(eventId)
  const { data: seats = [], isPending } = useSeats(eventId)
  const reservation = useCreateReservation()
  const [selection, setSelection] = useState<Record<string, TicketType>>({})

  const rows = useMemo(() => {
    const map = new Map<string, typeof seats>()
    for (const s of seats) map.set(s.row, [...(map.get(s.row) ?? []), s])
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]))
  }, [seats])

  const priceOf = (t: TicketType) => (t === 'HALF' ? Math.round(((event?.ticketPrice ?? 0) / 2) * 100) / 100 : (event?.ticketPrice ?? 0))

  const total = Object.entries(selection).reduce((acc, [, t]) => acc + priceOf(t), 0)
  const selected = seats.filter((s) => selection[s.id])

  function isSeatUnavailable(seat: (typeof seats)[number]) {
    const status = seat.status?.toUpperCase()

    if (status) {
      return status === 'APPROVED' || status === 'PAID' || status === 'CONFIRMED'
    }

    return !!seat.reserved
  }

  function toggle(id: string, reserved: boolean) {
    if (reserved) return
    setSelection((p) => {
      const n = { ...p }
      if (n[id]) delete n[id]
      else n[id] = 'FULL'
      return n
    })
  }

  return (
    <div className="min-h-dvh">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <Link to={`/cliente/eventos/${eventId}`} className="text-sm text-mute hover:text-ink">
          ← Voltar ao evento
        </Link>
        <h1 className="mt-3 font-display text-3xl text-ink">{event?.title ?? '…'}</h1>
        <p className="mt-1 text-sm text-mute">
          Inteira {event ? formatBRL(event.ticketPrice) : '—'} · Meia {event ? formatBRL(priceOf('HALF')) : '—'}
        </p>

        <section className="mt-8 rounded-xl border border-line bg-surface p-6">
          <div className="mx-auto mb-2 h-1.5 w-2/3 rounded-full bg-line" aria-hidden />
          <p className="mb-6 text-center text-[10px] uppercase tracking-widest text-mute">Tela</p>
          {isPending ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-9 animate-pulse rounded bg-raised" />
              ))}
            </div>
          ) : (
            <div className="space-y-2 overflow-x-auto min-w-[540px] sm:min-w-0">
              {rows.map(([row, rowSeats]) => (
                <div key={row} className="flex items-center justify-center gap-2">
                  <span className="w-4 font-mono text-xs text-mute">{row}</span>
                  <div className="flex flex-wrap justify-center gap-2">
                    {rowSeats.map((s) => (
                      <button key={s.id} type="button" disabled={isSeatUnavailable(s)} onClick={() => toggle(s.id, isSeatUnavailable(s))} title={`${s.label} · ${isSeatUnavailable(s) ? 'ocupado' : selection[s.id] ? 'selecionado' : 'livre'}`} className={cn('flex size-9 shrink-0 items-center justify-center rounded-md border text-[10px] font-semibold transition-colors', isSeatUnavailable(s) && 'cursor-not-allowed border-line/40 bg-raised text-mute/40', !isSeatUnavailable(s) && !selection[s.id] && 'border-line bg-bg text-mute hover:border-accent/60', selection[s.id] && 'border-accent bg-accent/20 text-accent-hi')}>
                        {s.number}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-center text-[10px] text-mute">
            <span className="flex items-center justify-center gap-1.5">
              <i className="size-3 rounded-sm border border-line bg-bg" /> livre
            </span>
            <span className="flex items-center justify-center gap-1.5">
              <i className="size-3 rounded-sm border border-accent bg-accent/20" /> selecionado
            </span>
            <span className="flex items-center justify-center gap-1.5">
              <i className="size-3 rounded-sm bg-raised" /> ocupado
            </span>
          </div>
        </section>

        {selected.length > 0 && (
          <section className="mt-6 rounded-xl border border-line bg-surface p-5">
            <h2 className="font-display text-xl text-ink">Seus assentos</h2>
            <ul className="mt-4 space-y-3">
              {selected
                .sort((a, b) => a.row.localeCompare(b.row) || a.number - b.number)
                .map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-4 text-sm">
                    <span className="font-mono text-ink">{s.label}</span>
                    <div className="flex items-center gap-3">
                      <select value={selection[s.id]} onChange={(e) => setSelection((p) => ({ ...p, [s.id]: e.target.value as TicketType }))} aria-label={`Tipo de ingresso para ${s.label}`} className="h-9 rounded-lg border border-line bg-bg px-3 text-xs text-ink focus:border-accent focus:outline-none">
                        <option value="FULL">Inteira</option>
                        <option value="HALF">Meia</option>
                      </select>
                      <span className="w-20 text-right font-semibold text-accent-hi">{formatBRL(priceOf(selection[s.id]))}</span>
                    </div>
                  </li>
                ))}
            </ul>
            <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
              <span className="text-sm text-mute">Total ({selected.length})</span>
              <span className="font-display text-2xl text-ink">{formatBRL(total)}</span>
            </div>
            <Button className="mt-4 w-full" loading={reservation.isPending} onClick={() => reservation.mutate({ eventId: eventId!, seats: Object.entries(selection).map(([seatId, ticketType]) => ({ seatId, ticketType })) }, { onSuccess: (r) => navigate(`/cliente/reservas/${r.id}/pagamento`) })}>
              Confirmar reserva
            </Button>
          </section>
        )}

        {reservation.isError && (
          <Alert tone="danger" className="mt-6">
            {apiErrorMessage(reservation.error)}
          </Alert>
        )}
      </main>
    </div>
  )
}
