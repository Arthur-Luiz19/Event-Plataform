import { zodResolver } from '@hookform/resolvers/zod'
import { useDeferredValue, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AppHeader } from '@/components/layout/AppHeader'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { FieldError, Input, Label } from '@/components/ui/Input'
import { useEvent } from '@/features/clients/hooks/useEvents'
import { useCatalogSearch, useCreateEvent, useUpdateEvent } from '../features/organizer/hooks/useOrganizer'
import { eventFormSchema, type EventFormInput } from '@/features/organizer/schemas'
import { apiErrorMessage } from '@/lib/http'
import { cn } from '@/lib/cn'

export function OrganizerEventFormPage() {
  const { eventId } = useParams<{ eventId: string }>()
  const isEdit = !!eventId
  const navigate = useNavigate()

  const { data: existing } = useEvent(eventId)
  const [movieQuery, setMovieQuery] = useState('')
  const deferredQuery = useDeferredValue(movieQuery)
  const catalog = useCatalogSearch(deferredQuery)

  const createM = useCreateEvent()
  const updateM = useUpdateEvent()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<EventFormInput>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: { tmdbMovieId: 0, startDateTime: '', location: '', capacity: 100, ticketPrice: 30 }
  })

  useEffect(() => {
    if (isEdit && existing) {
      reset({
        tmdbMovieId: existing.tmdbMovieId,
        startDateTime: existing.startDateTime.slice(0, 16),
        location: existing.location,
        capacity: existing.capacity,
        ticketPrice: existing.ticketPrice
      })
    }
  }, [isEdit, existing, reset])

  const selectedId = watch('tmdbMovieId')
  const pending = createM.isPending || updateM.isPending
  const failed = createM.isError ? createM.error : updateM.isError ? updateM.error : null

  function onSubmit(data: EventFormInput) {
    // datetime-local não manda segundos; o LocalDateTime do Spring exige
    const startDateTime = data.startDateTime.length === 16 ? `${data.startDateTime}:00` : data.startDateTime

    if (isEdit && eventId) {
      updateM.mutate(
        {
          id: eventId,
          input: {
            startDateTime,
            location: data.location,
            capacity: data.capacity,
            ticketPrice: data.ticketPrice
          }
        },
        { onSuccess: () => navigate('/organizador') }
      )
    } else {
      createM.mutate({ ...data, startDateTime }, { onSuccess: () => navigate('/organizador') })
    }
  }

  return (
    <div className="min-h-dvh bg-bg">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Link to="/organizador" className="text-sm text-mute transition-colors hover:text-ink">
          ← Voltar ao painel
        </Link>
        <h1 className="mt-3 font-display text-4xl text-ink">{isEdit ? 'Editar evento' : 'Novo evento'}</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8" noValidate>
          {/* 1. Filme do catálogo TMDb */}
          <section className="rounded-xl border border-line bg-surface p-5">
            <h2 className="font-display text-xl text-ink">1 · Filme do catálogo</h2>
            {isEdit ? (
              <p className="mt-2 text-sm text-mute">{existing?.title ?? 'Carregando…'} — o filme não muda na edição.</p>
            ) : (
              <>
                <p className="mt-1 text-sm text-mute">Busque por título ou escolha uma sugestão do catálogo. Título, sinopse e pôster vêm do TMDb.</p>
                <div className="mt-4">
                  <Input type="search" placeholder="Buscar filme no TMDb…" aria-label="Buscar filme no catálogo" value={movieQuery} onChange={(e) => setMovieQuery(e.target.value)} />
                </div>
                {catalog.isFetching && <p className="mt-3 text-xs text-mute">Buscando…</p>}
                {catalog.data && catalog.data.length === 0 && <p className="mt-3 text-xs text-mute">Nada encontrado para “{movieQuery}”.</p>}
                {catalog.data && catalog.data.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
                    {catalog.data.map((m) => (
                      <button type="button" key={m.tmdbMovieId} onClick={() => setValue('tmdbMovieId', m.tmdbMovieId, { shouldValidate: true })} className={cn('overflow-hidden rounded-lg border text-left transition-colors', selectedId === m.tmdbMovieId ? 'border-accent ring-2 ring-accent/30' : 'border-line hover:border-accent/50')}>
                        {m.posterUrl ? <img src={m.posterUrl} alt="" className="aspect-[2/3] w-full object-cover" /> : <div className="aspect-[2/3] w-full bg-raised" />}
                        <p className="truncate p-2 text-xs text-ink">{m.title}</p>
                      </button>
                    ))}
                  </div>
                )}
                <FieldError>{errors.tmdbMovieId?.message}</FieldError>
              </>
            )}
          </section>

          {/* 2. Sessão: data, local, capacidade, preço */}
          <section className="rounded-xl border border-line bg-surface p-5">
            <h2 className="font-display text-xl text-ink">2 · Detalhes da sessão</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="startDateTime">Data e horário</Label>
                <Input id="startDateTime" type="datetime-local" className="[color-scheme:dark]" invalid={!!errors.startDateTime} {...register('startDateTime')} />
                <FieldError>{errors.startDateTime?.message}</FieldError>
              </div>
              <div>
                <Label htmlFor="location">Local</Label>
                <Input id="location" placeholder="Cine Noir — Sala 1" invalid={!!errors.location} {...register('location')} />
                <FieldError>{errors.location?.message}</FieldError>
              </div>
              <div>
                <Label htmlFor="capacity">Capacidade</Label>
                <Input id="capacity" type="number" min={1} invalid={!!errors.capacity} {...register('capacity', { valueAsNumber: true })} />
                <FieldError>{errors.capacity?.message}</FieldError>
              </div>
              <div>
                <Label htmlFor="ticketPrice">Preço do ingresso (R$)</Label>
                <Input id="ticketPrice" type="number" min={0.01} step={0.5} invalid={!!errors.ticketPrice} {...register('ticketPrice', { valueAsNumber: true })} />
                <FieldError>{errors.ticketPrice?.message}</FieldError>
              </div>
            </div>
          </section>

          {failed && <Alert tone="danger">{apiErrorMessage(failed)}</Alert>}

          <div className="flex gap-3">
            <Button type="submit" loading={pending}>
              {isEdit ? 'Salvar alterações' : 'Publicar evento'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate('/organizador')}>
              Cancelar
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
