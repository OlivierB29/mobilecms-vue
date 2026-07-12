const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/mobilecmsapi/v43'
const contentApi = `${apiBaseUrl}/webapi/content`

async function handleResponse(response) {
  if (!response.ok) {
    const body = await response.text()
    throw new Error(`API error ${response.status}: ${response.statusText} ${body}`)
  }
  return response.json()
}

export function getContentList(type) {
  return fetch(`${contentApi}/${type}`)
    .then(handleResponse)
}

export function getContentById(type, id) {
  return fetch(`${contentApi}/${type}/${encodeURIComponent(id)}`)
    .then(handleResponse)
}

export function getDescriptionHead() {
  return fetch(`${contentApi}/description/head`)
    .then(handleResponse)
}
