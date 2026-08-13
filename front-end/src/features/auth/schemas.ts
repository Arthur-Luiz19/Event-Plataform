import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email('Informe um e-mail válido.'),
  password: z.string().min(4, 'A senha tem no mínimo 4 caracteres.'),
})
export type LoginInput = z.infer<typeof loginSchema>

export const registerSchema = z
  .object({
    name: z.string().trim().min(3, 'Informe seu nome.'),
    email: z.email('Informe um e-mail válido.'),
    password: z.string().min(4, 'A senha tem no mínimo 4 caracteres.'),
  })

export type RegisterInput = z.infer<typeof registerSchema>