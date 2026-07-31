<template>
  <div class="container py-4">
    <div class="card shadow-sm">
      <div class="card-body">
        <h2 class="card-title" :title="fullTitle">{{ fullTitle || title }}</h2>
        <p class="text-muted">{{ title }}</p>
        <p v-if="keywords.length" class="mb-0">
          <span class="me-2">Keywords:</span>
          <span v-for="keyword in keywords" :key="keyword" class="badge bg-secondary me-2">{{ keyword }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getDescriptionHead } from '../services/apiService'

const metadata = ref({})
const title = computed(() => metadata.value.title || 'mobilecms')
const fullTitle = computed(() => metadata.value.fulltitle || title.value)
const keywords = computed(() => {
  const raw = metadata.value.keywords || ''
  return raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
})

onMounted(() => {
  getDescriptionHead()
    .then((data) => {
      metadata.value = data || {}

    })
    .catch(() => {
      metadata.value = {}
    })


})
</script>
