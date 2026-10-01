<template>
  <div class="home-page container py-4">
    <h1 class="visually-hidden">Accueil — CRKDR Bretagne</h1>
    <div v-if="bannerUrl" class="home-banner mb-4 text-center">
      <img :src="bannerUrl" :alt="bannerAlt" :title="siteDescription" class="img-fluid rounded" />
    </div>
    <section class="home-section">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
        <h2 class="section-title mb-0">Calendrier</h2>
        <router-link class="btn btn-outline-primary btn-sm" to="/calendrier">Tout le calendrier</router-link>
      </div>

      <div v-if="calendarLoading" class="alert alert-info" role="status">Chargement des rendez-vous…</div>
      <div v-else-if="calendarError" class="alert alert-danger" role="alert">{{ calendarError }}</div>
      <p v-else-if="!latestEvents.length" class="empty-state">Aucun rendez-vous à afficher pour le moment.</p>
      <div v-else class="d-flex flex-column gap-3">
        <div v-for="item in latestEvents" :key="item.id" class="home-event-card card shadow-sm">
          <div class="d-flex align-items-stretch">
            <div class="home-event-date" aria-hidden="true">
              <span class="home-event-day">{{ formatEventDay(item) }}</span>
              <span class="home-event-month">{{ formatEventMonth(item) }}</span>
            </div>
            <div class="card-body d-flex flex-column flex-md-row align-items-md-center gap-3">
              <div class="flex-grow-1">
                <h3 class="h5 card-title mb-1">{{ item.title || item.name || item.id }}</h3>
                <p v-if="hasValue(item.date) || hasValue(item.datetime) || hasValue(item.enddate)" class="card-text small text-muted mb-1">
                  <i class="bi bi-calendar-event me-1"></i>
                  {{ formatDate(item.date || item.datetime) }}<span v-if="hasValue(item.enddate) && formatDate(item.enddate) !== formatDate(item.date || item.datetime)"> - {{ formatDate(item.enddate) }}</span>
                </p>
                <p v-if="item.location" class="card-text small text-muted mb-1">
                  <i class="bi bi-geo-alt me-1"></i>{{ item.location }}
                </p>
                <p class="card-text mb-0">{{ getText(item) }}</p>
              </div>
              <router-link class="btn btn-outline-primary btn-sm align-self-md-center flex-shrink-0" :to="`/calendrier/detail/${item.id}`" :aria-label="`Consulter : ${item.title || item.name || item.id}`">Consulter <i class="bi bi-arrow-right ms-1" aria-hidden="true"></i></router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="home-section">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
        <h2 class="section-title mb-0">Actualités</h2>
        <router-link class="btn btn-outline-primary btn-sm" to="/actualites">Toutes les actualités</router-link>
      </div>

      <div v-if="newsLoading" class="alert alert-info" role="status">Chargement des actualités…</div>
      <div v-else-if="newsError" class="alert alert-danger" role="alert">{{ newsError }}</div>
      <p v-else-if="!latestNews.length" class="empty-state">Aucune actualité à afficher pour le moment.</p>
      <NewsList v-else :items="latestNews" :heading-level="3" />
    </section>

  </div>
</template>

<script setup lang="ts">
import { formatDate, getItemTimestamp, splitEventsByDate } from '../services/dateService'
import { computed, onMounted, ref } from 'vue'
import { getContentList, getDescriptionHead } from '../services/apiService'
import { getContentText, normalizeNewsItems } from '../services/newsService'
import type { ContentItem, SiteMetadata } from '../model/content'
import NewsList from '../components/NewsList.vue'

const latestNews = ref<ContentItem[]>([])
const latestEvents = ref<ContentItem[]>([])
const newsLoading = ref<boolean>(true)
const calendarLoading = ref<boolean>(true)
const newsError = ref<string | null>(null)
const calendarError = ref<string | null>(null)
const metadata = ref<SiteMetadata>({})
const siteDescription = computed(() => metadata.value.fulltitle || 'CRKDR Bretagne')
const bannerUrl = computed(() => {
  const imageUrl = metadata.value.banner?.imageurl
  if (!imageUrl) return ''
  if (imageUrl.startsWith('http') || imageUrl.startsWith('//') || imageUrl.startsWith('/')) {
    return imageUrl
  }
  return `/${imageUrl}`
})
const bannerAlt = computed(() => metadata.value.banner?.imagealt || siteDescription.value)

function hasValue(value: unknown): boolean {
  return String(value ?? '').trim() !== ''
}

function getEventTimestamp(item: ContentItem): number {
  return getItemTimestamp(item)
}

function formatEventDay(item: ContentItem): string {
  const timestamp = getEventTimestamp(item)
  if (Number.isNaN(timestamp)) return '—'
  return new Date(timestamp).toLocaleDateString('fr-FR', { day: '2-digit' })
}

function formatEventMonth(item: ContentItem): string {
  const timestamp = getEventTimestamp(item)
  if (Number.isNaN(timestamp)) return ''
  return new Date(timestamp).toLocaleDateString('fr-FR', { month: 'short' }).replace('.', '')
}

function getText(item: ContentItem): string {
  return getContentText(item)
}

function normalizeNews(items: ContentItem[] | null | undefined): ContentItem[] {
  return normalizeNewsItems(items, 6)
}

function normalizeEvents(items: ContentItem[] | null | undefined): ContentItem[] {
  const { upcoming } = splitEventsByDate(items || [])

  return upcoming.slice(0, 5)
}

onMounted(() => {
  getDescriptionHead()
    .then((data) => {
      metadata.value = data || {}
    })
    .catch(() => {
      metadata.value = {}
    })

  getContentList('news')
    .then((data) => {
      latestNews.value = normalizeNews(data)
    })
    .catch((err) => {
      newsError.value = err.message || 'Impossible de charger les actualités.'
    })
    .finally(() => {
      newsLoading.value = false
    })

  getContentList('calendar')
    .then((data) => {
      latestEvents.value = normalizeEvents(data)
    })
    .catch((err) => {
      calendarError.value = err.message || 'Impossible de charger les événements.'
    })
    .finally(() => {
      calendarLoading.value = false
    })
})
</script>

<style scoped>
.home-banner img { display: block; width: 100%; height: auto; margin-inline: auto; }
.home-section { margin-bottom: 3.5rem; }
.section-title { font-size: clamp(1.6rem, 3vw, 2rem); }
.home-event-card { overflow: hidden; }
.home-event-date { display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 5.5rem; padding: .75rem .5rem; background: #e9e9e6; color: #242424; text-align: center; }
.home-event-day { font-size: 2rem; font-weight: 700; line-height: 1; }
.home-event-month { font-size: .75rem; text-transform: uppercase; letter-spacing: .06em; margin-top: .4rem; }
.card-text { overflow-wrap: anywhere; }
.empty-state { padding: 2rem; border: 1px dashed #aaa; border-radius: 8px; color: #606060; }
@media (max-width: 767px) {
  .home-event-date { min-width: 4rem; }
  .card-body { padding: 1rem; min-width: 0; }
  .section-title { font-size: 1.5rem; }
}
</style>
