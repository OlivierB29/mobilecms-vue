<template>
  <div class="container py-4">
    <BackLink to="/calendrier" label="Retour au calendrier" />
    <h1 v-if="!eventData" class="visually-hidden">Événement</h1>
    <div v-if="loading" class="alert alert-info" role="status">Chargement de l’événement…</div>
    <div v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
    <div v-else-if="eventData" class="card shadow-sm">
      <div class="card-body">
        <h1 class="card-title">{{ eventData.title || eventData.name || `Événement ${id}` }}</h1>
        
        <div class="mt-3">
          <div v-if="eventData.date"><strong>Date : </strong><span> {{ formatDate(eventData.date) }}</span><span v-if="eventData.enddate && formatDate(eventData.enddate) !== formatDate(eventData.date)"> - {{ formatDate(eventData.enddate) }}</span></div>

          <div v-if="eventData.location"><strong>Lieu :</strong> {{ eventData.location }}</div>
        </div>
        <AccessibleHtml class="card-text" :html="eventData.description || eventData.details || eventData.body || 'Aucun détail disponible.'" />
      </div>
    </div>
    <div v-else class="alert alert-warning">Événement introuvable.</div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from '../services/dateService'
import { ref, onMounted } from 'vue'
import { getContentById } from '../services/apiService'
import BackLink from '../components/BackLink.vue'
import AccessibleHtml from '../components/AccessibleHtml.vue'
import { setPageTitle } from '../services/pageTitleService'
import type { ContentItem } from '../model/content'

const props = defineProps({
  id: String
})

const eventData = ref<ContentItem | null>(null)
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

onMounted(() => {
  if (!props.id) {
    error.value = 'Identifiant de l’événement manquant.'
    loading.value = false
    return
  }

  getContentById('calendar', props.id)
    .then((data: ContentItem) => {
      eventData.value = data
      setPageTitle(data.title || data.name || 'Événement')
    })
    .catch((err: Error) => {
      error.value = err.message || 'Impossible de charger cet événement.'
    })
    .finally(() => {
      loading.value = false
    })
})
</script>
