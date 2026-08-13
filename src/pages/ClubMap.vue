<template>
  <div class="container py-4">
    <h2>Club map</h2>
    <p class="text-muted">Locations for clubs in the {{ activityLabel }} group.</p>

    <div v-if="loading" class="alert alert-info">Loading club locations...</div>
    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { env } from '../env'

const props = defineProps({
  activity: {
    type: String,
    default: null
  }
})

const activityLabel = computed(() => props.activity || 'all')
const loading = ref(false)
const error = ref<string | null>(null)
const mapAssetUrl = computed(() => `${env.assetBaseUrl}/map.svg`)

void mapAssetUrl
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
