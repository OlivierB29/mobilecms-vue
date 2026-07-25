<template>
  <div class="container py-4">
    <h2>{{ title }}</h2>
    <p class="text-muted">Content fetched from the MobileCMS API for {{ type }}.</p>

    <div v-if="loading" class="alert alert-info">Loading {{ type }}...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-else-if="items.length" class="row g-4">
      <div v-for="item in items" :key="item.id || item.url" class="col-md-6">
        <div class="card shadow-sm h-100">
          <div class="card-body">
            <h5 class="card-title">{{ item.title || item.name || item.id || item.url }}</h5>
            <div class="card-text" v-html="item.description || item.subtitle || ''"></div>
            <div v-if="getQuickLinks(item).length" class="mt-3">
              <div class="small fw-semibold mb-2">Files</div>
              <div class="d-flex flex-wrap gap-2">
                <a
                  v-for="link in getQuickLinks(item)"
                  :key="link.url + link.title"
                  :href="link.url"
                  class="btn btn-outline-secondary btn-sm"
                  target="_blank"
                  rel="noreferrer"
                >
                  {{ link.title || 'Open' }}
                </a>
              </div>
            </div>
            <div class="mt-3 d-flex gap-2">
              <router-link
                v-if="item.id"
                :to="getDetailRoute(item.id)"
                class="btn btn-outline-primary btn-sm"
              >
                Open details
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-secondary">No items available for {{ type }}.</div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { getContentList } from '../services/apiService'

const props = defineProps({
  type: {
    type: String,
    required: true
  }
})

const title = computed(() => {
  const labels = {
    structure: 'Structure',
    contacts: 'Contacts',
    reports: 'Reports',
    links: 'Links',
    documents: 'Documents'
  }
  return labels[props.type] || props.type.charAt(0).toUpperCase() + props.type.slice(1)
})
const items = ref([])
const loading = ref(true)
const error = ref(null)

function getDetailRoute(id) {
  return `/${props.type}/${encodeURIComponent(id)}`
}

function getQuickLinks(item) {
  const links = []

  if (Array.isArray(item.attachments)) {
    item.attachments.forEach((entry) => {
      if (entry && entry.url) {
        links.push({ title: entry.title || entry.name || 'Attachment', url: entry.url })
      }
    })
  }

  if (Array.isArray(item.media)) {
    item.media.forEach((entry) => {
      if (entry && entry.url) {
        links.push({ title: entry.title || entry.name || 'Media', url: entry.url })
      }
    })
  }

  return links
}

function loadItems() {
  loading.value = true
  error.value = null
  items.value = []

  getContentList(props.type)
    .then((data) => {
      items.value = data.reverse() || []
    })
    .catch((err) => {
      error.value = err.message || `Failed to load ${props.type}.`
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(loadItems)
watch(() => props.type, loadItems)
</script>
