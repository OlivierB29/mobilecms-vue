const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/mobilecmsapi/v50'
const contentApi = `${apiBaseUrl}/webapi/content`

async function handleResponse(response : any) {
  if (!response.ok) {
    const body = await response.text()
    throw new Error(`API error ${response.status}: ${response.statusText} ${body}`)
  }
  return response.json()
}

export function getContentList(type : string) {
  return fetch(`${contentApi}/${type}`)
    .then(handleResponse)
}

export function getContentById(type : string, id : string) {
  return fetch(`${contentApi}/${type}/${encodeURIComponent(id)}`)
    .then(handleResponse)
}

export function getDescriptionHead() {
  return fetch(`${contentApi}/theme/theme`)
    .then(handleResponse)
}
