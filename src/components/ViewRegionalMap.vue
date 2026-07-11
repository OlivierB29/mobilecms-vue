<template>
  <div class="card shadow-sm h-100">
    <div class="card-body">
      <h5 class="card-title">Regional map</h5>
      <p class="card-text text-muted">Shows all club locations in one regional map.</p>
      <img :src="mapImageUrl" alt="Regional map" class="img-fluid rounded border mt-3" />
      <div class="mt-3 d-flex gap-2">
        <router-link to="/clubmap" class="btn btn-outline-primary btn-sm">Open map</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { env } from '../env'

const mapImageUrl = computed(() => `${env.assetBaseUrl}/map.svg`)
</script>
