<template>
  <div class="container py-4">

    <div v-if="loading" class="alert alert-info">Loading news details...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else-if="news" class="card shadow-sm">
      <div class="card-body">
        <h3 class="card-title">{{news.title}}</h3>
        <div class="card-text" v-html="news.description"></div>
        
        <pre v-if="news && !news.content && !news.description && !news.body" class="mt-3">{{ news }}</pre>
      </div>
    </div>

    <div v-if="images.length" class="mt-4">
      <h4>Images</h4>
      <div class="row g-3">
        <div v-for="image in images" :key="image.url" class="col col-md">
          <div class="card">
            <img :src="image.url" class="card-img-top" :alt="image.title || image.name || 'image'" :title="image.title || image.name || image.url"/>
          </div>
        </div>
      </div>
    </div>

    <div v-if="attachments.length" class="mt-4">
      <h4>Attachments</h4>
      <ul class="list-group">
        <li v-for="attachment in attachments" :key="attachment.url || attachment.name" class="list-group-item d-flex justify-content-between align-items-center">
          <span>{{ attachment.title || attachment.name || attachment.url }}</span>
          <a :href="attachment.url" target="_blank" rel="noreferrer" class="btn btn-outline-secondary btn-sm">Download</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getContentById } from '../services/apiService'
import { initItemMedia, getImages, getAttachments } from '../services/mediaService'

type NewsRecord = {
  id?: string | number
  title?: string
  description?: string
  body?: string
  content?: string
  [key: string]: any
}

const props = defineProps({
  id: String
})

const news = ref<NewsRecord | null>(null)
const loading = ref<boolean>(true)
const error = ref<string | null>(null)
const images = computed(() => getImages((news.value ?? {}) as any))
const attachments = computed(() => getAttachments((news.value ?? {}) as any))

onMounted(() => {
  if (!props.id) {
    error.value = 'Missing news ID.'
    loading.value = false
    return
  }

  const newsId = String(props.id)

  getContentById('news', newsId)
    .then((data: NewsRecord) => {
      const article = initItemMedia('news', newsId, data)
      news.value = article
      if (article.title) {
        document.title = article.title
      }
    })
    .catch((err: Error) => {
      error.value = err.message || 'Failed to load news details.'
    })
    .finally(() => {
      loading.value = false
    })
})
</script>
