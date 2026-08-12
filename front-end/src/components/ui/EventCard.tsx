import { Link } from 'react-router-dom'
import { formatBRL, formatDateTime } from '../../lib/format'
import type { Event } from '@/services/events'

export function EventCard({ event }: { event: Event }) {
  return (
    <Link
      to={`/cliente/eventos/${event.id}`}
      className="group overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-accent/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <div className="relative aspect-2/3 w-full overflow-hidden bg-raised">
        {event.posterUrl ? (
          <img
            src={event.posterUrl}
            alt={`Pôster de ${event.title}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-raised to-bg p-4">
            <span className="text-center font-display text-xl text-mute">{event.title}</span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-bg/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-hi backdrop-blur">
          Em cartaz
        </span>
      </div>

      <div className="space-y-1.5 p-4">
        <h3 className="font-display text-lg leading-snug text-ink">{event.title}</h3>
        <p className="text-xs text-mute">
          {formatDateTime(new Date(event.startDateTime))} · {event.location}
        </p>
        <p className="text-sm font-semibold text-accent-hi">{formatBRL(event.ticketPrice)}</p>
      </div>
    </Link>
  )
}