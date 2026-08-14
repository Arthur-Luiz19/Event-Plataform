import { useRef, useState } from 'react'
import { AppHeader } from '@/components/layout/AppHeader'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/Input'
import { QrScanner } from '@/features/gate/QrScanner'
import { useGateValidation } from '@/features/gate/hooks/useGateValidation'
import { useEvents } from '@/features/clients/hooks/useEvents'
import { formatDateTime } from '@/lib/format'
import { apiErrorMessage } from '@/lib/http'
import type { GateOutcome } from '@/services/gate'

const outcomeUi: Record<GateOutcome['kind'], { title: string; box: string; text: string }> = {
  valid: { title: 'ENTRADA LIBERADA', box: 'border-ok/50 bg-ok/10', text: 'text-ok' },
  used: { title: 'JÁ UTILIZADO', box: 'border-warn/50 bg-warn/10', text: 'text-warn' },
  invalid: { title: 'CÓDIGO INVÁLIDO', box: 'border-err/50 bg-err/10', text: 'text-err' },
  'wrong-event': { title: 'EVENTO ERRADO', box: 'border-accent/50 bg-accent/10', text: 'text-accent-hi' }
}

type ScanRecord = { code: string; outcome: GateOutcome; at: Date }

export function GatePage() {
  const { data: events = [] } = useEvents()
  const [eventId, setEventId] = useState('')
  const [manualCode, setManualCode] = useState('')
  const [notice, setNotice] = useState<string | null>(null)
  const [history, setHistory] = useState<ScanRecord[]>([])
  const validation = useGateValidation()
  const lastScanRef = useRef<{ code: string; at: number } | null>(null)

  function validate(code: string) {
    if (!eventId) {
      setNotice('Selecione a sessão em atendimento antes de validar.')
      return
    }
    setNotice(null)
    validation.mutate(
      { code, eventId },
      {
        onSuccess: (outcome) => setHistory((h) => [{ code, outcome, at: new Date() }, ...h].slice(0, 8))
      }
    )
  }

  function handleScan(code: string) {
    const now = Date.now()
    if (lastScanRef.current?.code === code && now - lastScanRef.current.at < 5000) return
    lastScanRef.current = { code, at: now }
    validate(code)
  }

  const last = history[0]

  return (
    <div className="min-h-dvh">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-8">
          <span className="rounded-full border border-line px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-mute">Portaria</span>
          <h1 className="mt-3 font-display text-4xl text-ink">Validação de ingresso</h1>
        </header>

        {/* Sessão em atendimento — habilita o caso "evento errado" */}
        <div className="mb-6 max-w-md">
          <Label htmlFor="gate-event">Sessão em atendimento</Label>
          <select id="gate-event" value={eventId} onChange={(e) => setEventId(e.target.value)} className="h-11 w-full rounded-lg border border-line bg-surface px-4 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25">
            <option value="">Selecione o evento…</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title} · {formatDateTime(new Date(e.startDateTime))}
              </option>
            ))}
          </select>
          {!eventId && <p className="mt-1.5 text-xs text-warn">Selecione a sessão para começar a validar.</p>}
        </div>

        {notice && <p className="mb-6 rounded-lg border border-warn/50 bg-warn/10 px-4 py-3 text-xs text-warn">{notice}</p>}

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {/* Resultado da última leitura — grande, legível a 2 metros */}
            {last && (
              <div className={`rounded-xl border p-8 text-center ${outcomeUi[last.outcome.kind].box}`}>
                <p className={`font-display text-4xl ${outcomeUi[last.outcome.kind].text}`}>{outcomeUi[last.outcome.kind].title}</p>
                <p className="mt-3 break-all font-mono text-sm text-mute">{last.code}</p>
                {last.outcome.kind === 'valid' && (
                  <p className="mt-2 text-sm text-mute">
                    {last.outcome.data.clientName} · <strong className="text-ink">{last.outcome.data.eventTitle}</strong>
                  </p>
                )}
                {last.outcome.kind === 'wrong-event' && last.outcome.data && (
                  <p className="mt-2 text-sm text-mute">
                    Este ingresso é de <strong className="text-ink">{last.outcome.data.eventTitle}</strong>.
                  </p>
                )}
              </div>
            )}

            {validation.isError && <Alert tone="danger">{apiErrorMessage(validation.error)}</Alert>}

            <QrScanner onDecode={handleScan} />

            {/* Fallback manual — sempre visível (exigência do PDF) */}
            <section className="rounded-xl border border-line bg-surface p-5">
              <h2 className="mb-4 font-display text-xl text-ink">Digitação manual</h2>
              <form
                className="flex flex-col gap-3 sm:flex-row sm:items-end"
                onSubmit={(e) => {
                  e.preventDefault()
                  validate(manualCode.trim())
                  setManualCode('')
                }}
              >
                <div className="flex-1">
                  <Label htmlFor="gate-code">Código do ingresso</Label>
                  <Input id="gate-code" value={manualCode} onChange={(e) => setManualCode(e.target.value)} placeholder="CN-XXXX-XXXX" className="font-mono" disabled={!eventId} />
                </div>
                <Button type="submit" loading={validation.isPending} disabled={!eventId || !manualCode.trim()}>
                  Validar
                </Button>
              </form>
            </section>
          </div>

          {/* Histórico — auditoria rápida para o porteiro */}
          <aside className="h-fit rounded-xl border border-line bg-surface p-5 lg:sticky lg:top-20">
            <h2 className="mb-4 font-display text-xl text-ink">Últimas leituras</h2>
            {history.length === 0 ? (
              <p className="text-sm text-mute">Nenhuma leitura ainda.</p>
            ) : (
              <ul className="space-y-2">
                {history.map((record) => (
                  <li key={`${record.code}-${record.at.getTime()}`} className={`rounded-lg border p-3 ${outcomeUi[record.outcome.kind].box}`}>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider ${outcomeUi[record.outcome.kind].text}`}>{outcomeUi[record.outcome.kind].title}</span>
                      <span className="text-[10px] text-mute">{record.at.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </div>
                    <p className="mt-1 truncate font-mono text-xs text-mute">{record.code}</p>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </main>
    </div>
  )
}
