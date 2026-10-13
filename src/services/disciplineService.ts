const disciplineColors: Record<string, string> = {
  chanbara: '#3f51b5',
  kendo: '#7cb342',
  iaido: '#f09300',
  jodo: '#B509B8'
}

export const disciplineLegend = [
  { name: 'Chanbara', color: disciplineColors.chanbara },
  { name: 'Kendo', color: disciplineColors.kendo },
  { name: 'Iaido', color: disciplineColors.iaido },
  { name: 'Jodo', color: disciplineColors.jodo }
] as const

function normalizeDiscipline(value?: string): string {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()
}

export function getDisciplineColor(discipline?: string, usage: 'graphic' | 'text' = 'graphic'): string {
  const normalized = normalizeDiscipline(discipline)
  const match = Object.entries(disciplineColors).find(([name]) => normalized.includes(name))
  if (usage === 'text' && match?.[0] === 'kendo') return '#598229'
  if (usage === 'text' && match?.[0] === 'iaido') return '#c54a00'
  if (usage === 'text' && match?.[0] === 'jodo') return '#B509B8'
  return match?.[1] || '#5f6368'
}
