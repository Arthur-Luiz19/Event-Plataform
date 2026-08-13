import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppHeader } from '@/components/layout/AppHeader'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { useDeleteEvent, useMyEvents } from '@/features/organizer/hooks/useOrganizer'
import { formatBRL, formatDateTime } from '@/lib/format'
import { apiErrorMessage } from '@/lib/http'

function DeleteButton({ eventId }: { eventId: string }) {
  const [confirming, setConfirming] = useState(false)
  const del = useDeleteEvent()

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" className="text-err" loading={del.isPending} onClick={() => del.mutate(eventId, { onError: () => setConfirming(false) })}>
          Confirmar exclusão
        </Button>
        <Button variant="ghost" onClick={() => setConfirming(false)}>
          Cancelar
        </Button>
      </div>
    )
  }
  return (
    <Button variant="ghost" className="text-mute" onClick={() => setConfirming(true)}>
      Excluir
    </Button>
  )
}

export function OrganizerPage() {
  const navigate = useNavigate()
  const { data: events = [], isPending, isError, error, refetch } = useMyEvents()

  return (
    <div className="min-h-dvh">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="rounded-full border border-line px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-mute">Organizador</span>
            <h1 className="mt-3 font-display text-4xl text-ink">Meus eventos</h1>
            <p className="mt-1 text-sm text-mute">
              {events.length} {events.length === 1 ? 'evento publicado' : 'eventos publicados'}
            </p>
          </div>
          <Button onClick={() => navigate('/organizador/novo')}>+ Novo evento</Button>
        </header>

        {isError && (
          <Alert tone="danger" className="mb-6">
            {apiErrorMessage(error)}{' '}
            <button className="font-semibold underline" onClick={() => refetch()}>
              Tentar novamente
            </button>
          </Alert>
        )}

        {isPending ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-raised" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-xl border border-line bg-surface p-10 text-center">
            <p className="text-sm text-mute">Você ainda não publicou nenhum evento.</p>
            <Button className="mt-4" onClick={() => navigate('/organizador/novo')}>
              Publicar primeiro evento
            </Button>
          </div>
        ) : (
          <ul className="space-y-3">
            {events.map((e) => (
              <li key={e.id} className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4">
                {e.posterUrl && <img src={e.posterUrl} alt="" className="h-16 w-11 rounded object-cover" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg text-ink">{e.title}</p>
                  <p className="text-xs text-mute">
                    {formatDateTime(new Date(e.startDateTime))} · {e.location}
                  </p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-accent-hi">{formatBRL(e.ticketPrice)}</p>
                  <p className="text-xs text-mute">{e.capacity} lugares</p>
                </div>
                <Button variant="outline" onClick={() => navigate(`/organizador/eventos/${e.id}/editar`)}>
                  Editar
                </Button>
                <DeleteButton eventId={e.id} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}
