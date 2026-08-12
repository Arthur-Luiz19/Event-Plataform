import { cn } from '@/lib/cn'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('font-display text-2xl font-semibold tracking-tight', className)}>
      <span className="text-ink">Cine</span>
      <span className="text-accent">Noir</span>
    </span>
  )
}
