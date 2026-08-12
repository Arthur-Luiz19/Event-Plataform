const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function formatBRL(value: number) {
  return brl.format(value)
}

const dateTime = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
})

export function formatDateTime(date?: Date) {
  if (!date || Number.isNaN(date.getTime())) return 'Data a definir'
  return dateTime.format(date)
}
