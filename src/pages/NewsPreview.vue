<template>
  <div class="container py-4">
    <div v-if="loading" class="alert alert-info">Loading news...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <ul v-else class="list-group">
      <li v-for="item in newsItems" :key="item.id" class="list-group-item d-flex justify-content-between align-items-center">
        <router-link class="btn btn-outline-primary btn-sm" :to="`/news/${item.id}`">{{ item.title || item.name || item.id }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getContentList } from '../services/apiService'

type NewsPreviewItem = {
  id?: string | number
  title?: string
  name?: string
  [key: string]: any
}

const newsItems = ref<NewsPreviewItem[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

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
