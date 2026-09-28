<template>
  <div class="rich-content" v-html="normalizedHtml"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ html?: string }>()

const normalizedHtml = computed(() => {
  const html = String(props.html || '')
  if (!html || typeof DOMParser === 'undefined') return html

  const documentFragment = new DOMParser().parseFromString(html, 'text/html')

  let previousHeadingLevel = 1
  documentFragment.body.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
    const originalLevel = Number(heading.tagName.slice(1))
    const level = Math.max(2, Math.min(originalLevel, previousHeadingLevel + 1))
    previousHeadingLevel = level
    if (originalLevel === level) return
    const replacement = documentFragment.createElement(`h${level}`)
    replacement.innerHTML = heading.innerHTML
    for (const attribute of Array.from(heading.attributes)) replacement.setAttribute(attribute.name, attribute.value)
    heading.replaceWith(replacement)
  })

  documentFragment.body.querySelectorAll('img').forEach((image) => {
    if (!image.hasAttribute('alt')) image.setAttribute('alt', image.getAttribute('title') || '')
  })

  documentFragment.body.querySelectorAll('a[target="_blank"]').forEach((link) => {
    if (!link.textContent?.includes('nouvelle fenêtre')) {
      const notice = documentFragment.createElement('span')
      notice.className = 'visually-hidden'
      notice.textContent = ' (nouvelle fenêtre)'
      link.appendChild(notice)
    }
  })

  return documentFragment.body.innerHTML
})
</script>

<style scoped>
.rich-content :deep(img) { max-width: 100%; height: auto; }
.rich-content :deep(a) { overflow-wrap: anywhere; }
</style>
