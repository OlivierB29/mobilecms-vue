<template>
  <div class="container py-4">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h2>Clubs</h2>
<router-link
  to="/carte"
  class="btn btn-outline-secondary d-flex gap-2 align-items-center fw-semibold fs-5"
>
  <i class="bi bi-map fs-2"></i>
  <span>Carte</span>
</router-link>
    </div>
    <p class="text-muted">Liste des clubs</p>

    <div class="row g-2 mb-4 align-items-center">
      <div class="col-md-8 col-lg-9">
        <input
          v-model="searchTerm"
          type="search"
          class="form-control"
          placeholder="Rechercher un club..."
          aria-label="Rechercher des clubs"
          @keydown.enter="applySearch"
        />
      </div>
      <div class="col-md-4 col-lg-3 d-flex gap-2">
        <button type="button" class="btn btn-primary w-100" @click="applySearch">Rechercher</button>
        <button v-if="searchTerm" type="button" class="btn btn-outline-secondary" @click="clearSearch">Effacer</button>
      </div>
    </div>

    <div v-if="loading" class="alert alert-info">Chargement des clubs...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-else-if="filteredClubs.length">
      <div class="row g-4">
        <div v-for="club in filteredClubs" :key="club.id" class="col-md-6">
          <div class="card shadow-sm h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start gap-3">
                <div>
                  <h5 class="card-title">{{ club.title || club.name || club.id }}</h5>
                  <div class="small text-muted">{{ club.city || 'City not available' }}</div>
                </div>
                <span class="badge bg-secondary">{{ club.activity || 'club' }}</span>
              </div>
              <div class="mt-3 d-flex flex-wrap gap-2">
                <router-link :to="`/club/${encodeURIComponent(String(club.id ?? ''))}`" class="btn btn-outline-primary btn-sm">Informations</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="alert alert-secondary">
      {{ searchTerm ? `Aucun club ne correspond à "${searchTerm}".` : 'Aucun club disponible.' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getContentList } from '../services/apiService'

type ClubItem = {
  id?: string | number
  title?: string
  name?: string
  city?: string
  activity?: string
  [key: string]: any
}

const clubs = ref<ClubItem[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)
const searchTerm = ref('')

const filteredClubs = computed(() => {
  const query = searchTerm.value.trim().toLowerCase()

  if (!query) {
    return clubs.value
  }

  return clubs.value.filter((club) => {
    const searchableValues = [club.title, club.name, club.city, club.activity, club.id, club.url]

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

onMounted(() => {
  getContentList('clubs')
    .then((data: ClubItem[]) => {
      clubs.value = data || []
    })
    .catch((err: Error) => {
      error.value = err.message || 'Failed to load clubs.'
    })
    .finally(() => {
      loading.value = false
    })
})
</script>
