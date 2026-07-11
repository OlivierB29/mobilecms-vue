export function getMenuData(lang = 'en') {
  if (lang === 'fr') {
    return [
      { id: 'news', routerLink: '/actualites', title: 'Actualités', icon: 'bi-newspaper', order: 1 },
      { id: 'clubs', routerLink: '/clubs', title: 'Clubs', icon: 'bi-geo-alt', order: 2 },
      { id: 'googlecalendar', routerLink: '/calendriergoogle', title: 'Calendriers', icon: 'bi-calendar4-range', order: 3 },
      { id: 'structure', routerLink: '/structure', title: 'Organisation', icon: 'bi-people', order: 4 },
      { id: 'documents', routerLink: '/documents', title: 'Documents', icon: 'bi-file-richtext', order: 5 },
      { id: 'reports', routerLink: '/comptesrendus', title: 'Comptes Rendus', icon: 'bi-file-text', order: 6 },
      { id: 'links', routerLink: '/links', title: 'Liens', icon: 'bi-link', order: 7 },
      { id: 'contact', routerLink: '/contact', title: 'Contact', icon: 'bi-envelope-at', order: 8 }
    ]
  }

  return [
    { id: 'news', routerLink: '/news', title: 'News', icon: 'bi-newspaper', order: 1 },
    { id: 'clubs', routerLink: '/clubs', title: 'Clubs', icon: 'bi-geo-alt', order: 2 },
    { id: 'googlecalendar', routerLink: '/googlecalendar', title: 'Calendar', icon: 'bi-calendar4-range', order: 3 },
    { id: 'structure', routerLink: '/structure', title: 'Structure', icon: 'bi-people', order: 4 },
    { id: 'documents', routerLink: '/documents', title: 'Documents', icon: 'bi-file-richtext', order: 5 },
    { id: 'reports', routerLink: '/reports', title: 'Reports', icon: 'bi-file-text', order: 6 },
    { id: 'links', routerLink: '/links', title: 'Links', icon: 'bi-link', order: 7 },
    { id: 'contact', routerLink: '/contact', title: 'Contact', icon: 'bi-envelope-at', order: 8 }
  ]
}
