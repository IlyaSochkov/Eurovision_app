<script setup>
const year = new Date().getFullYear();
</script>

<template>
  <footer class="bg-slate-900 text-slate-300 mt-12">
    <div class="max-w-6xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-3 text-sm">
      <div>
        <RouterLink to="/" class="flex items-center gap-2 text-xl font-bold hover:text-white/90 transition-colors">
          <img src="../assets/logo-1.png" alt="Logo" class="w-6 h-6 object-contain" />
          <span>Eurovision Library</span>
        </RouterLink>
        <p class="text-slate-400">
          Неофициальная библиотека песен конкурса Евровидение. Слушайте, создавайте плейлисты
          и делитесь отзывами.
        </p>
      </div>

      <div>
        <div class="font-semibold text-white mb-2">Разделы</div>
        <ul class="space-y-1">
          <li><RouterLink to="/library" class="hover:text-white">Библиотека</RouterLink></li>
          <li><RouterLink to="/playlists" class="hover:text-white">Мои плейлисты</RouterLink></li>
        </ul>
      </div>

      <div>
        <div class="font-semibold text-white mb-2">О проекте</div>
        <p class="text-slate-400">
          Учебный fullstack-проект: Vue 3 + Pinia + Tailwind / Node.js + Express + Sequelize +
          PostgreSQL.
        </p>
      </div>
    </div>

    <div class="border-t border-slate-800">
      <div class="max-w-6xl mx-auto px-4 py-4 text-xs text-slate-500 flex flex-col md:flex-row justify-between gap-2">
        <span>© {{ year }} Eurovision Library. Все права на песни принадлежат их авторам.</span>
        <span>Сделано в учебных целях · Сочков Илья</span>
      </div>
    </div>
  </footer>
</template>