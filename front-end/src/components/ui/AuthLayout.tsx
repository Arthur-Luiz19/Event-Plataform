import type { ReactNode } from 'react'
import { Logo } from '@/components/Logo'

const roles = [
  { title: 'Cliente', desc: 'navega, reserva e recebe o ingresso com QR.' },
  { title: 'Organizador', desc: 'publica filmes e eventos a partir do catálogo externo.' },
  { title: 'Portaria', desc: 'valida ingressos na entrada, por câmera ou código.' }
]

export function AuthLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="grid min-h-dvh bg-bg bg-bg bg-bg lg:grid-cols-[1.1fr_1fr]">
      <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-line p-10 lg:flex">
        <div aria-hidden className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-accent/15 blur-3xl" />
        <Logo />
        <div className="relative">
          <h1 className="font-display text-5xl leading-tight">
            O melhor do cinema e dos eventos, <em className="text-accent">num só lugar</em>.
          </h1>
          <ul className="mt-8 space-y-3 text-sm text-mute">
            {roles.map((r) => (
              <li key={r.title}>
                <span className="font-semibold text-ink">{r.title}</span> — {r.desc}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-mute">Demonstração técnica · Desafio Elite Dev 2026</p>
      </aside>

      <main className="flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo />
          </div>
          <h2 className="font-display text-3xl">{title}</h2>
          <p className="mt-1 text-sm text-mute">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  )
}
