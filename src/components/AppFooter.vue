<template>
  <footer class="app-footer mt-auto">
    <div class="container footer-content">
      <router-link to="/" class="footer-brand">CRKDR · Bretagne</router-link>
      <nav aria-label="Liens de pied de page" class="footer-links">
        <router-link to="/clubs">Les clubs</router-link>
        <router-link to="/documents">Documents</router-link>
        <router-link to="/contact">Contact</router-link>
      </nav>
    </div>
  </footer>
</template>
<style scoped>
.app-footer { background: #181818; padding: .5rem 0; font-size: .8rem; }
.footer-content, .footer-links { display: flex; align-items: center; flex-wrap: wrap; gap: .25rem 1.5rem; }
.footer-content { justify-content: space-between; }
a { display: inline-flex; align-items: center; min-height: 44px; color: #eee; text-decoration: none; }
a:hover { text-decoration: underline; }
.footer-brand { font-weight: 700; letter-spacing: .06em; }
@media (max-width: 575px) { .footer-content { justify-content: center; gap: 0 1.5rem; } .footer-links { justify-content: center; } }
</style>
