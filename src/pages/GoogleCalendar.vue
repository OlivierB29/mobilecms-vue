<template>
  <div class="container py-4">
    <h2>Google Calendar</h2>
    <p class="text-muted">Embedded calendar placeholder.</p>

    <div v-if="loading" class="alert alert-info">Loading upcoming calendar entries...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <ul v-else class="list-group mb-4">
      <li v-for="item in events" :key="item.id" class="list-group-item">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <strong>{{ item.title || item.name || `Event ${item.id}` }}</strong>
            <div class="small text-muted">{{ item.date || item.datetime || 'No date provided' }}</div>
          </div>
          <span class="badge bg-primary">{{ item.status || item.category || 'calendar' }}</span>
        </div>
      </li>
    </ul>

    <div class="ratio ratio-16x9">
      <iframe src="https://calendar.google.com" title="Google Calendar" frameborder="0"></iframe>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getContentList } from '../services/apiService'

const events = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(() => {
  getContentList('calendar')
    .then((data) => {
      events.value = data || []
    })
    .catch((err) => {
      error.value = err.message || 'Failed to load calendar events.'
    })
    .finally(() => {
      loading.value = false
    })
})
</script>
