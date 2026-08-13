import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { Alert } from '@/components/ui/Alert'
import { TicketCard } from '@/components/TicketCard'
import { getSharedTicket } from '@/services/tickets'

export function TicketSharePage() {
  const { token } = useParams<{ token: string }>()
  const {
    data: ticket,
    isPending,
    isError
  } = useQuery({
    queryKey: ['shared-ticket', token],
    queryFn: () => getSharedTicket(token!),
    retry: false
  })

  return (
    <div className="min-h-dvh">
      <main className="mx-auto max-w-md px-4 py-14">
        <Link to="/cliente" className="text-sm text-mute transition-colors hover:text-ink">
          ← Voltar ao catálogo
        </Link>
        <p className="text-center text-[10px] uppercase tracking-widest mt-5 text-mute">Ingresso compartilhado</p>
        {isPending && <div className="mt-6 h-72 animate-pulse rounded-xl bg-raised" />}
        {isError && (
          <Alert tone="danger" className="mt-6">
            Link inválido ou expirado.
          </Alert>
        )}
        {ticket && (
          <div className="mt-6">
            <TicketCard
              ticket={ticket}
              footer={
                <span className="text-right text-[10px] uppercase tracking-wider text-mute">
                  Apresente este QR na portaria.
                </span>
              }
            />
          </div>
        )}
      </main>
    </div>
  )
}
