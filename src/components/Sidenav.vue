<template>
  <nav aria-label="Navigation principale" class="navbar navbar-expand-lg navbar-dark site-nav">
    <div class="container">
      <router-link class="navbar-brand" to="/"> {{ description.title || 'CRKDR Bretagne' }}</router-link>
      <button class="navbar-toggler" type="button" @click="menuOpen = !menuOpen" aria-controls="navbarNav" :aria-expanded="menuOpen" :aria-label="menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" :class="{ show: menuOpen }" id="navbarNav" @keydown.esc="closeMenu">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li v-for="item in menuItems" :key="item.id" class="nav-item">
            <router-link class="nav-link" :to="item.routerLink">
              <i aria-hidden="true" :class="['me-1', 'bi', item.icon]"></i>
              {{ item.title }}
            </router-link>
          </li>
        </ul>
        <SocialLinks :buttons="socialNetworks" />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import SocialLinks from './SocialLinks.vue'
import { getMenuData } from '../services/menuService'
import { getDescriptionHead } from '../services/apiService'
import type { SiteMetadata, SocialNetwork } from '../model/content'

type MenuItem = {
  id: string
  routerLink: string
  title: string
  icon: string
  order: number
}

const menuOpen = ref(false)
const route = useRoute()
watch(() => route.fullPath, () => { menuOpen.value = false })
function closeMenu() { menuOpen.value = false; document.querySelector<HTMLButtonElement>('.navbar-toggler')?.focus() }
const menuItems = ref<MenuItem[]>([])
const socialNetworks = ref<Array<Record<string, string>>>([])
const description = ref<SiteMetadata>({})

function normalizeSocialNetworks(networks: SocialNetwork[] | null | undefined) {
  return (networks || []).map((network) => ({
    icon: network.icon || getIconForNetwork(network.title),
    title: network.title || 'Social link',
    href: network.url || '#'
  }))
}

function getIconForNetwork(title?: string): string {
  const normalized = (title || '').toLowerCase()
  if (normalized.includes('youtube')) return 'bi-youtube'
  if (normalized.includes('discord')) return 'bi-discord'
  return 'bi-facebook'
}

onMounted(() => {
  menuItems.value = getMenuData('en')
  getDescriptionHead()
    .then((data) => {
      description.value = data || {}
      socialNetworks.value = normalizeSocialNetworks(data.socialnetworks)

    })
    .catch(() => {
      socialNetworks.value = []
    })
})
</script>

<style scoped>
.site-nav { background: #181818; padding: 1.3rem 0; border-bottom: 1px solid #444; }
.navbar-brand { font-size: 1rem; font-weight: 800; margin-right: 2rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.nav-link {
  white-space: nowrap; font-size: .8rem; padding: .6rem !important;
}
.nav-link.router-link-active { color: white; box-shadow: inset 0 -2px white; }
@media (min-width: 992px) and (max-width: 1199px) { .navbar-brand { margin-right: .5rem; } .nav-link { font-size: .72rem; padding: .4rem !important; } }
</style>
