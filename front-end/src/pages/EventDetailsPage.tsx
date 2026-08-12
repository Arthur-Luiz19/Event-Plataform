import { Link, useNavigate, useParams } from 'react-router-dom'
import { AppHeader } from '@/components/layout/AppHeader'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/useAuth'
import { useEvent } from '@/features/clients/hooks/useEvents'
import { formatBRL, formatDateTime } from '@/lib/format'

export function EventDetailsPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const { session } = useAuth()
  const { data: event, isPending, isError, refetch } = useEvent(eventId)
  const navigate = useNavigate()
  const isClient = session?.user.role === 'ROLE_CLIENT'

  return (
    <div className="min-h-dvh bg-bg">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <Link to="/cliente" className="inline-flex items-center gap-1 text-sm text-mute transition-colors hover:text-ink">
          ← Voltar ao catálogo
        </Link>

        {/* Skeleton */}
        {isPending && (
          <div className="mt-6 grid gap-8 md:grid-cols-[320px_1fr]">
            <div className="aspect-[2/3] animate-pulse rounded-xl bg-raised" />
            <div className="space-y-3">
              <div className="h-10 w-2/3 animate-pulse rounded bg-raised" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-raised" />
              <div className="h-24 animate-pulse rounded bg-raised" />
            </div>
          </div>
        )}

        {/* Erro com retry */}
        {isError && (
          <Alert tone="danger" className="mt-6">
            Não foi possível carregar este evento.{' '}
            <button className="font-semibold underline" onClick={() => refetch()}>
              Tentar novamente
            </button>
          </Alert>
        )}

        {/* Conteúdo */}
        {event && !isPending && (
          <div className="mt-6 grid gap-8 md:grid-cols-[320px_1fr]">
            {/* Pôster */}
            <div className="overflow-hidden rounded-xl border border-line bg-raised">
              {event.posterUrl ? (
                <img
                  src={event.posterUrl}
                  alt={`Pôster de ${event.title}`}
                  className="aspect-[2/3] w-full object-cover"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                  }}
                />
              ) : (
                <div className="flex aspect-[2/3] w-full items-center justify-center bg-gradient-to-b from-raised to-bg p-6">
                  <span className="text-center font-display text-2xl text-mute">{event.title}</span>
                </div>
              )}
            </div>

            {/* Detalhes */}
            <div>
              <span className="rounded-full border border-line px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-hi">Em cartaz</span>
              <h1 className="mt-3 font-display text-4xl text-ink">{event.title}</h1>

              <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-mute">Data | Hora</dt>
                  <dd className="mt-1 font-semibold text-ink">{formatDateTime(new Date(event.startDateTime))}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-mute">Local</dt>
                  <dd className="mt-1 font-semibold text-ink">{event.location}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-mute">Ingresso</dt>
                  <dd className="mt-1 font-semibold text-accent-hi">{formatBRL(event.ticketPrice)}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-mute">Disponíveis</dt>
                  <dd className="mt-1 font-semibold text-ink">{event.capacity}</dd>
                </div>
              </dl>

              {event.description && (
                <div className="mt-8">
                  <h2 className="font-display text-xl text-ink">Sobre o filme</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-mute">{event.description}</p>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3">
                <Button disabled={!isClient} onClick={() => navigate(`/cliente/eventos/${event.id}/reserva`)}>
                  Reservar ingresso
                </Button>

                {!session && (
                  <p className="text-xs text-mute">
                    <Link to="/entrar" className="text-accent-hi underline">
                      Entre na sua conta
                    </Link>{' '}
                    para reservar.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
