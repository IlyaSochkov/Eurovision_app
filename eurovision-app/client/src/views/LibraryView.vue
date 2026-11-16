<script setup>
import { ref, computed, onMounted } from 'vue';
import { getSongs } from '../api/songs';
import SongCard from '../components/SongCard.vue';
import FilterBar from '../components/FilterBar.vue';
import Pagination from '../components/Pagination.vue';

const allSongs = ref([]);
const loading = ref(false);
const page = ref(1);
const perPage = 8;

const visibleSongs = computed(() => {
  const start = (page.value - 1) * perPage;
  return allSongs.value.slice(start, start + perPage);
});

async function load(filters = {}) {
  loading.value = true;
  try {
    const clean = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '' && v != null)
    );
    const { data } = await getSongs(clean);
    allSongs.value = data;
    page.value = 1;
  } finally {
    loading.value = false;
  }
}

onMounted(() => load());
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">Библиотека песен</h1>
  <FilterBar @change="load" />
  <div v-if="loading" class="text-slate-500">Загрузка...</div>
  <div v-else-if="!allSongs.length" class="text-slate-500">Ничего не найдено</div>
  <template v-else>
    <div class="grid gap-3 md:grid-cols-2">
      <SongCard v-for="s in visibleSongs" :key="s.id" :song="s" :playlist="songs"/>
    </div>
    <Pagination v-model:page="page" :total="allSongs.length" :per-page="perPage" />
  </template>
</template>