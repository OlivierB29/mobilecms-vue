import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { nextTick } from 'vue'
import { formatPageTitle } from '../services/pageTitleService'

import Home from '../pages/Home.vue'
import NewsPreview from '../pages/NewsPreview.vue'
import NewsDetails from '../pages/NewsDetails.vue'
import ClubActivities from '../pages/ClubActivities.vue'
import ClubDetail from '../pages/ClubDetail.vue'
import ClubMap from '../pages/ClubMap.vue'
import CalendarActivities from '../pages/CalendarActivities.vue'
import CalendarEvent from '../pages/CalendarEvent.vue'
import CalendarPage from '../pages/CalendarPage.vue'
import ItemsPage from '../pages/ItemsPage.vue'
import ItemDetails from '../pages/ItemDetails.vue'
import NotFound from '../pages/NotFound.vue'
import About from '../pages/About.vue'



const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Accueil', component: Home, meta: { title: 'Accueil' } },
  { path: '/about', name: 'About', component: About, meta: { title: 'À propos' } },
  { path: '/actualites', alias: '/news', name: 'Actualites', component: NewsPreview, meta: { title: 'Actualités' } },
  { path: '/actualites/:id', alias: '/news/:id', name: 'ActualitesDetails', component: NewsDetails, props: true, meta: { title: 'Actualité' } },

  { path: '/clubs', alias: ['/clublist', '/clubactivities'], name: 'ClubList', component: ClubActivities, meta: { title: 'Clubs' } },
  { path: '/carte', name: 'Carte', component: ClubMap, meta: { title: 'Carte des clubs' } },
  { path: '/clubs/activite/:activity', alias: '/clublist/:activity', name: 'ClubListActivity', component: ClubActivities, props: true, meta: { title: 'Clubs' } },
  { path: '/clubs/:id', alias: '/club/:id', name: 'ClubDetail', component: ClubDetail, props: true, meta: { title: 'Club' } },

  { path: '/calendrier', alias: '/calendar', name: 'Calendrier', component: CalendarPage, meta: { title: 'Calendrier' } },
  { path: '/calendrier/detail/:id', alias: '/calendar/detail/:id', name: 'CalendarEvent', component: CalendarEvent, props: true, meta: { title: 'Événement' } },
  { path: '/calendrier/:activity', alias: '/calendar/:activity', name: 'CalendarActivities', component: CalendarActivities, props: true, meta: { title: 'Événements' } },

  { path: '/organisation', alias: '/structure', name: 'Organisation', component: ItemsPage, props: { type: 'structure' }, meta: { title: 'Organisation' } },
  { path: '/organisation/:id', alias: '/structure/:id', name: 'OrganisationDetails', component: ItemDetails, props: (route) => ({ type: 'structure', id: route.params.id }), meta: { title: 'Organisation' } },
  { path: '/contact', name: 'Contact', component: ItemsPage, props: { type: 'contacts' }, meta: { title: 'Contact' } },
  { path: '/contact/:id', name: 'ContactDetails', component: ItemDetails, props: (route) => ({ type: 'contacts', id: route.params.id }), meta: { title: 'Contact' } },
  { path: '/comptesrendus', alias: '/reports', name: 'ComptesRendus', component: ItemsPage, props: { type: 'reports' }, meta: { title: 'Comptes-rendus' } },
  { path: '/comptesrendus/:id', alias: '/reports/:id', name: 'ComptesRendusDetails', component: ItemDetails, props: (route) => ({ type: 'reports', id: route.params.id }), meta: { title: 'Compte-rendu' } },
  { path: '/links', alias: '/liens', name: 'Liens', component: ItemsPage, props: { type: 'links' }, meta: { title: 'Liens' } },
  { path: '/links/:id', alias: '/liens/:id', name: 'LienDetails', component: ItemDetails, props: (route) => ({ type: 'links', id: route.params.id }), meta: { title: 'Lien' } },
  { path: '/documents', name: 'Documents', component: ItemsPage, props: { type: 'documents' }, meta: { title: 'Documents' } },
  { path: '/documents/:id', name: 'DocumentDetails', component: ItemDetails, props: (route) => ({ type: 'documents', id: route.params.id }), meta: { title: 'Document' } },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound, meta: { title: 'Page introuvable' } }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.afterEach(async (to, from) => {
  document.title = formatPageTitle(String(to.meta.title || ''))
  if (from.name) {
    await nextTick()
    document.querySelector<HTMLElement>('#main-content')?.focus({ preventScroll: true })
  }
})

export default router
