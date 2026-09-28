<template>
  <div class="club-map-view">
    <h1 v-if="showClubList" class="visually-hidden">Carte des clubs de Bretagne</h1>
    <div id="map">
      <div v-if="loading" class="map-status" role="status">Chargement des clubs…</div>
      <div v-else-if="error" class="map-status error" role="alert">{{ error }}</div>

      <l-map ref="mapComponent" v-model:zoom="zoom" :center="defaultCenter" aria-label="Carte interactive des clubs de Bretagne" @ready="renderMarkers">
        <l-tile-layer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          layer-type="base"
          name="OpenStreetMap"
        ></l-tile-layer>
      </l-map>

      <aside class="map-legend" aria-label="Légende des disciplines">
        <span class="map-legend-title">Disciplines</span>
        <ul>
          <li v-for="discipline in disciplineLegend" :key="discipline.name">
            <span class="map-legend-color" :style="{ backgroundColor: discipline.color }" aria-hidden="true"></span>
            {{ discipline.name }}
          </li>
        </ul>
      </aside>
    </div>

    <section v-if="showClubList" class="container standalone-club-list" aria-labelledby="accessible-club-list-title">
      <h2 id="accessible-club-list-title">Liste des clubs présents sur la carte</h2>
      <ul>
        <li v-for="club in clubItems" :key="club.id || club.name">
          <router-link v-if="club.id" :to="`/clubs/${encodeURIComponent(String(club.id))}`">{{ club.title || club.name || 'Club' }}</router-link>
          <span v-else>{{ club.title || club.name || 'Club' }}</span>
          <span v-if="club.city"> — {{ club.city }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet'
import { getContentList } from '../services/apiService'
import { disciplineLegend, getDisciplineColor } from '../services/disciplineService'
import type { ActivityItem, ClubItem } from '../model/content'

const props = withDefaults(defineProps<{
  clubs?: ClubItem[] | null
  showClubList?: boolean
}>(), {
  clubs: null,
  showClubList: true
})

const mediaBaseUrl = import.meta.env.VITE_MEDIA_BASE_URL || '/media'
const mapComponent = ref<InstanceType<typeof LMap> | null>(null)
const zoom = ref(9)
const clubItems = ref<ClubItem[]>([])
const activities = ref<ActivityItem[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const defaultCenter: [number, number] = [48.233, -3.014]
let markerLayerGroup: ReturnType<typeof L.layerGroup> | null = null

const leafletMap = computed(() => mapComponent.value?.leafletObject)

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function buildMediaUrl(type: string, id: string | number, filename: string): string {
  if (!filename) return ''
  if (filename.startsWith('http') || filename.startsWith('//')) return filename
  return `${mediaBaseUrl}/${type}/${encodeURIComponent(String(id))}/${encodeURIComponent(filename)}`
}

function getActivityForClub(club: ClubItem): ActivityItem | null {
  const activityName = String(club.activity || '').trim().toLowerCase()
  if (!activityName) return null
  return activities.value.find((activity) => {
    return [activity.id, activity.name]
      .filter(Boolean)
      .map((value) => String(value).trim().toLowerCase())
      .includes(activityName)
  }) || null
}

function getMarkerIcon(club: ClubItem) {
  const activity = getActivityForClub(club)
  const fileName = activity?.mapicon || activity?.logo || ''
  const activityId = activity?.id || String(club.activity || '').trim()
  const activityColor = getDisciplineColor(club.activity || activity?.name)
  const iconUrl = fileName && activityId ? buildMediaUrl('activities', activityId, fileName) : ''
  const innerHtml = iconUrl
    ? `<img src="${iconUrl}" alt="" style="width:18px;height:18px;object-fit:contain;display:block" />`
    : '<span style="width:14px;height:14px;border-radius:50%;display:block"></span>'

  return L.divIcon({
    className: 'club-activity-marker',
    html: `<div style="width:32px;height:32px;border-radius:50%;background:${activityColor};display:flex;align-items:center;justify-content:center;box-shadow:0 3px 8px rgba(0,0,0,.28);border:2px solid rgba(255,255,255,.9)">${innerHtml}</div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -20]
  })
}

function getCoordinates(value?: string): [number, number] | null {
  if (!value) return null
  const [lat, lng] = value.split(',').map((part) => Number.parseFloat(part.trim()))
  return Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : null
}

async function renderMarkers(): Promise<void> {
  await nextTick()
  const map = leafletMap.value
  if (!map) return
  if (markerLayerGroup) map.removeLayer(markerLayerGroup)
  markerLayerGroup = L.layerGroup()
  const points: [number, number][] = []

  clubItems.value.forEach((club) => {
    const coordinates = getCoordinates(club.coordinates)
    if (!coordinates || !markerLayerGroup) return
    points.push(coordinates)
    const marker = L.marker(coordinates, {
      icon: getMarkerIcon(club),
      keyboard: true,
      title: club.title || club.name || 'Club',
      alt: `Localiser ${club.title || club.name || 'le club'}`
    })
    marker.bindPopup(`<div><strong>${escapeHtml(club.title || club.name || 'Club')}${club.activity ? ` - ${escapeHtml(club.activity)}` : ''}</strong>${club.city ? `<div>${escapeHtml(club.city)}</div>` : ''}${club.id ? `<div><a href="#/clubs/${encodeURIComponent(String(club.id))}">Voir le club</a></div>` : ''}</div>`)
    markerLayerGroup.addLayer(marker)
  })

  markerLayerGroup.addTo(map)
  if (points.length) map.fitBounds(points, { padding: [30, 30] })
}

async function loadActivities(): Promise<void> {
  try {
    const data = await getContentList('activities')
    activities.value = Array.isArray(data) ? data : []
  } catch (loadError) {
    console.warn('Impossible de charger les activités pour les icônes de la carte :', loadError)
  }
}

async function loadClubs(): Promise<void> {
  try {
    const data = await getContentList('clubs')
    clubItems.value = Array.isArray(data) ? data : []
  } catch (loadError) {
    error.value = loadError instanceof Error ? loadError.message : 'Impossible de charger les clubs.'
  }
}

async function refreshMap(source?: ClubItem[] | null): Promise<void> {
  loading.value = true
  error.value = null
  if (Array.isArray(source)) clubItems.value = source
  else await loadClubs()
  loading.value = false
  await renderMarkers()
}

onMounted(async () => {
  await loadActivities()
  await refreshMap(props.clubs)
})

watch(() => props.clubs, (clubs) => {
  if (Array.isArray(clubs)) void refreshMap(clubs)
})

onBeforeUnmount(() => {
  const map = leafletMap.value
  if (map && markerLayerGroup) map.removeLayer(markerLayerGroup)
})
</script>

<style>
#map {
  position: relative;
  width: 100%;
  min-height: clamp(28rem, 72vh, 52rem);
}

.map-status {
  width: fit-content;
  margin: 1rem 1rem 0;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  background: rgba(255, 255, 255, 0.9);
}

#map .leaflet-container {
  height: 100%;
  min-height: inherit;
}

.map-status.error {
  color: #b00020;
}

.map-legend {
  position: absolute;
  z-index: 1000;
  left: 0.75rem;
  bottom: 1.75rem;
  padding: 0.65rem 0.8rem;
  border: 1px solid #b8b8b3;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.16);
  color: #242424;
  font-size: 0.8rem;
}

.map-legend-title {
  display: block;
  margin-bottom: 0.35rem;
  font-weight: 700;
}

.map-legend ul {
  display: grid;
  gap: 0.25rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.map-legend li {
  display: flex;
  gap: 0.45rem;
  align-items: center;
}

.map-legend-color {
  width: 0.75rem;
  height: 0.75rem;
  flex: 0 0 auto;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 50%;
}

@media (max-width: 480px) {
  .map-legend {
    left: 0.5rem;
    bottom: 1.5rem;
  }
}

.standalone-club-list { padding-top: 2rem; padding-bottom: 2rem; }
.standalone-club-list h2 { font-size: 1.5rem; }
.standalone-club-list li { margin-bottom: .6rem; }
</style>
