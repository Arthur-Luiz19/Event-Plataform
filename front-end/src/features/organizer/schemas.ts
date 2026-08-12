// src/features/organizer/schemas.ts
import { z } from 'zod'

export const eventFormSchema = z.object({
  tmdbMovieId: z.number({ message: 'Busque e selecione um filme do catálogo.' }).int().positive(),
  startDateTime: z
    .string()
    .min(1, 'Defina data e horário da sessão.')
    .refine((v) => new Date(v).getTime() > Date.now(), 'A sessão deve ocorrer no futuro.'),
  location: z.string().trim().min(3, 'Informe o local do evento.'),
  capacity: z.number({ message: 'Informe a capacidade.' }).int().min(1, 'Capacidade mínima: 1 lugar.'),
  ticketPrice: z.number({ message: 'Informe o preço.' }).min(0.01, 'O preço deve ser maior que zero.')
})

// ← esta linha que estava faltando:
export type EventFormInput = z.infer<typeof eventFormSchema>
