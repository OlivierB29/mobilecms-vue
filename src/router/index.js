import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import NewsPreview from '../pages/NewsPreview.vue'
import NewsDetails from '../pages/NewsDetails.vue'
import ClubActivities from '../pages/ClubActivities.vue'
import ClubDetail from '../pages/ClubDetail.vue'
import ClubMap from '../pages/ClubMap.vue'
import CalendarActivities from '../pages/CalendarActivities.vue'
import CalendarEvent from '../pages/CalendarEvent.vue'
import GoogleCalendar from '../pages/GoogleCalendar.vue'
import ItemsPage from '../pages/ItemsPage.vue'
import ItemDetails from '../pages/ItemDetails.vue'
import NotFound from '../pages/NotFound.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/news', name: 'News', component: NewsPreview },
  { path: '/news/:id', name: 'NewsDetails', component: NewsDetails, props: true },
  { path: '/actualites', name: 'Actualites', component: NewsPreview },
  { path: '/actualites/:id', name: 'ActualitesDetails', component: NewsDetails, props: true },

  { path: '/clubs', name: 'Clubs', component: ClubActivities },
  { path: '/clubactivities', name: 'ClubActivities', component: ClubActivities },
  { path: '/clubmap', name: 'ClubMap', component: ClubMap },
  { path: '/clubmap/:activity', name: 'ClubMapActivity', component: ClubMap, props: true },
  { path: '/club/:id', name: 'ClubDetail', component: ClubDetail, props: true },
  { path: '/clubs/:activity', name: 'ClubsActivity', component: ClubActivities, props: true },

  { path: '/calendar', name: 'Calendar', component: GoogleCalendar },
  { path: '/calendrier', name: 'Calendrier', component: GoogleCalendar },
  { path: '/googlecalendar', name: 'GoogleCalendar', component: GoogleCalendar },
  { path: '/calendriergoogle', name: 'CalendrierGoogle', component: GoogleCalendar },
  { path: '/calendar/:activity', name: 'CalendarActivities', component: CalendarActivities, props: true },
  { path: '/calendrier/:activity', name: 'CalendrierActivities', component: CalendarActivities, props: true },
  { path: '/calendar/detail/:id', name: 'CalendarEvent', component: CalendarEvent, props: true },
  { path: '/calendrier/detail/:id', name: 'CalendrierEvent', component: CalendarEvent, props: true },

  { path: '/structure', name: 'Structure', component: ItemsPage, props: { type: 'structure' } },
  { path: '/structure/:id', name: 'StructureDetails', component: ItemDetails, props: route => ({ type: 'structure', id: route.params.id }) },
  { path: '/organisation', name: 'Organisation', component: ItemsPage, props: { type: 'structure' } },
  { path: '/organisation/:id', name: 'OrganisationDetails', component: ItemDetails, props: route => ({ type: 'structure', id: route.params.id }) },
  { path: '/contact', name: 'Contact', component: ItemsPage, props: { type: 'contacts' } },
  { path: '/contact/:id', name: 'ContactDetails', component: ItemDetails, props: route => ({ type: 'contacts', id: route.params.id }) },
  { path: '/reports', name: 'Reports', component: ItemsPage, props: { type: 'reports' } },
  { path: '/comptesrendus', name: 'ComptesRendus', component: ItemsPage, props: { type: 'reports' } },
  { path: '/reports/:id', name: 'ReportDetails', component: ItemDetails, props: route => ({ type: 'reports', id: route.params.id }) },
  { path: '/comptesrendus/:id', name: 'ComptesRendusDetails', component: ItemDetails, props: route => ({ type: 'reports', id: route.params.id }) },
  { path: '/links', name: 'Links', component: ItemsPage, props: { type: 'links' } },
  { path: '/liens', name: 'Liens', component: ItemsPage, props: { type: 'links' } },
  { path: '/links/:id', name: 'LinkDetails', component: ItemDetails, props: route => ({ type: 'links', id: route.params.id }) },
  { path: '/liens/:id', name: 'LienDetails', component: ItemDetails, props: route => ({ type: 'links', id: route.params.id }) },
  { path: '/documents', name: 'Documents', component: ItemsPage, props: { type: 'documents' } },
  { path: '/documents/:id', name: 'DocumentDetails', component: ItemDetails, props: route => ({ type: 'documents', id: route.params.id }) },

  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
