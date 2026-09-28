<template>
  <div class="d-flex flex-column min-vh-100">
    <a href="#main-content" class="visually-hidden-focusable">Aller au contenu</a>
    <Sidenav />
    <main id="main-content" class="flex-grow-1" tabindex="-1">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import Sidenav from './components/Sidenav.vue'
import AppFooter from './components/AppFooter.vue'
</script>
