<template>
  <div class="home-page container py-4">
    <div class="mb-4 text-center">
      <img :src="bannerUrl" alt="Banner" class="img-fluid rounded shadow-sm" :title="siteDescription" />
    </div>


    <section class="mb-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h4 mb-0">Actualités</h2>
        <router-link class="btn btn-outline-primary btn-sm" to="/news">Tout voir</router-link>
      </div>

      <div v-if="loading" class="alert alert-info">Loading latest news...</div>
      <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-else class="row g-4">
        <div v-for="item in latestNews" :key="item.id" class="col-lg-6">
          <div class="card h-100 shadow-sm overflow-hidden">
            <img v-if="item.image" :src="item.image.url" class="card-img-top home-news-image" :alt="item.image.title || item.title || 'News image'" />
            <div class="card-body">
              <h5 class="card-title">{{ item.title || item.name || item.id }}</h5>
              <p class="card-text" v-html="getText(item)"></p>
              <router-link class="btn btn-primary btn-sm" :to="`/news/${item.id}`">Read more</router-link>
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

const bannerUrl = '/assets/banner-1900.jpg'

const latestNews = ref([])
const loading = ref(true)
const error = ref(null)
const metadata = ref({})
const siteTitle = computed(() => metadata.value.title || 'mobilecms')
const siteDescription = computed(() => metadata.value.fulltitle || 'MobileCMS content portal')

function getNewsDate(item) {
  return item.date || item.updated || item.created || item.publish_date || ''
}

function sortLatestNews(items) {
  return [...items].sort((a, b) => {

    const aDate = Date.parse(getNewsDate(a))
    const bDate = Date.parse(getNewsDate(b))


    if (!Number.isNaN(aDate) && !Number.isNaN(bDate)) {
      return bDate - aDate
    }

    if (!Number.isNaN(aDate)) return -1
    if (!Number.isNaN(bDate)) return 1

    return String(b.id || '').localeCompare(String(a.id || ''))
  }).slice(0, 6)
}

function getText(item) {
  const text = item.description || item.details || item.body || item.summary || ''
  const plainText = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  return plainText
}

function normalizeNews(items) {

  return sortLatestNews((items || []).map((item) => {
    const itemId = item.id || item.slug || item.name || ''
    const initialized = initItemMedia('news', itemId, item)
    const images = getImages(initialized)
    return {
      ...initialized,
      image: images[0] || null
    }
  }))
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
        console.log('getContentList news', data)
      latestNews.value = normalizeNews(data)
    })
    .catch((err) => {
      error.value = err.message || 'Failed to load news.'
    })
    .finally(() => {
      loading.value = false
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
</style>
