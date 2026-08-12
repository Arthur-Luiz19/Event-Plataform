import type { ComponentProps } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'outline' | 'ghost'
type Props = ComponentProps<'button'> & { variant?: Variant; loading?: boolean }

const styles: Record<Variant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-hi',
  outline: 'border border-line-strong text-ink hover:border-accent hover:text-accent-hi',
  ghost: 'text-mute hover:text-ink'
}

export function Button({ variant = 'primary', loading, className, children, disabled, ...rest }: Props) {
  return (
    <button className={cn('inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-colors', 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent', 'disabled:cursor-not-allowed disabled:opacity-60', styles[variant], className)} disabled={disabled || loading} {...rest}>
      {loading && (
        <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      )}
      {children}
    </button>
  )
}
