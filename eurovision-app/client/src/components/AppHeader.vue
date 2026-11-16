<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const router = useRouter();

function logout() {
  auth.logout();
  router.push('/');
}
</script>

<template>
  <header class="bg-brand text-white shadow">
    <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <RouterLink to="/" class="flex items-center gap-2 text-xl font-bold hover:text-white/90 transition-colors">
        <img src="../assets/logo-1.png" alt="Logo" class="w-6 h-6 object-contain" />
        <span>Eurovision Library</span>
      </RouterLink>
      <nav class="flex items-center gap-4 text-sm">
        <RouterLink to="/library" class="hover:underline">Библиотека</RouterLink>
        <template v-if="auth.isAuthenticated">
          <RouterLink to="/playlists" class="hover:underline">Плейлисты</RouterLink>
          <RouterLink to="/profile" class="hover:underline">{{ auth.user.first_name }}</RouterLink>
          <RouterLink v-if="auth.isAdmin" to="/admin" class="hover:underline">Админка</RouterLink>
          <button class="btn-secondary text-sm" @click="logout">Выйти</button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="hover:underline">Вход</RouterLink>
          <RouterLink to="/register" class="btn-secondary text-sm">Регистрация</RouterLink>
        </template>
      </nav>
    </div>
  </header>
</template>