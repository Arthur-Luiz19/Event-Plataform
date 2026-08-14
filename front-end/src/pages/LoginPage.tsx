import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Alert } from '@/components/ui/Alert'
import { Button } from '@/components/ui/Button'
import { FieldError, Input, Label } from '@/components/ui/Input'
import { apiErrorMessage } from '@/lib/http'
import { login } from '@/services/auth'
import { roleHome } from '@/contexts/session'
import { useAuth } from '@/contexts/useAuth'
import { loginSchema, type LoginInput } from '@/features/auth/schemas'

export function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  })
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (session) => {
      signIn(session)
      navigate(roleHome(session.user.role), { replace: true })
    }
  })

  return (
    <AuthLayout title="Entrar" subtitle="Acesse com sua conta para continuar.">
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4" noValidate>
        {mutation.isError && <Alert tone="danger">{apiErrorMessage(mutation.error)}</Alert>}

        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" autoComplete="email" placeholder="voce@exemplo.com" invalid={!!errors.email} {...register('email')} />
          <FieldError>{errors.email?.message}</FieldError>
        </div>

        <div>
          <Label htmlFor="password">Senha</Label>
          <Input id="password" type="password" autoComplete="current-password" placeholder="••••" invalid={!!errors.password} {...register('password')} />
          <FieldError>{errors.password?.message}</FieldError>
        </div>

        <Button type="submit" loading={mutation.isPending} className="w-full">
          Entrar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-mute">
        Ainda não tem conta?{' '}
        <Link to="/cadastro" className="font-semibold text-accent-hi hover:underline">
          Criar conta
        </Link>
      </p>

      <Alert tone="warn" className="mt-8">
        <strong className="font-semibold">Contas de demonstração</strong> (Mesma senha para todos):
        <br />
        <span className="font-mono text-xs">cliente@teste.com · cliente@email.com · portaria@email.com · organizador@email.com — senha 1234</span>
      </Alert>
    </AuthLayout>
  )
}
