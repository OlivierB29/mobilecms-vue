import type { ContentItem } from '../model/content'
import { getImages, initItemMedia } from './mediaService'

export function getNewsDate(item: ContentItem): string {
  return String(item.date || item.updated || item.created || item.publish_date || '')
}

export function getContentText(item: ContentItem): string {
  const text = String(item.description || item.details || item.body || item.summary || '')
  return text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function normalizeNewsItems(items: ContentItem[] | null | undefined, limit?: number): ContentItem[] {
  const normalized = (items || []).map((item) => {
    const itemId = String(item.id || item.slug || item.name || '')
    const initialized = initItemMedia('news', itemId, item) as ContentItem
    return { ...initialized, image: getImages(initialized)[0] || null }
  })

  normalized.sort((a, b) => {
    const aDate = Date.parse(getNewsDate(a))
    const bDate = Date.parse(getNewsDate(b))
    if (!Number.isNaN(aDate) && !Number.isNaN(bDate)) return bDate - aDate
    if (!Number.isNaN(aDate)) return -1
    if (!Number.isNaN(bDate)) return 1
    return String(b.id || '').localeCompare(String(a.id || ''))
  })

  return typeof limit === 'number' ? normalized.slice(0, limit) : normalized
}
