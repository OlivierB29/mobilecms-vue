<template>
  <div class="container py-4">
    <h2>Calendar Activities</h2>
    <p class="text-muted">Activity: {{ activity || 'all' }}.</p>
    <ul class="list-group">
      <li v-for="event in events" :key="event.id" class="list-group-item">
        {{ event.title }}
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  activity: {
    type: String,
    default: null
  }
})

const events = [
  { id: 'e1', title: 'Event 1' },
  { id: 'e2', title: 'Event 2' },
  { id: 'e3', title: 'Event 3' }
]
</script>
