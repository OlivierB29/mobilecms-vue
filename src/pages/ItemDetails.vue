<template>
  <div class="container py-4">
    <h2>{{ title }}</h2>
    <p class="text-muted">Detail page for {{ typeLabel }} item {{ id }}.</p>

    <div v-if="loading" class="alert alert-info">Loading details...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else-if="item" class="card shadow-sm">
      <div class="card-body">
        <h3 class="card-title">{{ item.title || item.name || `Item ${id}` }}</h3>
        <div class="card-text" v-html="item.description || item.details || item.body || 'No details available.'"></div>

        <dl class="row mt-3">
          <template v-if="item.date">
            <dt class="col-sm-3">Date</dt>
            <dd class="col-sm-9">{{ item.date }}</dd>
          </template>
          <template v-if="item.location">
            <dt class="col-sm-3">Location</dt>
            <dd class="col-sm-9">{{ item.location }}</dd>
          </template>
          <template v-if="item.url">
            <dt class="col-sm-3">Link</dt>
            <dd class="col-sm-9"><a :href="item.url" target="_blank" rel="noreferrer">Open file</a></dd>
          </template>
        </dl>

        <div v-if="attachments.length" class="mt-4">
          <h4>Downloads</h4>
          <ul class="list-group">
            <li v-for="attachment in attachments" :key="attachment.url || attachment.name" class="list-group-item d-flex justify-content-between align-items-center">
              <span>{{ attachment.title || attachment.name || attachment.url }}</span>
              <a :href="attachment.url" target="_blank" rel="noreferrer" class="btn btn-outline-secondary btn-sm">Open</a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div v-if="images.length" class="mt-4">
      <h4>Images</h4>
      <div class="row g-3">
        <div v-for="image in images" :key="image.url" class="col-12 col-md-4">
          <div class="card">
            <img :src="image.url" class="card-img-top" :alt="image.title || image.name || 'image'" />
            <div class="card-body p-2">
              <div class="small text-muted">{{ image.title || image.name || image.url }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getContentById } from '../services/apiService'
import { initItemMedia, getImages, getAttachments } from '../services/mediaService'

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

const item = ref(null)
const loading = ref(true)
const error = ref(null)

const typeLabel = computed(() => props.type.charAt(0).toUpperCase() + props.type.slice(1))
const title = computed(() => `${typeLabel.value} details`)
const images = computed(() => getImages(item.value))
const attachments = computed(() => getAttachments(item.value))

onMounted(() => {
  getContentById(props.type, props.id)
    .then((data) => {
      item.value = initItemMedia(props.type, props.id, data)
    })
    .catch((err) => {
      error.value = err.message || 'Failed to load item details.'
    })
    .finally(() => {
      loading.value = false
    })
})
</script>
