<template>
  <div class="card shadow-sm h-100">
    <div class="card-body">
      <h2 class="card-title">Carte régionale</h2>
      <p class="card-text text-muted">Localisation des clubs sur la carte de Bretagne.</p>
      <img :src="mapImageUrl" alt="Carte de localisation des clubs de Bretagne" class="img-fluid rounded border mt-3" />
      <div class="mt-3 d-flex gap-2">
        <router-link to="/carte" class="btn btn-outline-primary btn-sm">Ouvrir la carte</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { env } from '../env'

const mapImageUrl = computed(() => `${env.assetBaseUrl}/map.svg`)
</script>
