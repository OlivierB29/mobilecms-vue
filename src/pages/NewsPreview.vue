<template>
  <div class="container py-4">
    <h2 class="mb-3">Actualités</h2>

    <div class="row g-2 mb-4 align-items-center">
      <div class="col-md-8 col-lg-9">
        <input
          v-model="searchTerm"
          type="search"
          class="form-control"
          placeholder="Rechercher une actualité..."
          aria-label="Search news"
          @keydown.enter="applySearch"
        />
      </div>
      <div class="col-md-4 col-lg-3 d-flex gap-2">
        <button type="button" class="btn btn-primary w-100" @click="applySearch">Search</button>
        <button v-if="searchTerm" type="button" class="btn btn-outline-secondary" @click="clearSearch">Clear</button>
      </div>
    </div>

    <div v-if="loading" class="alert alert-info">Loading news...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <ul v-else-if="filteredNewsItems.length" class="list-group">
      <li v-for="item in filteredNewsItems" :key="item.id" class="list-group-item d-flex justify-content-between align-items-center">
        <router-link class="btn btn-outline-primary btn-sm" :to="`/news/${item.id}`">{{ item.title || item.name || item.id }}</router-link>
      </li>
    </ul>

    <div v-else class="alert alert-secondary">
      {{ searchTerm ? `No news match "${searchTerm}".` : 'No news available.' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getContentList } from '../services/apiService'

type NewsPreviewItem = {
  id?: string | number
  title?: string
  name?: string
  description?: string
  subtitle?: string
  [key: string]: any
}

const newsItems = ref<NewsPreviewItem[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)
const searchTerm = ref('')

const filteredNewsItems = computed(() => {
  const query = searchTerm.value.trim().toLowerCase()

  if (!query) {
    return newsItems.value
  }

  return newsItems.value.filter((item) => {
    const searchableValues = [item.title, item.name, item.description, item.subtitle, item.id, item.url]

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

function clearSearch() {
  searchTerm.value = ''
}

onMounted(() => {
  getContentList('news')
    .then((data: NewsPreviewItem[]) => {
      newsItems.value = data || []
    })
    .catch((err: Error) => {
      error.value = err.message || 'Failed to load news.'
    })
    .finally(() => {
      loading.value = false
    })
})
</script>
