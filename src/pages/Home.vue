<template>
  <div class="home-page container py-4">
    <div class="mb-4 text-center">
      <img :src="bannerUrl" :alt="bannerAlt" class="img-fluid rounded shadow-sm" :title="siteDescription" />
    </div>


    <section class="mb-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h4 mb-0">Calendrier</h2>
        <router-link class="btn btn-outline-primary btn-sm" to="/calendrier">Tout voir</router-link>
      </div>

      <div v-if="calendarLoading" class="alert alert-info">Loading latest calendar events...</div>
      <div v-else-if="calendarError" class="alert alert-danger">{{ calendarError }}</div>
      <div v-else class="d-flex flex-column gap-3">
        <div v-for="item in latestEvents" :key="item.id" class="home-event-card card shadow-sm">
          <div class="d-flex align-items-stretch">
            <div class="home-event-date" aria-hidden="true">
              <span class="home-event-day">{{ formatEventDay(item) }}</span>
              <span class="home-event-month">{{ formatEventMonth(item) }}</span>
            </div>
            <div class="card-body d-flex flex-column flex-md-row align-items-md-center gap-3">
              <div class="flex-grow-1">
                <h5 class="card-title mb-1">{{ item.title || item.name || item.id }}</h5>
                <p v-if="hasValue(item.date) || hasValue(item.datetime) || hasValue(item.enddate)" class="card-text small text-muted mb-1">
                  <i class="bi bi-calendar-event me-1"></i>
                  {{ item.date || item.datetime }}<span v-if="hasValue(item.enddate)"> - {{ item.enddate }}</span>
                </p>
                <p v-if="item.location" class="card-text small text-muted mb-1">
                  <i class="bi bi-geo-alt me-1"></i>{{ item.location }}
                </p>
                <p class="card-text mb-0" v-html="getText(item)"></p>
              </div>
              <router-link class="btn btn-outline-primary btn-sm align-self-md-center flex-shrink-0" :to="`/calendrier/detail/${item.id}`">Ouvrir</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="mb-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h4 mb-0">Actualités</h2>
        <router-link class="btn btn-outline-primary btn-sm" to="/news">Tout voir</router-link>
      </div>

      <div v-if="newsLoading" class="alert alert-info">Loading latest news...</div>
      <div v-else-if="newsError" class="alert alert-danger">{{ newsError }}</div>
      <div v-else class="row g-4">
        <div v-for="item in latestNews" :key="item.id" class="col-lg-6">
          <div class="card h-100 shadow-sm overflow-hidden">
            <img v-if="item.image" :src="item.image.url" class="card-img-top home-news-image" :alt="item.image.title || item.title || 'News image'" />
            <div class="card-body">
              <h5 class="card-title">{{ item.title || item.name || item.id }}</h5>
              <p v-if="hasValue(getNewsDate(item))" class="card-text small text-muted mb-2">{{ getNewsDate(item) }}</p>
              <p class="card-text" v-html="getText(item)"></p>
              <router-link class="btn btn-primary btn-sm" :to="`/news/${item.id}`">Ouvrir</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getContentList, getDescriptionHead } from '../services/apiService'
import { getImages, initItemMedia } from '../services/mediaService'

type ContentItem = {
  id?: string | number
  slug?: string
  name?: string
  title?: string
  description?: string
  details?: string
  body?: string
  summary?: string
  date?: string
  datetime?: string
  enddate?: string
  location?: string
  updated?: string
  created?: string
  publish_date?: string
  image?: { url?: string; title?: string } | null
  [key: string]: unknown
}

const latestNews = ref<ContentItem[]>([])
const latestEvents = ref<ContentItem[]>([])
const newsLoading = ref<boolean>(true)
const calendarLoading = ref<boolean>(true)
const newsError = ref<string | null>(null)
const calendarError = ref<string | null>(null)
const metadata = ref<{
  fulltitle?: string
  title?: string
  banner?: {
    imageurl?: string
    imagealt?: string
  }
}>({})
const siteDescription = computed(() => metadata.value.fulltitle || 'MobileCMS content portal')
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

function getNewsDate(item: ContentItem): string {
  return String(item.date || item.updated || item.created || item.publish_date || '')
}

function getEventDate(item: ContentItem): string {
  return String(item.date || item.datetime || item.enddate || item.updated || item.created || '')
}

function getEventTimestamp(item: ContentItem): number {
  return Date.parse(getEventDate(item))
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

function sortLatestByDate(items: ContentItem[], getDate: (item: ContentItem) => string): ContentItem[] {
  return [...items].sort((a, b) => {
    const aDate = Date.parse(getDate(a))
    const bDate = Date.parse(getDate(b))

    if (!Number.isNaN(aDate) && !Number.isNaN(bDate)) {
      return bDate - aDate
    }

    if (!Number.isNaN(aDate)) return -1
    if (!Number.isNaN(bDate)) return 1

    return String(b.id || '').localeCompare(String(a.id || ''))
  }).slice(0, 6)
}

function getText(item: ContentItem): string {
  const text = String(item.description || item.details || item.body || item.summary || '')
  const plainText = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return plainText
}

function withItemImage(type: string, item: ContentItem): ContentItem {
  const itemId = String(item.id || item.slug || item.name || '')
  const initialized = initItemMedia(type, itemId, item) as ContentItem
  const images = getImages(initialized as any)
  return {
    ...initialized,
    image: images[0] || null
  }
}

function normalizeNews(items: ContentItem[] | null | undefined): ContentItem[] {
  return sortLatestByDate((items || []).map((item) => withItemImage('news', item)), getNewsDate)
}

function normalizeEvents(items: ContentItem[] | null | undefined): ContentItem[] {
  const now = new Date()
  const pastBound = new Date(now)
  pastBound.setMonth(pastBound.getMonth() - 2)
  const futureBound = new Date(now)
  futureBound.setFullYear(futureBound.getFullYear() + 1)

  const inWindow = (items || []).filter((item) => {
    const timestamp = Date.parse(getEventDate(item))
    if (Number.isNaN(timestamp)) return false
    return timestamp >= pastBound.getTime() && timestamp <= futureBound.getTime()
  })

  return sortLatestByDate(inWindow.map((item) => withItemImage('calendar', item)), getEventDate)
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
      newsError.value = err.message || 'Failed to load news.'
    })
    .finally(() => {
      newsLoading.value = false
    })

  getContentList('calendar')
    .then((data) => {
      latestEvents.value = normalizeEvents(data)
    })
    .catch((err) => {
      calendarError.value = err.message || 'Failed to load calendar events.'
    })
    .finally(() => {
      calendarLoading.value = false
    })
})
</script>

<style scoped>
.home-page img {
  max-height: 320px;
  object-fit: cover;
  width: 100%;
}

.home-news-image {
  height: 220px;
  object-fit: cover;
}

.home-event-card {
  overflow: hidden;
  border: 0;
  border-left: 4px solid #4f46e5;
}

.home-event-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 5.5rem;
  padding: 0.75rem 0.5rem;
  background: #eef2ff;
  color: #3730a3;
  text-align: center;
}

.home-event-day {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1;
}

.home-event-month {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-top: 0.25rem;
}
</style>
