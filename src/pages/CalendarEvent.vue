<template>
  <div class="container py-4">
    <h2>Calendar Event</h2>
    <p class="text-muted">Details for event {{ id }}.</p>

    <div v-if="loading" class="alert alert-info">Loading event details...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else-if="eventData" class="card shadow-sm">
      <div class="card-body">
        <h3 class="card-title">{{ eventData.title || eventData.name || `Event ${id}` }}</h3>
        <p class="card-text">{{ eventData.description || eventData.details || eventData.body || 'No details available.' }}</p>
        <div class="mt-3">
          <div v-if="eventData.date"><strong>Date:</strong> {{ eventData.date }}</div>
          <div v-if="eventData.location"><strong>Location:</strong> {{ eventData.location }}</div>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-warning">Event not found.</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getContentById } from '../services/apiService'

const props = defineProps({
  id: String
})

const eventData = ref(null)
const loading = ref(true)
const error = ref(null)

onMounted(() => {
  if (!props.id) {
    error.value = 'Missing event ID.'
    loading.value = false
    return
  }

  getContentById('calendar', props.id)
    .then((data) => {
      eventData.value = data
    })
    .catch((err) => {
      error.value = err.message || 'Failed to load event details.'
    })
    .finally(() => {
      loading.value = false
    })
})
</script>
