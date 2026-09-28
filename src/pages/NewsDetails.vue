<template>
  <div class="container py-4">
    <BackLink to="/actualites" label="Retour aux actualités" />
    <h1 v-if="!news" class="visually-hidden">Actualité</h1>

    <div v-if="loading" class="alert alert-info" role="status">Chargement de l’actualité…</div>
    <div v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
    <div v-else-if="news" class="card shadow-sm">
      <div class="card-body">
        <h1 class="card-title">{{ news.title || 'Actualité' }}</h1>
        <AccessibleHtml class="card-text" :html="news.description || news.body || news.content || ''" />
        
        <pre v-if="news && !news.content && !news.description && !news.body" class="mt-3">{{ news }}</pre>
      </div>
    </div>

    <div v-if="images.length" class="mt-4">
      <h2>Images</h2>
      <div class="row g-3">
        <div v-for="image in images" :key="image.url" class="col col-md">
          <div class="card">
            <img :src="image.url" class="card-img-top" :alt="image.title || image.name || ''" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="attachments.length" class="mt-4">
      <h2>Documents associés</h2>
      <ul class="list-group">
        <li v-for="attachment in attachments" :key="attachment.url || attachment.name" class="list-group-item d-flex justify-content-between align-items-center">
          <span>{{ attachment.title || attachment.name || attachment.url }}</span>
          <a :href="attachment.url" target="_blank" rel="noreferrer" class="btn btn-outline-secondary btn-sm">Télécharger<span class="visually-hidden"> (nouvelle fenêtre)</span></a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getContentById } from '../services/apiService'
import { initItemMedia, getImages, getAttachments } from '../services/mediaService'
import BackLink from '../components/BackLink.vue'
import AccessibleHtml from '../components/AccessibleHtml.vue'
import { setPageTitle } from '../services/pageTitleService'
import type { ContentItem } from '../model/content'

const props = defineProps({
  id: String
})

const news = ref<ContentItem | null>(null)
const loading = ref<boolean>(true)
const error = ref<string | null>(null)
const images = computed(() => getImages(news.value ?? {}))
const attachments = computed(() => getAttachments(news.value ?? {}))

onMounted(() => {
  if (!props.id) {
    error.value = 'Identifiant de l’actualité manquant.'
    loading.value = false
    return
  }

  const newsId = String(props.id)

  getContentById('news', newsId)
    .then((data: ContentItem) => {
      const article = initItemMedia('news', newsId, data)
      news.value = article
      if (article.title) {
        setPageTitle(article.title)
      }
    })
    .catch((err: Error) => {
      error.value = err.message || 'Impossible de charger cette actualité.'
    })
    .finally(() => {
      loading.value = false
    })
})
</script>
