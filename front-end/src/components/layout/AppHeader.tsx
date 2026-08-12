import { Link, useNavigate } from 'react-router-dom'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/useAuth'

export function AppHeader() {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-mute sm:flex">
            <Link className="transition-colors hover:text-ink" to="/">
              Catálogo
            </Link>
          </nav>
        </div>

        {session ? (
          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-2 text-sm text-mute sm:flex">
              {session.user.name}
            </span>
            <Button
              variant="ghost"
              onClick={() => {
                signOut()
                navigate('/entrar')
              }}
            >
              Sair
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/entrar')}>
              Entrar
            </Button>
            <Button onClick={() => navigate('/cadastro')}>Criar conta</Button>
          </div>
        )}
      </div>
    </header>
  )
}
