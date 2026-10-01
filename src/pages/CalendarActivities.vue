<template>
  <div class="container py-4">
    <h1>Événements par activité</h1>
    <p class="text-muted">Activité : {{ activity || 'toutes' }}.</p>
    <ul class="list-group">
      <li v-for="event in events" :key="event.id" class="list-group-item">
        {{ event.title }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  activity: {
    type: String,
    default: null
  }
})

const events = [
  { id: 'e1', title: 'Événement 1' },
  { id: 'e2', title: 'Événement 2' },
  { id: 'e3', title: 'Événement 3' }
]
</script>
