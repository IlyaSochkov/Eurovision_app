<script setup>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import AudioPlayer from './components/AudioPlayer.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
      <RouterView />
    </main>
    <AppFooter />
    <AudioPlayer />
  </div>
</template>