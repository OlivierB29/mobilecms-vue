<template>
  <div class="container py-4">
    <h1 class="page-title">Les clubs</h1>
    <p class="page-intro">Découvrez les clubs de la région et trouvez celui qui se situe près de chez vous.</p>

    <section class="map-panel" aria-labelledby="map-title">
      <div class="map-heading">
        <div>
          <span class="eyebrow">Carte régionale</span>
          <h2 id="map-title">Trouver un club</h2>
        </div>
        <span class="club-count" aria-live="polite">{{ activityClubs.length }} club{{ activityClubs.length > 1 ? 's' : '' }}</span>
      </div>
      <ClubMap :clubs="activityClubs" :show-club-list="false" />
    </section>

    <section aria-labelledby="club-list-title">
      <h2 id="club-list-title" class="section-title">Tous les clubs</h2>

    <form class="row g-2 mb-4 align-items-center" role="search" @submit.prevent="applySearch">
      <div class="col-md-8 col-lg-9">
        <input
          v-model="searchTerm"
          type="search"
          class="form-control"
          placeholder="Rechercher un club..."
          aria-label="Rechercher des clubs"
        />
      </div>
      <div class="col-md-4 col-lg-3 d-flex gap-2">
        <button type="submit" class="btn btn-primary w-100">Rechercher</button>
        <button v-if="searchTerm" type="button" class="btn btn-outline-secondary" @click="clearSearch">Effacer</button>
      </div>
    </form>

    <div v-if="loading" class="alert alert-info" role="status">Chargement des clubs…</div>
    <div v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

    <div v-else-if="filteredClubs.length">
      <div class="club-grid">
        <article v-for="club in filteredClubs" :key="club.id" class="club-card">
          <span v-if="club.activity" class="club-activity" :style="{ color: getDisciplineColor(club.activity, 'text') }">{{ club.activity }}</span>
          <h3><router-link :to="`/clubs/${encodeURIComponent(String(club.id ?? ''))}`">{{ club.title || club.name || club.id }}</router-link></h3>
          <p class="club-city"><i class="bi bi-geo-alt" aria-hidden="true"></i>{{ club.city || 'Ville non renseignée' }}</p>
        </article>
      </div>
    </div>
    <div v-else class="alert alert-secondary">
      {{ searchTerm ? `Aucun club ne correspond à "${searchTerm}".` : 'Aucun club disponible.' }}
    </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getContentList } from '../services/apiService'
import ClubMap from './ClubMap.vue'
import type { ClubItem } from '../model/content'
import { getDisciplineColor } from '../services/disciplineService'

const props = defineProps<{
  activity?: string
}>()

const clubs = ref<ClubItem[]>([])
const loading = ref<boolean>(true)
const error = ref<string | null>(null)
const searchTerm = ref('')

const activityClubs = computed(() => {
  const activity = String(props.activity || '').trim().toLowerCase()
  if (!activity) return clubs.value
  return clubs.value.filter((club) => String(club.activity || '').trim().toLowerCase().includes(activity))
})

const filteredClubs = computed(() => {
  const query = searchTerm.value.trim().toLowerCase()

  if (!query) {
    return activityClubs.value
  }

  return activityClubs.value.filter((club) => {
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
      error.value = err.message || 'Impossible de charger les clubs.'
    })
    .finally(() => {
      loading.value = false
    })
})
</script>

<style scoped>
.page-title { margin-bottom: .5rem; font-size: clamp(2rem, 5vw, 3.5rem); }
.page-intro { max-width: 620px; margin-bottom: 2rem; color: #555; font-size: 1.05rem; line-height: 1.65; }
.map-panel { overflow: hidden; margin-bottom: 3.5rem; border: 1px solid #d3d3cf; border-radius: 12px; background: #fff; }
.map-heading { display: flex; align-items: end; justify-content: space-between; gap: 1rem; padding: 1.25rem 1.5rem; }
.map-heading .eyebrow { margin-bottom: .25rem; }
.map-heading h2 { margin: 0; font-size: 1.5rem; }
.club-count { flex-shrink: 0; color: #666; font-size: .85rem; }
.map-panel :deep(#map) { min-height: clamp(22rem, 55vh, 36rem); }
.section-title { margin-bottom: 1.25rem; font-size: clamp(1.5rem, 3vw, 2rem); }
.club-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
.club-card { padding: 1.35rem; border: 1px solid #d5d5d1; border-radius: 10px; background: #fff; }
.club-activity { display: inline-block; margin-bottom: .55rem; font-size: .8rem; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; }
.club-card h3 { margin: 0 0 .65rem; font-size: 1.15rem; }
.club-card h3 a { display: inline-flex; min-height: 44px; align-items: center; color: #242424; text-decoration: underline; text-decoration-color: #aaa; text-underline-offset: 5px; }
.club-card h3 a:hover { text-decoration-color: #242424; text-decoration-thickness: 2px; }
.club-city { display: flex; gap: .45rem; align-items: center; margin: 0; color: #606060; font-size: .9rem; }
@media (max-width: 767px) {
  .map-heading { align-items: start; padding: 1rem; }
  .map-panel :deep(#map) { min-height: 24rem; }
  .club-grid { grid-template-columns: 1fr; }
}
</style>
