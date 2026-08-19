<template>
  <div class="d-flex gap-2 align-items-center">
    <a v-for="button in buttons" :key="button.title" :href="button.href" target="_blank" rel="noreferrer" class="btn btn-outline-light btn-sm" :title="button.title">
      <i :class="['bi', button.icon]"></i>
    </a>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue'

type SocialButton = {
  title?: string
  href?: string
  icon?: string
}

const props = defineProps({
  buttons: {
    type: Array as PropType<SocialButton[]>,
    default: () => []
  }
})

const buttons = computed(() => props.buttons as SocialButton[])
</script>

<style scoped>
a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
