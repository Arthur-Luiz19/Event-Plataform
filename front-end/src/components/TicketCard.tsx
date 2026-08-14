import type { ReactNode } from 'react'
import { formatDateTime } from '@/lib/format'
import type { TicketView } from '@/services/tickets'
import { QrCode } from './ui/QrCode'

export function TicketCard({ ticket, footer }: { ticket: TicketView; footer?: ReactNode }) {
  return (
    <article className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="border-b border-dashed border-line p-5">
        <div className="flex justify-end">
          <span className={ticket.status === 'ACTIVE' ? 'rounded-full border border-ok/50 bg-ok/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-ok' : 'rounded-full border border-warn/50 bg-warn/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-warn'}>{ticket.status === 'ACTIVE' ? 'Ativo' : 'Utilizado'}</span>
        </div>

        <h2 className="mt-2 text-center font-display text-xl text-ink">{ticket.eventTitle}</h2>
        <p className="mt-1 text-center text-xs text-mute">
          {formatDateTime(new Date(ticket.eventStartDateTime))} · {ticket.eventLocation}
        </p>

        <div className="mt-4 flex flex-col items-center gap-3">
          <QrCode value={ticket.code} />
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-wider text-mute">Assento</p>
            <p className="font-mono text-2xl text-ink">{ticket.seatLabel}</p>
            <p className="mt-1 text-xs text-mute">{ticket.ticketType === 'HALF' ? 'Meia' : 'Inteira'}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2 p-4">
        <span className="font-mono text-xs text-mute">{ticket.code}</span>
        {footer}
      </div>
    </article>
  )
}
