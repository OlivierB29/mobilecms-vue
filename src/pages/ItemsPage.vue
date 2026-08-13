<template>
  <div class="container py-4">
    <h2>{{ title }}</h2>
    
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
                Ouvrir
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-secondary">No items available for {{ type }}.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { getContentList } from '../services/apiService'

type CollectionItem = {
  id?: string | number
  url?: string
  title?: string
  name?: string
  description?: string
  subtitle?: string
  attachments?: Array<{ title?: string; name?: string; url?: string }>
  media?: Array<{ title?: string; name?: string; url?: string }>
  [key: string]: any
}

const props = defineProps({
  type: {
    type: String,
    required: true
  }
})

const title = computed(() => {
  const labels: Record<string, string> = {
    structure: 'Structure',
    contacts: 'Contacts',
    reports: 'Reports',
    links: 'Links',
    documents: 'Documents'
  }
  return labels[props.type] || props.type.charAt(0).toUpperCase() + props.type.slice(1)
})
const items = ref<CollectionItem[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

function getDetailRoute(id: string | number) {
  return `/${props.type}/${encodeURIComponent(String(id))}`
}

function getQuickLinks(item: CollectionItem) {
  const links: Array<{ title: string; url: string }> = []

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
    .then((data: CollectionItem[]) => {
      items.value = data || []
    })
    .catch((err: Error) => {
      error.value = err.message || `Failed to load ${props.type}.`
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(loadItems)
watch(() => props.type, loadItems)
</script>
