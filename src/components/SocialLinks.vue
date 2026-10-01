<template>
  <div v-if="buttons.length" class="social-links" role="group" aria-label="Réseaux sociaux">
    <a v-for="button in buttons" :key="button.title" :href="button.href" target="_blank" rel="noreferrer" class="social-link" :title="`${button.title || 'Réseau social'} (nouvelle fenêtre)`" :aria-label="`${button.title || 'Réseau social'} (nouvelle fenêtre)`">
      <i aria-hidden="true" :class="['bi', button.icon]"></i>
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
.social-links { display: flex; flex-wrap: wrap; align-items: center; gap: .25rem; padding-left: .75rem; margin-left: .5rem; border-left: 1px solid #555; }
.social-link { display: inline-flex; align-items: center; justify-content: center; width: 44px; height: 44px; border-radius: 50%; color: #ddd; text-decoration: none; font-size: 1.15rem; }
.social-link:hover { color: #fff; background: #383838; }
.social-link:focus-visible { outline: 2px solid white; outline-offset: 2px; }
@media (max-width: 991px) { .social-links { margin: .5rem 0 0; padding: .5rem 0 0; border-left: 0; border-top: 1px solid #555; } }
</style>
