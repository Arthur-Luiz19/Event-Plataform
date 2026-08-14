import { Html5Qrcode } from 'html5-qrcode'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'

export function QrScanner({ onDecode }: { onDecode: (text: string) => void }) {
  const [running, setRunning] = useState(false)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const engineRef = useRef<Html5Qrcode | null>(null)
  const decodeRef = useRef(onDecode)

  useEffect(() => {
    decodeRef.current = onDecode
  }, [onDecode])

  useEffect(
    () => () => {
      engineRef.current?.stop().catch(() => {})
      engineRef.current = null
    },
    []
  )

  async function stop() {
    try {
      await engineRef.current?.stop()
      engineRef.current?.clear()
    } catch {
      /* câmera já estava desligada */
    }
    engineRef.current = null
    setRunning(false)
  }

  async function start() {
    setError(null)
    setStarting(true)
    // CORREÇÃO: o container precisa estar VISÍVEL no DOM antes do start
    // (1 tick para o React aplicar a classe antes de montar o vídeo)
    await new Promise((resolve) => setTimeout(resolve, 0))
    try {
      const engine = new Html5Qrcode('gate-qr-reader')
      engineRef.current = engine
      await engine.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (text) => decodeRef.current(text),
        () => {}
      )
      setRunning(true)
    } catch (e) {
      engineRef.current = null
      setError(cameraErrorMessage(e))
    } finally {
      setStarting(false)
    }
  }

  return (
    <section className="rounded-xl border border-line bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl text-ink">Câmera</h2>
        <Button type="button" variant="outline" disabled={starting} onClick={() => (running ? stop() : start())}>
          {starting ? 'Abrindo câmera…' : running ? 'Desligar câmera' : 'Ligar câmera'}
        </Button>
      </div>

      {/* visível durante starting E running — nunca durante o start() */}
      <div id="gate-qr-reader" className={running || starting ? 'overflow-hidden rounded-lg' : 'hidden'} />

      {!running && !starting && !error && <p className="py-6 text-center text-xs text-mute">Câmera parada — ligue acima ou digite o código abaixo.</p>}

      {error && (
        <div className="py-4 text-center">
          <p className="text-xs text-warn">{error}</p>
          <p className="mt-1 text-xs text-mute">Siga com a digitação manual abaixo.</p>
        </div>
      )}
    </section>
  )
}

function cameraErrorMessage(e: unknown): string {
  const name = e instanceof DOMException ? e.name : ''
  switch (name) {
    case 'NotAllowedError':
      return 'Permissão de câmera negada — toque no cadeado da barra de endereço, permita a câmera e tente de novo.'
    case 'NotFoundError':
    case 'OverconstrainedError':
      return 'Nenhuma câmera encontrada neste dispositivo.'
    case 'NotReadableError':
      return 'A câmera está em uso por outro aplicativo — feche e tente de novo.'
    case 'SecurityError':
      return 'Contexto inseguro — a câmera exige HTTPS.'
    default:
      return 'Não foi possível abrir a câmera neste dispositivo.'
  }
}
