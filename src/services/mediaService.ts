import type { ContentItem, MediaEntry } from '../model/content'

const mediaBaseUrl = import.meta.env.VITE_MEDIA_BASE_URL || '/media'

function ensureAbsoluteUrl(value : string | null | undefined) {
  if (!value) return ''
  const url = value.toString()
  if (url.startsWith('http') || url.startsWith('//')) {
    return url
  }
  return url
}

function resolveMediaUrl(type: string, id: string, entry: MediaEntry): string {
  const url = entry.url || entry.path || ''
  const normalized = url.toString()
  if (normalized.startsWith('http') || normalized.startsWith('//')) {
    return normalized
  }
  return `${mediaBaseUrl}/${type}/${id}/${normalized}`
}

export function initMediaUrl(type: string, id: string, media: MediaEntry[]): MediaEntry[] {
  if (!media) {
    return []
  }

  return media.map((entry) => {
    return {
      ...entry,
      url: resolveMediaUrl(type, id, entry)
    }
  })
}

export function initItemMedia<T extends ContentItem>(type: string, id: string, item: T): T {
  return {
    ...item,
    media: Array.isArray(item.media) ? initMediaUrl(type, id, item.media) : item.media,
    images: Array.isArray(item.images) ? initMediaUrl(type, id, item.images) : item.images,
    attachments: Array.isArray(item.attachments) ? initMediaUrl(type, id, item.attachments) : item.attachments
  } as T
}

export function isImage(entry: MediaEntry): boolean {
  return !!entry && typeof entry.mimetype === 'string' && entry.mimetype.includes('image')
}

export function isVideo(entry: MediaEntry): boolean {
  if (!entry || !entry.url) {
    return false
  }
  const url = entry.url.toString()
  return (
    (entry.mimetype && entry.mimetype.includes('video')) ||
    url.includes('youtu') ||
    url.includes('vimeo') ||
    (url.includes('facebook') && url.includes('videos'))
  )
}

export function getImages(item: ContentItem): MediaEntry[] {
  const result: MediaEntry[] = []

  if (item && Array.isArray(item.images)) {
    result.push(...item.images.filter(isImage).map((img) => ({ ...img, url: ensureAbsoluteUrl(img.url || img.path || '') })))
  }

  if (item && Array.isArray(item.media)) {
    result.push(...item.media.filter(isImage))
  }

  return result
}

export function getAttachments(item: ContentItem): MediaEntry[] {
  const result: MediaEntry[] = []

  if (item && Array.isArray(item.attachments)) {
    result.push(...item.attachments)
  }

  if (item && Array.isArray(item.media)) {
    result.push(...item.media.filter((entry) => !isImage(entry)))
  }

  return result
}
