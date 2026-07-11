<template>
  <div class="container py-4">
    <h2>News</h2>
    <p class="text-muted">Preview of current news items.</p>

    <div v-if="loading" class="alert alert-info">Loading news...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <ul v-else class="list-group">
      <li v-for="item in newsItems" :key="item.id" class="list-group-item d-flex justify-content-between align-items-center">
        <span>{{ item.title || item.name || item.id }}</span>
        <router-link class="btn btn-outline-primary btn-sm" :to="`/news/${item.id}`">Open</router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getContentList } from '../services/apiService'

const newsItems = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(() => {
  getContentList('news')
    .then((data) => {
      newsItems.value = data || []
    })
    .catch((err) => {
      error.value = err.message || 'Failed to load news.'
    })
    .finally(() => {
      loading.value = false
    })
})
</script>
