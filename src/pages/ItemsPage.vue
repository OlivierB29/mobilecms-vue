<template>
  <div class="container py-4">
    <h1 class="page-title">{{ title }}</h1>

    <form v-if="type !== 'structure'" class="row g-2 mb-4 align-items-center" role="search" @submit.prevent="applySearch">
      <div class="col-md-8 col-lg-9">
        <input
          v-model="searchTerm"
          type="search"
          class="form-control"
          :placeholder="`Rechercher ${title.toLowerCase()}...`"
          :aria-label="`Rechercher dans ${title}`"
        />
      </div>
      <div class="col-md-4 col-lg-3 d-flex gap-2">
        <button type="submit" class="btn btn-primary w-100">Rechercher</button>
        <button
          v-if="searchTerm"
          type="button"
          class="btn btn-outline-secondary"
          @click="clearSearch"
        >
          Effacer
        </button>
      </div>
    </form>

    <div v-if="loading" class="alert alert-info" role="status">Chargement…</div>
    <div v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

    <div v-else-if="items.length" class="item-list">
      <article v-for="item in items" :key="item.id || item.url" class="item-row">
        <div class="item-content">
          <h2 class="item-title">
            <router-link v-if="item.id" :to="getDetailRoute(item.id)">{{ item.title || item.name || item.id }}</router-link>
            <span v-else>{{ item.title || item.name || item.url }}</span>
          </h2>
          <AccessibleHtml v-if="item.description || item.subtitle" class="item-description" :html="item.description || item.subtitle" />
          <div v-if="getQuickLinks(item).length" class="item-links" aria-label="Documents associés">
            <a v-for="link in getQuickLinks(item)" :key="link.url + link.title" :href="link.url" class="document-link" target="_blank" rel="noreferrer">
              <i class="bi bi-file-earmark-arrow-down" aria-hidden="true"></i>
              {{ link.title || 'Télécharger le document' }}
              <span class="visually-hidden"> (nouvelle fenêtre)</span>
            </a>
          </div>
        </div>
      </article>
    </div>
    <div v-else class="alert alert-secondary">
      {{ searchTerm ? `Aucun résultat pour « ${searchTerm} ».` : 'Aucun contenu disponible.' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { getContentList } from '../services/apiService'
import AccessibleHtml from '../components/AccessibleHtml.vue'
import type { ContentItem } from '../model/content'

const props = defineProps({
  type: {
    type: String,
    required: true
  }
})

const title = computed(() => {
  const labels: Record<string, string> = {
    structure: 'Organisation',
    contacts: 'Contacts',
    reports: 'Comptes-rendus',
    links: 'Liens',
    documents: 'Documents'
  }
  return labels[props.type] || props.type.charAt(0).toUpperCase() + props.type.slice(1)
})

const allItems = ref<ContentItem[]>([])
const searchTerm = ref('')
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

const items = computed(() => {
  const query = searchTerm.value.trim().toLowerCase()

  if (!query) {
    return allItems.value
  }

  return allItems.value.filter((item) => {
    const searchableValues = [
      item.title,
      item.name,
      item.description,
      item.subtitle,
      item.url,
      item.id,
      ...(Array.isArray(item.attachments) ? item.attachments.map((entry) => [entry?.title, entry?.name, entry?.url].join(' ')) : []),
      ...(Array.isArray(item.media) ? item.media.map((entry) => [entry?.title, entry?.name, entry?.url].join(' ')) : [])
    ]

    return searchableValues.some((value) => {
      if (value == null) {
        return false
      }

      return String(value).toLowerCase().includes(query)
    })
  })
})

function applySearch() {
  searchTerm.value = searchTerm.value.trim()
}

function clearSearch() {
  searchTerm.value = ''
}

function getDetailRoute(id: string | number) {
  const routeByType: Record<string, string> = {
    structure: 'organisation',
    contacts: 'contact',
    reports: 'comptesrendus',
    links: 'links',
    documents: 'documents'
  }
  return `/${routeByType[props.type] || props.type}/${encodeURIComponent(String(id))}`
}

function getQuickLinks(item: ContentItem) {
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
  searchTerm.value = ''
  allItems.value = []

  getContentList(props.type)
    .then((data: ContentItem[]) => {
      allItems.value = data || []
    })
    .catch((err: Error) => {
      error.value = err.message || 'Impossible de charger les contenus.'
    })
    .finally(() => {
      loading.value = false
    })
}

onMounted(loadItems)
watch(() => props.type, loadItems)
</script>

<style scoped>
.page-title { margin-bottom: 1.5rem; font-size: clamp(2rem, 5vw, 3.5rem); }
.item-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.item-row { min-width: 0; padding: 1.5rem; border: 1px solid #d5d5d1; border-radius: 10px; background: #fff; }
.item-title { margin: 0 0 .65rem; font-size: clamp(1.2rem, 2vw, 1.65rem); }
.item-title a { display: inline-flex; min-height: 44px; align-items: center; color: #242424; text-decoration: underline; text-decoration-color: #aaa; text-underline-offset: 5px; }
.item-title a:hover { text-decoration: underline; text-decoration-thickness: 2px; }
.item-description { max-width: 800px; color: #555; line-height: 1.6; }
.item-description :deep(p:last-child) { margin-bottom: 0; }
.item-links { display: flex; flex-wrap: wrap; gap: .6rem 1.2rem; margin-top: 1rem; }
.document-link { display: inline-flex; min-height: 44px; align-items: center; gap: .45rem; color: #353535; font-size: .88rem; font-weight: 600; }
@media (max-width: 767px) {
  .item-list { grid-template-columns: 1fr; }
  .item-row { padding: 1.2rem; }
  .item-description { display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 3; }
}
</style>
