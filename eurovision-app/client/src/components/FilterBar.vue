<script setup>
import { ref, onMounted, watch } from 'vue';
import { getCountries } from '../api/countries';
import { getGenres } from '../api/genres';

const emit = defineEmits(['change']);
const countries = ref([]);
const genres = ref([]);

const filters = ref({ year: '', country_id: '', genre_id: '', search: '' });

onMounted(async () => {
  const [c, g] = await Promise.all([getCountries(), getGenres()]);
  countries.value = c.data;
  genres.value = g.data;
});

watch(filters, () => emit('change', { ...filters.value }), { deep: true });

function reset() {
  filters.value = { year: '', country_id: '', genre_id: '', search: '' };
}
</script>

<template>
  <div class="card grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
    <input v-model="filters.search" class="input" placeholder="Поиск по названию" />
    <input v-model="filters.year" type="number" class="input" placeholder="Год" />
    <select v-model="filters.country_id" class="input">
      <option value="">Все страны</option>
      <option v-for="c in countries" :key="c.id" :value="c.id">{{ c.name }}</option>
    </select>
    <select v-model="filters.genre_id" class="input">
      <option value="">Все жанры</option>
      <option v-for="g in genres" :key="g.id" :value="g.id">{{ g.title }}</option>
    </select>
    <button class="btn-secondary" @click="reset">Сбросить</button>
  </div>
</template>