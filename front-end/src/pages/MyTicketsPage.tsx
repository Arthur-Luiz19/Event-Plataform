import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppHeader } from '@/components/layout/AppHeader'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { TicketCard } from '@/components/TicketCard'
import { useMyTickets } from '@/features/tickets/hooks/useTickets'
import { apiErrorMessage } from '@/lib/http'
import type { TicketView } from '@/services/tickets'

export function MyTicketsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const justPaid = Boolean((location.state as { justPaid?: boolean } | null)?.justPaid)
  const { data: tickets = [], isPending, isError, error, refetch } = useMyTickets()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  async function share(t: TicketView) {
    await navigator.clipboard.writeText(`${window.location.origin}/compartilhar/${t.shareToken}`)
    setCopiedId(t.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-dvh">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="font-display text-4xl text-ink">Meus ingressos</h1>
        {justPaid && (
          <Alert tone="ok" className="mt-6">
            Pagamento aprovado — ingressos gerados. Boa sessão!
          </Alert>
        )}
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
              <div key={i} className="h-56 animate-pulse rounded-xl bg-raised" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          <div className="mt-6 rounded-xl border border-line bg-surface p-10 text-center">
            <p className="text-sm text-mute">Você ainda não tem ingressos.</p>
            <Button className="mt-4" onClick={() => navigate('/cliente')}>
              Ver eventos em cartaz
            </Button>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {tickets.map((t) => (
              <TicketCard
                key={t.id}
                ticket={t}
                footer={
                  <Button variant="ghost" className="text-accent-hi" onClick={() => share(t)}>
                    {copiedId === t.id ? 'Link copiado!' : 'Compartilhar'}
                  </Button>
                }
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
