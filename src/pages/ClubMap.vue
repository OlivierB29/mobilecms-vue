<template>
  <div class="container py-4">
    <h2>Club map</h2>
    <p class="text-muted">Locations for clubs in the {{ activityLabel }} group.</p>

    <div v-if="loading" class="alert alert-info">Loading club locations...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
    <div v-else>
      <div class="card shadow-sm mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div v-for="club in clubs" :key="club.id" class="col-md-6">
              <div class="border rounded p-3 h-100">
                <div class="fw-semibold">{{ club.title || club.name || club.id }}</div>
                <div class="small text-muted">{{ club.city || 'Location not available' }}</div>
                <div class="mt-2 d-flex gap-2">
                  <router-link :to="`/club/${encodeURIComponent(club.id)}`" class="btn btn-outline-primary btn-sm">Open</router-link>
                  <a v-if="club.coordinates" :href="getMapsUrl(club.coordinates)" target="_blank" rel="noreferrer" class="btn btn-outline-secondary btn-sm">Directions</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="card shadow-sm">
        <div class="card-body">
          <div class="position-relative">
            <img :src="mapAssetUrl" alt="Regional map" class="img-fluid rounded border" />
            <div
              v-for="poi in poiMarkers"
              :key="poi.id"
              class="poi-marker"
              :style="{ left: `${poi.x}px`, top: `${poi.y}px` }"
              :title="poi.name"
              aria-hidden="true"
            />
            <a
              v-for="marker in markers"
              :key="marker.id"
              :href="`/club/${encodeURIComponent(marker.id)}`"
              class="marker-link"
              :style="{ left: `${marker.x}px`, top: `${marker.y}px` }"
              :title="marker.title"
            >
              <span class="marker-badge">●</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getContentList } from '../services/apiService'
import { env } from '../env'
import { buildCoordinateModel, convertGpsToXY, getVector } from '../services/coordinates'

const props = defineProps({
  activity: {
    type: String,
    default: null
  }
})

const activityLabel = computed(() => props.activity || 'all')
const clubs = ref([])
const loading = ref(true)
const error = ref(null)
const markers = ref([])
const poiMarkers = ref([
  { id: 'firstpoi', name: 'Roscoff', x: 330, y: 110 },
  { id: 'lastpoi', name: 'Penestin', x: 728, y: 600 }
])

const mapAssetUrl = computed(() => `${env.assetBaseUrl}/map.svg`)

function getMapsUrl(coordinates) {
  return `https://www.google.com/maps?q=${encodeURIComponent(coordinates)}`
}

function mapClubs(clubList) {
  const firstPoi = buildCoordinateModel('48.394157, -4.486726', '330, 110')
  const lastPoi = buildCoordinateModel('48.111990, -1.678607', '728, 600')
  const vector = buildCoordinateModel(getVector(firstPoi.gps, lastPoi.gps), getVector(firstPoi.map, lastPoi.map))

  return clubList
    .filter((club) => club.coordinates)
    .map((club) => {
      const coord = club.coordinates.replace(/\s+/g, '').split(',').filter(Boolean).map((value) => Number.parseFloat(value))
      const point = convertGpsToXY(coord, firstPoi, vector)

      return {
        id: club.id,
        title: club.title || club.name || club.id,
        x: point[0],
        y: point[1]
      }
    })
}

onMounted(() => {
  getContentList('clubs')
    .then((data) => {
      const list = data || []
      const filtered = props.activity
        ? list.filter((club) => club.activity === props.activity || club.category === props.activity)
        : list

      clubs.value = filtered
      markers.value = mapClubs(filtered)
    })
    .catch((err) => {
      error.value = err.message || 'Failed to load clubs.'
    })
    .finally(() => {
      loading.value = false
    })
})
</script>

<style scoped>
.marker-link {
  position: absolute;
  transform: translate(-50%, -50%);
  text-decoration: none;
}

.marker-badge {
  display: inline-block;
  color: #dc2626;
  font-size: 1.2rem;
  line-height: 1;
  text-shadow: 0 0 3px white;
}

.poi-marker {
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #2563eb;
  transform: translate(-50%, -50%);
  pointer-events: none;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.8);
}
</style>
