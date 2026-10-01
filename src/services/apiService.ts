import type { ContentItem, SiteMetadata } from '../model/content'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/mobilecmsapi/v50'
const contentApi = `${apiBaseUrl}/webapi/content`

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text()
    throw new Error(`API error ${response.status}: ${response.statusText} ${body}`)
  }
  return response.json() as Promise<T>
}

export function getContentList<T extends ContentItem = ContentItem>(type: string): Promise<T[]> {
  return fetch(`${contentApi}/${type}`)
    .then((response) => handleResponse<T[]>(response))
}

export function getContentById<T extends ContentItem = ContentItem>(type: string, id: string): Promise<T> {
  return fetch(`${contentApi}/${type}/${encodeURIComponent(id)}`)
    .then((response) => handleResponse<T>(response))
}

export function getDescriptionHead(): Promise<SiteMetadata> {
  return fetch(`${contentApi}/theme/theme`)
    .then((response) => handleResponse<SiteMetadata>(response))
}
