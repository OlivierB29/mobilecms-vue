<template>
  <div class="d-flex gap-2 align-items-center">
    <a v-for="button in buttons" :key="button.title" :href="button.href" target="_blank" rel="noreferrer" class="btn btn-outline-light btn-sm" :title="button.title">
      <i :class="['bi', button.icon]"></i>
    </a>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  buttons: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped>
a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
