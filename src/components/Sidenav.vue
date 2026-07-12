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
import { getDescriptionHead } from '../services/apiService'

const menuItems = ref([])
const socialNetworks = ref([])

function normalizeSocialNetworks(networks) {
  return (networks || []).map((network) => ({
    icon: getIconForNetwork(network.title),
    title: network.title || 'Social link',
    href: network.url || '#'
  }))
}

function getIconForNetwork(title) {
  const normalized = (title || '').toLowerCase()
  if (normalized.includes('youtube')) return 'bi-youtube'
  if (normalized.includes('discord')) return 'bi-discord'
  return 'bi-facebook'
}

onMounted(() => {
  menuItems.value = getMenuData('en')
  getDescriptionHead()
    .then((data) => {
      socialNetworks.value = normalizeSocialNetworks(data.socialnetworks)
    })
    .catch(() => {
      socialNetworks.value = []
    })
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
