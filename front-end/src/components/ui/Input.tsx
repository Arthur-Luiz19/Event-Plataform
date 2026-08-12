import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

export function Label({ className, ...rest }: ComponentProps<'label'>) {
  return <label className={cn('mb-1.5 block text-xs font-semibold uppercase tracking-wider text-mute', className)} {...rest} />
}

export function Input({ className, invalid, ...rest }: ComponentProps<'input'> & { invalid?: boolean }) {
  return <input className={cn('h-11 w-full rounded-lg border border-line bg-surface px-4 text-sm text-ink placeholder:text-mute/60', 'focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25', invalid && 'border-err focus:border-err focus:ring-err/25', className)} {...rest} />
}

export function FieldError({ children }: { children?: string }) {
  if (!children) return null
  return <p className="mt-1.5 text-xs text-err">{children}</p>
}
