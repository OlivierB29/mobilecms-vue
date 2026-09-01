<template>
  <div class="container py-4">
    <div class="mb-4">
      <div class="text-uppercase small text-muted fw-semibold">Club details</div>
      <h2 class="mb-0">{{ club?.title || club?.name || `Club ${id}` }}</h2>
    </div>

    <div v-if="loading" class="alert alert-info">Loading club details...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else-if="club" class="card shadow-sm">
      <div class="card-body">
        <div class="d-flex flex-wrap gap-2 mb-4">
          <span v-if="club.activity" class="badge bg-primary">{{ club.activity }}</span>
          <span v-if="club.city" class="badge bg-light text-dark border">
            <i class="bi bi-geo-alt me-1" aria-hidden="true"></i>{{ club.city }}
          </span>
        </div>

        <div class="club-description" v-html="club.description || club.details || 'No club details available.'"></div>

        <dl class="row mt-4 mb-0">
          <template v-if="club.activity">
            <dt class="col-sm-3">Activité</dt>
            <dd class="col-sm-9">{{ club.activity }}</dd>
          </template>

          <template v-if="club.city">
            <dt class="col-sm-3">Ville</dt>
            <dd class="col-sm-9">{{ club.city }}</dd>
          </template>



          <template v-if="club.department">
            <dt class="col-sm-3">Département</dt>
            <dd class="col-sm-9">{{ club.department }}</dd>
          </template>
        </dl>

        <div class="mt-4 d-flex flex-wrap gap-2">
          <a v-if="club.url" :href="club.url" target="_blank" rel="noreferrer" class="btn btn-primary btn-sm">
            <i class="bi bi-box-arrow-up-right me-1" aria-hidden="true"></i>{{ websiteLabel }}
          </a>
          <a v-if="club.coordinates" :href="openStreetMapsUrl" target="_blank" rel="noreferrer" class="btn btn-outline-primary btn-sm">OpenStreetMap</a>
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

type ClubRecord = {
  id?: string | number
  title?: string
  name?: string
  description?: string
  details?: string
  city?: string
  activity?: string
  department?: string
  url?: string
  coordinates?: string
  [key: string]: any
}

const props = defineProps({
  id: String
})

const club = ref<ClubRecord | null>(null)
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

const websiteLabel = computed(() => club.value?.url?.replace(/^https?:\/\//, '').replace(/\/+$/, '') || '')

const openStreetMapsUrl = computed(() => {
  if (!club.value?.coordinates) return '#'
  const [lat, lng] = club.value.coordinates.split(',').map((value: string) => value.trim())
  if (!lat || !lng) return '#'
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}`
})

const googleMapsUrl = computed(() => {
  if (!club.value?.coordinates) return '#'
  const [lat, lng] = club.value.coordinates.split(',').map((value: string) => value.trim())
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
    .then((data: ClubRecord) => {
      club.value = data
    })
    .catch((err: Error) => {
      error.value = err.message || 'Failed to load club details.'
    })
    .finally(() => {
      loading.value = false
    })
})
</script>
