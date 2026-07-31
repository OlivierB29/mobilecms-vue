<template>
  <div class="container py-4">
    <h2>Calendrier</h2>
    
    <div class="ratio ratio-16x9" v-if="embedUrl">
      <iframe :src="embedUrl" title="Google Calendar" frameborder="0"></iframe>
    </div>

    <div v-if="loading" class="alert alert-info">Loading upcoming calendar entries...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>


    
    <ul v-else class="list-group mb-4">
      <li v-for="item in events" :key="item.id" class="list-group-item">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <strong>{{item.title}}</strong>
            <div class="small text-muted">{{ item.date || item.datetime || 'No date provided' }}</div>
          </div>
          <span class="badge bg-primary">{{ item.status || item.category || 'calendar' }}</span>
        </div>
      </li>
    </ul>


  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getContentList, getDescriptionHead } from '../services/apiService'

const events = ref([])
const embedUrl = ref('')
const loading = ref(true)
const error = ref(null)

const parseEventDate = (item) => {
  const raw = item.date || item.datetime || ''
  const timestamp = Date.parse(raw)
  return Number.isNaN(timestamp) ? 0 : timestamp
}


onMounted(() => {
  Promise.all([
    getContentList('calendar'),
    getDescriptionHead()
  ])
    .then(([calendarData, descriptionHead]) => {
      const url = descriptionHead?.googlecalendar?.embedurl || ''
      embedUrl.value = url

      // compute bounds: 2 months in the past, 1 year in the future
      const now = new Date()
      const pastBound = new Date(now)
      pastBound.setMonth(pastBound.getMonth() - 2)
      const futureBound = new Date(now)
      futureBound.setFullYear(futureBound.getFullYear() + 1)

      events.value = (calendarData || [])
        .slice()
        .filter((item) => {
          const ts = parseEventDate(item)
          if (!ts) return false
          return ts >= pastBound.getTime() && ts <= futureBound.getTime()
        })
        .sort((a, b) => parseEventDate(b) - parseEventDate(a))
    })
    .catch((err) => {
      error.value = err.message || 'Failed to load calendar data.'
    })
    .finally(() => {
      loading.value = false
    })
})
</script>
