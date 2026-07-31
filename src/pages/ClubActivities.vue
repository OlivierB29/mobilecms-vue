<template>
  <div class="container py-4">
    <h2>Clubs</h2>
    <p class="text-muted">Liste des clubs</p>

    <div v-if="loading" class="alert alert-info">Loading clubs...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <div v-else>

      <div class="row g-4">
        <div v-for="club in clubs" :key="club.id" class="col-md-6">
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
                <router-link :to="`/club/${encodeURIComponent(club.id)}`" class="btn btn-outline-primary btn-sm">Informations</router-link>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getContentList } from '../services/apiService'
import ViewRegionalMap from '../components/ViewRegionalMap.vue'

const clubs = ref([])
const loading = ref(true)
const error = ref(null)

onMounted(() => {
  getContentList('clubs')
    .then((data) => {
      clubs.value = data || []
    })
    .catch((err) => {
      error.value = err.message || 'Failed to load clubs.'
    })
    .finally(() => {
      loading.value = false
    })
})
</script>
