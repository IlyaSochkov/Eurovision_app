<script setup>
import { ref, onMounted } from 'vue';
import { getPlaylists, createPlaylist, addSongToPlaylist } from '../api/playlists';

const props = defineProps({
  open: { type: Boolean, default: false },
  songId: { type: [Number, String], required: true },
});

const emit = defineEmits(['update:open', 'added']);

const playlists = ref([]);
const loading = ref(false);
const newTitle = ref('');
const message = ref('');

async function loadPlaylists() {
  const { data } = await getPlaylists();
  playlists.value = data;
}

onMounted(loadPlaylists);

async function addToPlaylist(playlistId) {
  loading.value = true;
  message.value = '';
  try {
    await addSongToPlaylist(playlistId, props.songId);
    message.value = 'Песня добавлена!';
    emit('added');
    setTimeout(() => {
      emit('update:open', false);
      message.value = '';
    }, 1500);
  } catch (e) {
    message.value = e.response?.data?.error || 'Ошибка добавления (возможно, песня уже есть)';
  } finally {
    loading.value = false;
  }
}

async function createAndAdd() {
  if (!newTitle.value.trim()) return;
  loading.value = true;
  try {
    const { data } = await createPlaylist({ title: newTitle.value });
    await addToPlaylist(data.id);
    newTitle.value = '';
    await loadPlaylists();
  } catch (e) {
    message.value = e.response?.data?.error || 'Ошибка создания плейлиста';
    loading.value = false;
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      @click.self="emit('update:open', false)"
    >
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
        <h3 class="text-lg font-bold">Добавить в плейлист</h3>

        <p v-if="message" class="text-sm text-brand font-medium">{{ message }}</p>

        <div class="max-h-60 overflow-y-auto space-y-2">
          <div v-if="!playlists.length" class="text-slate-500 text-sm">У вас пока нет плейлистов</div>
          <button
            v-for="p in playlists"
            :key="p.id"
            class="w-full text-left px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            :disabled="loading"
            @click="addToPlaylist(p.id)"
          >
            {{ p.title }} <span class="text-slate-400 text-sm">({{ p.songs?.length || 0 }})</span>
          </button>
        </div>

        <div class="border-t border-slate-200 pt-4 space-y-2">
          <p class="text-sm font-medium text-slate-600">Или создайте новый:</p>
          <div class="flex gap-2">
            <input v-model="newTitle" class="input" placeholder="Название плейлиста" @keyup.enter="createAndAdd" />
            <button class="btn-primary whitespace-nowrap" :disabled="loading || !newTitle.trim()" @click="createAndAdd">
              Создать
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>