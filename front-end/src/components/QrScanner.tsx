import { Html5Qrcode } from 'html5-qrcode'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/Button'

export function QrScanner({ onDecode }: { onDecode: (text: string) => void }) {
  const [running, setRunning] = useState(false)
  const [failed, setFailed] = useState(false)
  const engineRef = useRef<Html5Qrcode | null>(null)
  const decodeRef = useRef(onDecode)

  useEffect(() => {
    decodeRef.current = onDecode
  }, [onDecode])


  useEffect(
    () => () => {
      engineRef.current?.stop().catch(() => {})
    },
    []
  )

  async function toggle() {
    if (running) {
      await engineRef.current?.stop().catch(() => {})
      engineRef.current = null
      setRunning(false)
      return
    }
    try {
      const engine = new Html5Qrcode('gate-qr-reader')
      engineRef.current = engine
      await engine.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (text) => decodeRef.current(text),
        () => {}
      )
      setFailed(false)
      setRunning(true)
    } catch {
      setFailed(true) // sem câmera → fallback manual continua visível
    }
  }

  return (
    <section className="rounded-xl border border-line bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-xl text-ink">Câmera</h2>
        <Button type="button" variant="outline" onClick={toggle}>
          {running ? 'Desligar câmera' : 'Ligar câmera'}
        </Button>
      </div>
      <div id="gate-qr-reader" className={running ? 'overflow-hidden rounded-lg' : 'hidden'} />
      {!running && !failed && <p className="py-6 text-center text-xs text-mute">Câmera parada — ligue acima ou digite o código abaixo.</p>}
      {failed && <p className="py-6 text-center text-xs text-warn">Câmera indisponível neste dispositivo — use a digitação manual abaixo.</p>}
    </section>
  )
}
