const API_BASE = 'http://localhost:8888/mobilecmsapi/v43/webapi/content'

export async function fetchContentList(type) {
  const response = await fetch(`${API_BASE}/${type}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${type}`)
  }
  return response.json()
}

export async function fetchContentItem(type, id) {
  const response = await fetch(`${API_BASE}/${type}/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${type}/${id}`)
  }
  return response.json()
}
