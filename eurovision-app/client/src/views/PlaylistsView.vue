<script setup>
import { ref, onMounted } from 'vue';
import { getPlaylists, createPlaylist, deletePlaylist } from '../api/playlists';

const playlists = ref([]);
const newTitle = ref('');

async function load() {
  const { data } = await getPlaylists();
  playlists.value = data;
}

async function add() {
  if (!newTitle.value.trim()) return;
  await createPlaylist({ title: newTitle.value });
  newTitle.value = '';
  await load();
}

async function remove(id) {
  if (!confirm('Удалить плейлист?')) return;
  await deletePlaylist(id);
  await load();
}

onMounted(load);
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">Мои плейлисты</h1>
  <div class="card mb-4 flex gap-2">
    <input v-model="newTitle" class="input" placeholder="Название нового плейлиста" />
    <button class="btn-primary" @click="add">Создать</button>
  </div>
  <div v-if="!playlists.length" class="text-slate-500">Пока нет плейлистов</div>
  <ul class="space-y-2">
    <li v-for="p in playlists" :key="p.id" class="card flex justify-between items-center">
      <RouterLink :to="`/playlists/${p.id}`" class="font-medium hover:text-brand">
        {{ p.title }} ({{ p.songs?.length || 0 }})
      </RouterLink>
      <button class="btn-danger text-sm" @click="remove(p.id)">Удалить</button>
    </li>
  </ul>
</template>