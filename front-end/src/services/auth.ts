import type { Role, Session } from '@/contexts/session'
import type { LoginInput, RegisterInput } from '@/features/auth/schemas'
import { http } from '@/lib/http'

type AuthResponse = {
  token: string
  userId: string
  name: string
  email: string
  role: Role
}

function toSession(auth: AuthResponse): Session {
  return {
    token: auth.token,
    user: { userId: auth.userId, name: auth.name, email: auth.email, role: auth.role }
  }
}

export const login = (input: LoginInput) => http.post<AuthResponse>('/auth/login', input).then((r) => toSession(r.data))

export const register = (input: RegisterInput) => http.post<AuthResponse>('/auth/register', input).then((r) => toSession(r.data))
