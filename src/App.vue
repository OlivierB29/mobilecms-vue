<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <Sidenav />
    <main class="flex-grow-1">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import Sidenav from './components/Sidenav.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<style>
body {
  margin: 0;
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
}

#app {
  background: #eef2ff;
}
</style>
