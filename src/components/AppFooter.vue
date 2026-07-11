<template>
  <footer class="app-footer bg-dark text-light py-3 mt-auto">
    <div class="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
      <div>
        <strong>mobilecms</strong> • Vue rewrite of the original MobileCMS app
      </div>
      <div class="d-flex gap-3">
        <router-link class="text-light text-decoration-none" to="/">Home</router-link>
        <a class="text-light text-decoration-none" href="https://github.com/OlivierB29/mobilecms" target="_blank" rel="noreferrer">GitHub</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.app-footer {
  font-size: 0.95rem;
}
</style>
