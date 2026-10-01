<template>
  <div class="container py-4">
    <h1>Calendrier</h1>
    
    <div class="ratio ratio-16x9" v-if="embedUrl">
      <iframe :src="embedUrl" title="Calendrier des événements du CRKDR Bretagne"></iframe>
    </div>

    <div v-if="loading" class="alert alert-info" role="status">Chargement des événements…</div>
    <div v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</div>


    
    <div v-else>
      <section v-if="upcomingEvents.length" aria-labelledby="upcoming-events-title" class="mb-4">
        <h2 id="upcoming-events-title" class="h4 mb-3">Événements à venir</h2>
        <ul class="list-group">
          <li v-for="item in upcomingEvents" :key="item.id" class="list-group-item">
        <div class="d-flex justify-content-between align-items-start">
          <div>
            <strong>{{item.title}}</strong>
            <div class="small text-muted">{{ formatDate(item.date || item.datetime) }}</div>
          </div>

              <router-link
      v-if="item.id"
      class="btn btn-sm btn-outline-primary"
      :to="{ name: 'CalendarEvent', params: { id: item.id } }"
    >
      Consulter
    </router-link>
        </div>
      </li>
        </ul>
      </section>

      <section v-if="pastEvents.length" aria-labelledby="past-events-title" class="mb-4">
        <h2 id="past-events-title" class="h4 mb-3">Événements passés</h2>
        <ul class="list-group">
          <li v-for="item in pastEvents" :key="item.id" class="list-group-item">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <strong>{{ item.title }}</strong>
                <div class="small text-muted">{{ formatDate(item.date || item.datetime) }}</div>
              </div>
              <router-link v-if="item.id" class="btn btn-sm btn-outline-primary" :to="{ name: 'CalendarEvent', params: { id: item.id } }">Consulter</router-link>
            </div>
          </li>
        </ul>
      </section>

      <p v-if="!upcomingEvents.length && !pastEvents.length" class="alert alert-secondary">Aucun événement à afficher.</p>
    </div>


  </div>
</template>

<script setup lang="ts">
import { filterEventsInWindow, formatDate, getItemTimestamp, splitEventsByDate } from '../services/dateService'
import { computed, ref, onMounted } from 'vue'
import { getContentList, getDescriptionHead } from '../services/apiService'
import type { ContentItem } from '../model/content'

const events = ref<ContentItem[]>([])
const embedUrl = ref<string>('')
const loading = ref<boolean>(true)
const error = ref<string | null>(null)

const upcomingEvents = computed(() => {
  return splitEventsByDate(events.value).upcoming
})

const pastEvents = computed(() => {
  return splitEventsByDate(events.value).past
})

const parseEventDate = (item: ContentItem): number => getItemTimestamp(item)


onMounted(() => {
  Promise.all([
    getContentList('calendar'),
    getDescriptionHead()
  ])
    .then(([calendarData, descriptionHead]) => {
      const url = descriptionHead?.googlecalendar?.embedurl || ''
      embedUrl.value = url

      events.value = filterEventsInWindow(calendarData || [])
        .sort((a: ContentItem, b: ContentItem) => parseEventDate(a) - parseEventDate(b))
    })
    .catch((err: Error) => {
      error.value = err.message || 'Impossible de charger le calendrier.'
    })
    .finally(() => {
      loading.value = false
    })
})
</script>
