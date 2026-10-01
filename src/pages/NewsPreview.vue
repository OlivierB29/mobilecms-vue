<template>
  <div class="container py-4">
    <h1 class="page-title">Actualités</h1>

    <form class="row g-2 mb-4 align-items-center" role="search" @submit.prevent="applySearch">
      <div class="col-md-8 col-lg-9">
        <input
          v-model="searchTerm"
          type="search"
          class="form-control"
          placeholder="Rechercher une actualité..."
          aria-label="Rechercher une actualité"
        />
      </div>
      <div class="col-md-4 col-lg-3 d-flex gap-2">
        <button type="submit" class="btn btn-primary w-100">Rechercher</button>
      </div>
    </form>

    <div v-if="loading" class="alert alert-info" role="status">Chargement des actualités…</div>
    <div v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

    <NewsList v-else-if="filteredNewsItems.length" :items="filteredNewsItems" />

    <div v-else class="alert alert-secondary">
      {{ searchTerm ? `Aucune actualité ne correspond à « ${searchTerm} ».` : 'Aucune actualité disponible.' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getContentList } from '../services/apiService'
import { normalizeNewsItems } from '../services/newsService'
import type { ContentItem } from '../model/content'
import NewsList from '../components/NewsList.vue'

const newsItems = ref<ContentItem[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)
const searchTerm = ref('')

const filteredNewsItems = computed(() => {
  const query = searchTerm.value.trim().toLowerCase()

  if (!query) {
    return newsItems.value
  }

  return newsItems.value.filter((item) => {
    const searchableValues = [item.title, item.name, item.description, item.summary, item.id, item.url]

    return searchableValues.some((value) => {
      if (value == null) {
        return false
      }

      return String(value).toLowerCase().includes(query)
    })
  })
})

function applySearch() {
  searchTerm.value = searchTerm.value.trim()
}

onMounted(() => {
  getContentList('news')
    .then((data: ContentItem[]) => {
      newsItems.value = normalizeNewsItems(data)
    })
    .catch((err: Error) => {
      error.value = err.message || 'Impossible de charger les actualités.'
    })
    .finally(() => {
      loading.value = false
    })
})
</script>

<style scoped>
.page-title { margin-bottom: 1.5rem; font-size: clamp(2rem, 5vw, 3.5rem); }
</style>
