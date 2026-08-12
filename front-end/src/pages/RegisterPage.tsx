import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/ui/AuthLayout'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { FieldError, Input, Label } from '@/components/ui/Input'
import { apiErrorMessage } from '@/lib/http'
import { register } from '@/services/auth'
import { roleHome } from '@/contexts/session'
import { useAuth } from '@/contexts/useAuth'
import { registerSchema } from '@/features/auth/schemas'

export function RegisterPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const {
    register: field,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' }
  })
  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (session) => {
      signIn(session)
      navigate(roleHome(session.user.role), { replace: true })
    }
  })

  return (
    <AuthLayout title="Criar conta" subtitle="Escolha o tipo de conta e comece.">
      <form onSubmit={handleSubmit((data) => mutation.mutate({ name: data.name, email: data.email, password: data.password }))} className="space-y-4" noValidate>
        {mutation.isError && <Alert tone="danger">{apiErrorMessage(mutation.error)}</Alert>}

        <div>
          <Label htmlFor="name">Nome completo</Label>
          <Input id="name" autoComplete="name" placeholder="Maria Silva" invalid={!!errors.name} {...field('name')} />
          <FieldError>{errors.name?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" invalid={!!errors.email} {...field('email')} />
          <FieldError>{errors.email?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" autoComplete="new-password" placeholder="Mínimo 4 caracteres" invalid={!!errors.password} {...field('password')} />
          <FieldError>{errors.password?.message}</FieldError>
        </div>

        <Button type="submit" loading={mutation.isPending} className="w-full">
          Criar conta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-mute">
        Já tem conta?{' '}
        <Link to="/entrar" className="font-semibold text-accent-hi hover:underline">
          Entrar
        </Link>
      </p>

      <p className="mt-4 text-center text-xs text-mute">
        Novos cadastros criam contas de <strong>Cliente</strong>. Contas de <strong>Organizador</strong> e <strong>Portaria</strong> são semeadas no back-end.
      </p>
    </AuthLayout>
  )
}
