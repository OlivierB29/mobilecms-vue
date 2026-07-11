<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">mobilecms</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li v-for="item in menuItems" :key="item.id" class="nav-item">
            <router-link class="nav-link" :to="item.routerLink">
              <i :class="['me-1', 'bi', item.icon]"></i>
              {{ item.title }}
            </router-link>
          </li>
        </ul>
        <SocialLinks :buttons="socialNetworks" />
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SocialLinks from './SocialLinks.vue'
import { getMenuData } from '../services/menuService'

const menuItems = ref([])
const socialNetworks = ref([
  { icon: 'bi-facebook', title: 'Facebook', href: 'https://facebook.com' },
  { icon: 'bi-twitter', title: 'Twitter', href: 'https://twitter.com' },
  { icon: 'bi-linkedin', title: 'LinkedIn', href: 'https://linkedin.com' }
])

onMounted(() => {
  menuItems.value = getMenuData('en')
})
</script>

<style scoped>
.navbar-brand {
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.nav-link {
  white-space: nowrap;
}
</style>
