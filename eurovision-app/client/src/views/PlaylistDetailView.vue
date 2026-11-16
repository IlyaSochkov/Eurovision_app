<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPlaylist, removeSongFromPlaylist, updatePlaylist, deletePlaylist } from '../api/playlists';
import { usePlayerStore } from '../stores/player';
import ConfirmDialog from '../components/ConfirmDialog.vue';

const route = useRoute();
const router = useRouter();
const player = usePlayerStore();
const playlist = ref(null);
const error = ref('');

// --- Состояние для переименования ---
const isRenameOpen = ref(false);
const newTitle = ref('');
const isSaving = ref(false);

// --- Состояние для удаления плейлиста ---
const isDeletePlaylistOpen = ref(false);
const isDeletingPlaylist = ref(false);

async function load() {
  try {
    const { data } = await getPlaylist(route.params.id);
    playlist.value = data;
    newTitle.value = data.title;
  } catch (e) {
    error.value = 'Плейлист не найден';
  }
}

function playAll() {
  if (playlist.value?.songs?.length) {
    player.play(playlist.value.songs[0], playlist.value.songs);
  }
}

function playSingle(song) {
  player.play(song, playlist.value.songs);
}

async function removeSong(songId) {
  if (!confirm('Удалить песню из плейлиста?')) return;
  try {
    await removeSongFromPlaylist(route.params.id, songId);
    await load();
  } catch (e) {
    alert('Ошибка удаления');
  }
}

// --- Функция переименования ---
async function saveTitle() {
  if (!newTitle.value.trim()) return;
  isSaving.value = true;
  try {
    await updatePlaylist(route.params.id, { title: newTitle.value });
    playlist.value.title = newTitle.value;
    isRenameOpen.value = false;
  } catch (e) {
    alert('Ошибка сохранения');
  } finally {
    isSaving.value = false;
  }
}

// --- Функция удаления всего плейлиста ---
async function doDeletePlaylist() {
  isDeletingPlaylist.value = true;
  try {
    await deletePlaylist(route.params.id);
    router.push('/playlists');
  } catch (e) {
    alert('Ошибка удаления плейлиста');
    isDeletingPlaylist.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div v-if="playlist" class="space-y-6">
    <!-- Заголовок и кнопки управления -->
    <div class="flex items-center justify-between flex-wrap gap-4">
      <div class="flex items-center gap-3">
        <h1 class="text-2xl font-bold">{{ playlist.title }}</h1>
        <!-- Кнопка переименования -->
        <button class="text-slate-400 hover:text-brand" @click="isRenameOpen = true" title="Переименовать">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
        </button>
      </div>
      
      <div class="flex items-center gap-2">
        <button class="btn-primary flex items-center gap-2" :disabled="!playlist.songs?.length" @click="playAll">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="ml-0.5"><path d="M8 5v14l11-7z"/></svg>
          Играть всё
        </button>
        <button class="btn-danger" @click="isDeletePlaylistOpen = true" title="Удалить плейлист">
          Удалить
        </button>
      </div>
    </div>

    <div v-if="!playlist.songs?.length" class="text-slate-500">
      Плейлист пуст. Добавьте песни из библиотеки!
    </div>

    <!-- Список песен -->
    <ul v-else class="space-y-2">
      <li v-for="s in playlist.songs" :key="s.id" class="card flex items-center gap-4 group hover:shadow-md transition-shadow">
        <img v-if="s.country?.flag_url" :src="s.country.flag_url" class="w-10 h-7 object-cover rounded shadow-sm" />
        <div class="flex-1 min-w-0">
          <RouterLink :to="`/songs/${s.id}`" class="font-medium hover:text-brand truncate block">{{ s.title }}</RouterLink>
          <div class="text-sm text-slate-500 truncate">{{ s.artist?.name }} · {{ s.year }}</div>
        </div>
        
        <!-- Play -->
        <button class="w-10 h-10 flex items-center justify-center rounded-full bg-brand text-white shadow-sm hover:bg-brand-dark transition-all transform group-hover:scale-105" @click="playSingle(s)">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="ml-0.5"><path d="M8 5v14l11-7z"/></svg>
        </button>

        <!-- Удалить из плейлиста -->
        <button class="p-2 text-red-500 hover:text-red-700 transition-colors rounded-full hover:bg-red-50" @click="removeSong(s.id)" title="Удалить из плейлиста">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </li>
    </ul>

    <!-- Модалка переименования -->
    <Teleport to="body">
      <div v-if="isRenameOpen" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" @click.self="isRenameOpen = false">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">
          <h3 class="text-lg font-bold">Переименовать плейлист</h3>
          <input v-model="newTitle" class="input" placeholder="Новое название" @keyup.enter="saveTitle" />
          <div class="flex justify-end gap-2">
            <button class="btn-secondary" @click="isRenameOpen = false">Отмена</button>
            <button class="btn-primary" :disabled="isSaving" @click="saveTitle">
              {{ isSaving ? 'Сохранение...' : 'Сохранить' }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Модалка удаления плейлиста -->
    <ConfirmDialog
      v-model:open="isDeletePlaylistOpen"
      title="Удалить плейлист?"
      message="Все песни останутся в библиотеке, но плейлист будет удален безвозвратно."
      confirm-text="Удалить"
      :loading="isDeletingPlaylist"
      @confirm="doDeletePlaylist"
    />
  </div>
</template>