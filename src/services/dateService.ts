/** Format a content date without shifting its calendar day through a timezone conversion. */
export function formatDate(value: string | null | undefined): string {
  const raw = value?.trim()
  if (!raw) return '—'

  const iso = /^(\d{4})-(\d{2})-(\d{2})(?:$|[T\s])/.exec(raw)
  const french = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(raw)
  if (iso || french) {
    const year = Number(iso ? iso[1] : french![3])
    const month = Number(iso ? iso[2] : french![2])
    const day = Number(iso ? iso[3] : french![1])
    const check = new Date(0)
    check.setUTCFullYear(year, month - 1, day)
    if (check.getUTCFullYear() !== year || check.getUTCMonth() !== month - 1 || check.getUTCDate() !== day) return '—'
    return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${String(year).padStart(4, '0')}`
  }

  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(date)
}

export type DateBearingItem = {
  date?: string
  datetime?: string
  enddate?: string
  updated?: string
  created?: string
}

export function getItemDate(item: DateBearingItem): string {
  return String(item.date || item.datetime || item.enddate || item.updated || item.created || '')
}

export function getItemTimestamp(item: DateBearingItem): number {
  return Date.parse(getItemDate(item))
}

export function getTodayTimestamp(): number {
  const today = new Date()
  return new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime()
}

export function isSameDate(first?: string, second?: string): boolean {
  return Boolean(first && second && formatDate(first) === formatDate(second))
}

export function sortEvents<T extends DateBearingItem>(items: T[], direction: 'asc' | 'desc' = 'asc'): T[] {
  const multiplier = direction === 'asc' ? 1 : -1
  return [...items].sort((a, b) => (getItemTimestamp(a) - getItemTimestamp(b)) * multiplier)
}

export function splitEventsByDate<T extends DateBearingItem>(items: T[]): { upcoming: T[]; past: T[] } {
  const today = getTodayTimestamp()
  return {
    upcoming: sortEvents(items.filter((item) => getItemTimestamp(item) >= today)),
    past: sortEvents(items.filter((item) => getItemTimestamp(item) < today), 'desc')
  }
}

export function filterEventsInWindow<T extends DateBearingItem>(items: T[], pastMonths = 2, futureYears = 1): T[] {
  const now = new Date()
  const pastBound = new Date(now)
  pastBound.setMonth(pastBound.getMonth() - pastMonths)
  const futureBound = new Date(now)
  futureBound.setFullYear(futureBound.getFullYear() + futureYears)

  return items.filter((item) => {
    const timestamp = getItemTimestamp(item)
    return !Number.isNaN(timestamp) && timestamp >= pastBound.getTime() && timestamp <= futureBound.getTime()
  })
}
