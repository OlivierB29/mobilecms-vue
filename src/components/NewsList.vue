<template>
  <div class="news-list">
    <article v-for="item in items" :key="item.id" class="news-card">
      <div class="news-visual">
        <img v-if="item.image?.url" :src="item.image.url" :alt="item.image.title || ''" />
        <span v-else aria-hidden="true">CRKDR</span>
      </div>
      <div class="news-content">
        <time v-if="getNewsDate(item)" class="news-date" :datetime="getNewsDate(item)">{{ formatDate(getNewsDate(item)) }}</time>
        <component :is="`h${headingLevel}`">{{ item.title || item.name || item.id }}</component>
        <p v-if="getContentText(item)">{{ getContentText(item) }}</p>
        <router-link class="news-link" :to="`/actualites/${item.id}`" :aria-label="`Lire l’actualité : ${item.title || item.name || item.id}`">
          Lire l’actualité <i class="bi bi-arrow-right" aria-hidden="true"></i>
        </router-link>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
import type { ContentItem } from '../model/content'
import { formatDate } from '../services/dateService'
import { getContentText, getNewsDate } from '../services/newsService'

withDefaults(defineProps<{
  items: ContentItem[]
  headingLevel?: 2 | 3
}>(), {
  headingLevel: 2
})
</script>

<style scoped>
.news-list { border-top: 1px solid #cececa; }
.news-card { display: grid; grid-template-columns: minmax(180px, 28%) 1fr; gap: 1.75rem; padding: 1.5rem 0; border-bottom: 1px solid #cececa; }
.news-visual { display: flex; min-height: 160px; align-items: center; justify-content: center; overflow: hidden; border-radius: 8px; background: #dededb; color: #595959; font-size: .72rem; font-weight: 800; letter-spacing: .18em; }
.news-visual img { width: 100%; height: 100%; min-height: 160px; object-fit: cover; }
.news-content { display: flex; min-width: 0; flex-direction: column; align-items: flex-start; justify-content: center; }
.news-date { display: block; margin-bottom: .55rem; color: #626262; font-size: .78rem; font-weight: 700; letter-spacing: .06em; }
.news-content :is(h2, h3) { margin-bottom: .6rem; font-size: clamp(1.2rem, 2vw, 1.65rem); }
.news-content p { display: -webkit-box; max-width: 760px; margin-bottom: .8rem; overflow: hidden; color: #555; line-height: 1.55; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.news-link { display: inline-flex; min-height: 44px; align-items: center; gap: .55rem; color: #242424; font-size: .9rem; font-weight: 700; }
.news-link:hover { text-decoration-thickness: 2px; }
@media (max-width: 767px) {
  .news-card { grid-template-columns: 110px 1fr; gap: 1rem; padding: 1rem 0; }
  .news-visual, .news-visual img { min-height: 110px; }
  .news-content p { display: none; }
  .news-content :is(h2, h3) { font-size: 1.05rem; }
}
@media (max-width: 420px) {
  .news-card { grid-template-columns: 1fr; }
  .news-visual, .news-visual img { height: 180px; }
}
</style>
