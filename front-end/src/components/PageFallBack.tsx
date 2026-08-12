export function PageFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-bg">
      <div className="size-8 animate-spin rounded-full border-2 border-line border-t-accent" role="status" aria-label="Carregando página…" />
    </div>
  )
}
