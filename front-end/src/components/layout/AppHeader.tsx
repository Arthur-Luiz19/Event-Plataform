import { Link, useNavigate } from 'react-router-dom'
import { roleHome, type Role } from '@/contexts/session'
import { useAuth } from '@/contexts/useAuth'

const roleLabel: Record<Role, string> = {
  ROLE_CLIENT: 'Cliente',
  ROLE_ORGANIZER: 'Organizador',
  ROLE_GATE: 'Portaria'
}

export function AppHeader() {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    signOut()
    navigate('/entrar')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        {/* Marca → home do papel */}
        <div aria-hidden className="pointer-events-none absolute -left-72 -top-92 size-196 rounded-full bg-accent/15 blur-3xl" />
        <Link to={session ? roleHome(session.user.role) : '/entrar'} className="inline-block font-display text-3xl text-ink transition-all duration-200 hover:scale-125 hover:text-accent-hi">
          Cine <span className="text-accent-hi transition-colors">Noir</span>
        </Link>

        {session ? (
          <>
            {/* Navegação por papel */}
            <nav className="flex items-center gap-5 text-sm text-mute">
              {session.user.role === 'ROLE_CLIENT' && (
                <>
                  <Link to="/cliente" className="transition-colors hover:text-ink">
                    Catálogo
                  </Link>
                  <Link to="/cliente/ingressos" className="transition-colors hover:text-ink">
                    Meus ingressos
                  </Link>
                  <Link to="/cliente/reservas" className="transition-colors hover:text-ink">
                    Minhas reservas
                  </Link>
                </>
              )}
              {session.user.role === 'ROLE_ORGANIZER' && (
                <Link to="/organizador" className="transition-colors hover:text-ink">
                  Painel
                </Link>
              )}
              {session.user.role === 'ROLE_GATE' && (
                <Link to="/portaria" className="transition-colors hover:text-ink">
                  Portaria
                </Link>
              )}
            </nav>

            {/* Identidade + sair */}
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 sm:flex">
                <span className="max-w-40 truncate text-sm text-ink">{session.user.name}</span>
                <span className="rounded-full border border-line px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-accent-hi">{roleLabel[session.user.role]}</span>
              </div>
              <button type="button" onClick={handleLogout} className="rounded-lg border border-line px-3 py-1.5 text-sm text-mute transition-colors hover:border-err/50 hover:text-err">
                Sair
              </button>
            </div>
          </>
        ) : (
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/entrar" className="text-mute transition-colors hover:text-ink">
              Entrar
            </Link>
            <Link to="/cadastro" className="rounded-lg border border-accent/50 px-3 py-1.5 text-accent-hi transition-colors hover:bg-accent/10">
              Criar conta
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
