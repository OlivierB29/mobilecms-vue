<template>
  <div class="home-page container py-4">
    <div class="mb-4 text-center">
      <img :src="bannerUrl" alt="Banner" class="img-fluid rounded shadow-sm" />
    </div>

    <section class="mb-4 bg-white rounded shadow-sm p-4">
      <h2>Welcome to mobilecms</h2>
      <p class="lead">
        This Vue rewrite mirrors the original Angular mobilecms structure with routes for news, clubs, calendar, and content pages.
      </p>
    </section>

    <div class="row g-4">
      <div class="col-md-4" v-for="card in cards" :key="card.title">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">{{ card.title }}</h5>
            <p class="card-text">{{ card.description }}</p>
            <router-link class="btn btn-primary" :to="card.link">Open</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const bannerUrl = '/assets/banner-1900.jpg'

const cards = [
  { title: 'News', description: 'Browse the latest news content.', link: '/news' },
  { title: 'Clubs', description: 'Explore club activities and details.', link: '/clubs' },
  { title: 'Calendar', description: 'View the calendar and event details.', link: '/googlecalendar' }
]
</script>

<style scoped>
.home-page img {
  max-height: 320px;
  object-fit: cover;
  width: 100%;
}
</style>
