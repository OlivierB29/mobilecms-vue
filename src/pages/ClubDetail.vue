<template>
  <div class="container py-4">
    <h2>Club details</h2>

    <div v-if="loading" class="alert alert-info">Loading club details...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else-if="club" class="card shadow-sm">
      <div class="card-body">
        <h3 class="card-title">{{ club.title || club.name || `Club ${id}` }}</h3>
        <p class="card-text" v-html="club.description || club.details || 'No club details available.'"></p>
        <dl class="row mt-3">
          <template v-if="club.city">
            <dt class="col-sm-3">Ville</dt>
            <dd class="col-sm-9">{{ club.city }}</dd>
          </template>

          <template v-if="club.activity">
            <dt class="col-sm-3">Activité</dt>
            <dd class="col-sm-9">{{ club.activity }}</dd>
          </template>

        </dl>
        <div class="mt-3 d-flex gap-2">
          <a v-if="club.coordinates" :href="openStreetMapsUrl" target="_blank" rel="noreferrer" class="btn btn-outline-primary btn-sm">Open Street Maps</a>
          <a v-if="club.coordinates" :href="googleMapsUrl" target="_blank" rel="noreferrer" class="btn btn-outline-primary btn-sm">Google Maps</a>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-warning">Club not found.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getContentById } from '../services/apiService'

const props = defineProps({
  id: String
})

const club = ref(null)
const loading = ref(true)
const error = ref(null)

const openStreetMapsUrl = computed(() => {
  if (!club.value?.coordinates) return '#'
  const [lat, lng] = club.value.coordinates.split(',').map((value) => value.trim())
  if (!lat || !lng) return '#'
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}`
})

const googleMapsUrl = computed(() => {
  if (!club.value?.coordinates) return '#'
  const [lat, lng] = club.value.coordinates.split(',').map((value) => value.trim())
  if (!lat || !lng) return '#'
  return `https://www.google.com/maps?q=${lat},${lng}`
})

onMounted(() => {
  if (!props.id) {
    error.value = 'Missing club ID.'
    loading.value = false
    return
  }

  getContentById('clubs', props.id)
    .then((data) => {
      club.value = data
    })
    .catch((err) => {
      error.value = err.message || 'Failed to load club details.'
    })
    .finally(() => {
      loading.value = false
    })
})
</script>
