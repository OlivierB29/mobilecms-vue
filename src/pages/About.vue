<template>
  <div class="container py-4">
    <div class="card shadow-sm">
      <div class="card-body">
        <h1 class="card-title" :title="fullTitle">{{ fullTitle || title }}</h1>
        <p class="text-muted">{{ title }}</p>
        <p v-if="keywords.length" class="mb-0">
          <span class="me-2">Mots-clés :</span>
          <span v-for="keyword in keywords" :key="keyword" class="badge bg-secondary me-2">{{ keyword }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getDescriptionHead } from '../services/apiService'
import type { SiteMetadata } from '../model/content'

const metadata = ref<SiteMetadata>({})
const title = computed(() => metadata.value.title || 'mobilecms')
const fullTitle = computed(() => metadata.value.fulltitle || title.value)
const keywords = computed(() => {
  const raw = String(metadata.value.keywords || '')
  return raw
    .split(',')
    .map((value: string) => value.trim())
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
