<template>
  <div class="container py-4">
    <BackLink to="/clubs" label="Retour aux clubs" />
    <div class="mb-4">
      <div class="text-uppercase small text-muted fw-semibold">Club</div>
      <h1 class="mb-0">{{ club?.title || club?.name || `Club ${id}` }}</h1>
    </div>

    <div v-if="loading" class="alert alert-info" role="status">Chargement du club…</div>
    <div v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
    <div v-else-if="club" class="card shadow-sm">
      <div class="card-body">
        <div class="d-flex flex-wrap gap-2 mb-4">
          <span v-if="club.activity" class="badge bg-primary">{{ club.activity }}</span>
          <span v-if="club.city" class="badge bg-light text-dark border">
            <i class="bi bi-geo-alt me-1" aria-hidden="true"></i>{{ club.city }}
          </span>
        </div>

        <AccessibleHtml class="club-description" :html="club.description || club.details || 'Aucune information disponible.'" />

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
          <a v-if="websiteUrl" :href="websiteUrl" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
            <i class="bi bi-box-arrow-up-right me-1" aria-hidden="true"></i>{{ websiteLabel }}<span class="visually-hidden"> (nouvelle fenêtre)</span>
          </a>
          <a v-if="club.coordinates" :href="openStreetMapsUrl" target="_blank" rel="noreferrer" class="btn btn-outline-primary btn-sm">OpenStreetMap<span class="visually-hidden"> (nouvelle fenêtre)</span></a>
          <a v-if="club.coordinates" :href="googleMapsUrl" target="_blank" rel="noreferrer" class="btn btn-outline-primary btn-sm">Google Maps<span class="visually-hidden"> (nouvelle fenêtre)</span></a>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-warning">Club introuvable.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getContentById } from '../services/apiService'
import BackLink from '../components/BackLink.vue'
import AccessibleHtml from '../components/AccessibleHtml.vue'
import { setPageTitle } from '../services/pageTitleService'
import type { ClubItem } from '../model/content'

const props = defineProps({
  id: String
})

const club = ref<ClubItem | null>(null)
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

const websiteUrl = computed(() => {
  const url = club.value?.url?.trim()
  if (!url) return ''
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith('//')) return `https:${url}`
  return `https://${url}`
})

const websiteLabel = computed(() => websiteUrl.value.replace(/^https?:\/\//i, '').replace(/\/+$/, ''))

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
    error.value = 'Identifiant du club manquant.'
    loading.value = false
    return
  }

  getContentById('clubs', props.id)
    .then((data: ClubItem) => {
      club.value = data
      setPageTitle(data.title || data.name || 'Club')
    })
    .catch((err: Error) => {
      error.value = err.message || 'Impossible de charger ce club.'
    })
    .finally(() => {
      loading.value = false
    })
})
</script>
