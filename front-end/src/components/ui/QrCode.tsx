import { QRCodeSVG } from 'qrcode.react'

export function QrCode({ value, size = 120 }: { value: string; size?: number }) {
  return (
    <div className="inline-block rounded-lg bg-white p-3">
      <QRCodeSVG value={value} size={size} bgColor="#ffffff" fgColor="#0b0b0d" />
    </div>
  )
}