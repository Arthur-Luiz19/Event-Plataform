import axios from 'axios'
import { getSession } from '@/contexts/session'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
})

// Anexa o Bearer token em toda requisição autenticada (reservas, ingressos, etc.)
http.interceptors.request.use((config) => {
  const session = getSession()

  if (session) config.headers.Authorization = `Bearer ${session.token}`
  return config
})

// Traduz erros do Spring/axios em mensagem apresentável na UI
export function apiErrorMessage(err: unknown): string {

  if (axios.isAxiosError(err)) {
    const data = err.response?.data as { message?: string | string[] } | undefined

    if (Array.isArray(data?.message)) return data.message.join(' ')
      
    if (typeof data?.message === 'string') return data.message

    if (err.code === 'ERR_NETWORK')
      return 'Não foi possível falar com o servidor. Verifique se o back-end está rodando.'
  }
  return 'Erro inesperado. Tente novamente.'
}