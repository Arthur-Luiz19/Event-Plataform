import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Tone = 'danger' | 'warn' | 'ok' | 'info'
const tones: Record<Tone, string> = {
  danger: 'border-err/40 bg-err/10 text-err',
  warn: 'border-warn/40 bg-warn/10 text-warn',
  ok: 'border-ok/40 bg-ok/10 text-ok',
  info: 'border-line bg-surface text-mute'
}

export function Alert({ tone = 'info', className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return (
    <div role={tone === 'danger' ? 'alert' : 'status'} className={cn('rounded-lg border px-4 py-3 text-sm', tones[tone], className)}>
      {children}
    </div>
  )
}
