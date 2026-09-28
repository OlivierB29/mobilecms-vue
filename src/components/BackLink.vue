<template>
  <router-link :to="to" class="back-link">
    <i class="bi bi-arrow-left" aria-hidden="true"></i>
    {{ label }}
  </router-link>
</template>

<script setup lang="ts">
defineProps<{
  to: string
  label: string
}>()
</script>

<style scoped>
.back-link {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: .55rem;
  margin-bottom: 1rem;
  color: #353535;
  font-size: .9rem;
  font-weight: 700;
  text-decoration: none;
}
.back-link:hover { text-decoration: underline; text-underline-offset: 4px; }
</style>
