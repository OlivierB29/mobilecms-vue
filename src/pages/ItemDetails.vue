<template>
  <div class="container py-4">
    <BackLink :to="backRoute" :label="`Retour aux ${backLabel}`" />
    <h1>{{ item?.title || item?.name || title }}</h1>

    <div v-if="loading" class="alert alert-info" role="status">Chargement du contenu…</div>
    <div v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
    <div v-else-if="item" class="card shadow-sm">
      <div class="card-body">
        <AccessibleHtml class="card-text" :html="item.description || item.details || item.body || 'Aucun détail disponible.'" />

        <dl class="row mt-3">
          <template v-if="item.date">
            <dt class="col-sm-3">Date</dt>
            <dd class="col-sm-9">{{ formatDate(item.date) }}</dd>
          </template>
          <template v-if="item.location">
            <dt class="col-sm-3">Lieu</dt>
            <dd class="col-sm-9">{{ item.location }}</dd>
          </template>
          <template v-if="item.url">
            <dt class="col-sm-3">Lien</dt>
            <dd class="col-sm-9"><a :href="item.url" target="_blank" rel="noreferrer">Ouvrir le fichier<span class="visually-hidden"> (nouvelle fenêtre)</span></a></dd>
          </template>
        </dl>

        <div v-if="attachments.length" class="mt-4">
          <h2>Téléchargements</h2>
          <ul class="list-group">
            <li v-for="attachment in attachments" :key="attachment.url || attachment.name" class="list-group-item d-flex justify-content-between align-items-center">
              <span>{{ attachment.title || attachment.name || attachment.url }}</span>
              <a :href="attachment.url" target="_blank" rel="noreferrer" class="btn btn-outline-secondary btn-sm">Ouvrir<span class="visually-hidden"> (nouvelle fenêtre)</span></a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div v-if="images.length" class="mt-4">
      <h2>Images</h2>
      <div class="row g-3">
        <div v-for="image in images" :key="image.url" class="col-12 col-md-4">
          <div class="card">
            <img :src="image.url" class="card-img-top" :alt="image.title || image.name || ''" />
            <div class="card-body p-2">
              <div class="small text-muted">{{ image.title || image.name || image.url }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { formatDate } from '../services/dateService'
import { ref, computed, onMounted, watch } from 'vue'
import { getContentById } from '../services/apiService'
import { initItemMedia, getImages, getAttachments } from '../services/mediaService'
import BackLink from '../components/BackLink.vue'
import AccessibleHtml from '../components/AccessibleHtml.vue'
import { setPageTitle } from '../services/pageTitleService'
import type { ContentItem } from '../model/content'

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  }
})

const item = ref<ContentItem | null>(null)
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

const typeLabel = computed(() => {
  const labels: Record<string, string> = { structure: 'Organisation', contacts: 'Contact', reports: 'Compte-rendu', links: 'Lien', documents: 'Document' }
  return labels[props.type] || 'Contenu'
})
const title = computed(() => typeLabel.value)
const backRoute = computed(() => {
  const routes: Record<string, string> = {
    structure: '/structure',
    contacts: '/contact',
    reports: '/comptesrendus',
    links: '/links',
    documents: '/documents'
  }
  return routes[props.type] || '/'
})
const backLabel = computed(() => {
  const labels: Record<string, string> = {
    structure: 'éléments de l’organisation',
    contacts: 'contacts',
    reports: 'comptes-rendus',
    links: 'liens',
    documents: 'documents'
  }
  return labels[props.type] || 'contenus'
})
const images = computed(() => getImages(item.value ?? {}))
const attachments = computed(() => getAttachments(item.value ?? {}))

const fetchContent = () => {
  loading.value = true
  error.value = null
  getContentById(props.type, props.id)
    .then((data: ContentItem) => {
      item.value = initItemMedia(props.type, props.id, data)
      setPageTitle(data.title || data.name || typeLabel.value)
    })
    .catch((err: Error) => {
      error.value = err.message || 'Impossible de charger ce contenu.'
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(() => {
  fetchContent()
})

watch(() => [props.type, props.id], () => {
  fetchContent()
})
</script>
