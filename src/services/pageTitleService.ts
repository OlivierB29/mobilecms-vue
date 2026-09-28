const siteName = 'CRKDR Bretagne'

export function formatPageTitle(title?: string): string {
  return title ? `${title} — ${siteName}` : siteName
}

export function setPageTitle(title?: string): void {
  document.title = formatPageTitle(title)
}
