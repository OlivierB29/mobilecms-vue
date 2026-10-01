<template>
  <div class="d-flex flex-column min-vh-100">
    <a href="#main-content" class="skip-link" @click.prevent="skipToContent">Aller au contenu</a>
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

function skipToContent() {
  document.querySelector<HTMLElement>('#main-content')?.focus()
}
</script>

<style scoped>
.skip-link {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 2000;
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  max-width: calc(100vw - 2rem);
  padding: 0.65rem 1rem;
  border: 2px solid #242424;
  border-radius: 6px;
  background: #fff;
  color: #242424;
  font-weight: 700;
  text-decoration: underline;
  transform: translateY(calc(-100% - 2rem));
}

.skip-link:focus {
  transform: translateY(0);
  outline: 3px solid #fff;
  outline-offset: 3px;
  box-shadow: 0 0 0 6px #242424;
}
</style>
