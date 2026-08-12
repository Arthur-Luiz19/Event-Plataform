export type Role = 'ORGANIZER' | 'CLIENT' | 'GATE'

export type SessionUser = {
  userId: string
  name: string
  email: string
  role: Role
}

export type Session = {
  token: string
  user: SessionUser
}

const KEY = 'plataforma-eventos.session'

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Session) : null
  } catch {
    return null
  }
}
export function setSession(s: Session) {
  localStorage.setItem(KEY, JSON.stringify(s))
}
export function clearSession() {
  localStorage.removeItem(KEY)
}

export function roleHome(role: Role): string {
  if (role === 'ORGANIZER') return '/organizador'
  if (role === 'CLIENT') return '/cliente'
  if (role === 'GATE') return '/portaria'

  return '/'
}
