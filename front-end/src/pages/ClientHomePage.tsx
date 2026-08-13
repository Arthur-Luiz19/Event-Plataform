import { useMemo, useState } from 'react'
import { AppHeader } from '@/components/layout/AppHeader'
import { Alert } from '@/components/ui/Alert'
import { EventCard } from '@/components/ui/EventCard'
import { Input } from '@/components/ui/Input'
import { useEvents } from '@/features/clients/hooks/useEvents'
import { apiErrorMessage } from '@/lib/http'

export function ClientHomePage() {
  const [query, setQuery] = useState('')
  const { data: events = [], isPending, isError, error, refetch } = useEvents()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return events
    return events.filter((event) => [event.title, event.location, event.organizerName].some((f) => f?.toLowerCase().includes(q)))
  }, [events, query])

  return (
    <div className="min-h-dvh">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 pb-16">
        <section className="py-10 sm:py-14">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-4xl text-ink sm:text-5xl">Em cartaz agora</h1>
            <img src="/pipoca.png" alt="" className="h-8 w-8 object-contain sm:h-10 sm:w-10" />
          </div>
          <p className="mt-2 max-w-xl text-sm text-mute">Filmes e eventos culturais com reserva em poucos cliques. Busque por título, local ou organizador.</p>
          <div className="mt-6 max-w-md">
            <Input type="search" placeholder="Buscar por título, local ou organizador…" aria-label="Buscar eventos" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
        </section>

        {isError && (
          <Alert tone="danger" className="mb-6">
            {apiErrorMessage(error)}{' '}
            <button className="font-semibold underline" onClick={() => refetch()}>
              Tentar novamente
            </button>
          </Alert>
        )}

        {isPending ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-2/3 animate-pulse rounded-xl bg-raised" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl border border-line bg-surface p-10 text-center text-sm text-mute">
            {query ? (
              <>
                Nada encontrado para “{query}”.{' '}
                <button className="text-accent-hi underline" onClick={() => setQuery('')}>
                  Limpar busca
                </button>
              </>
            ) : (
              'Nenhum evento publicado ainda.'
            )}
          </div>
        ) : (
          <>
            <p className="mb-4 text-xs uppercase tracking-wider text-mute">
              {filtered.length} {filtered.length === 1 ? 'evento disponível' : 'eventos disponíveis'}
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
