<script setup>
import { ref, onMounted } from 'vue';
import { getSongs, deleteSong } from '../../api/songs';
import ConfirmDialog from '../../components/ConfirmDialog.vue';

const songs = ref([]);
const confirmOpen = ref(false);
const deleting = ref(false);
const targetId = ref(null);

async function load() {
  const { data } = await getSongs();
  songs.value = data;
}

function askDelete(id) {
  targetId.value = id;
  confirmOpen.value = true;
}

async function doDelete() {
  deleting.value = true;
  try {
    await deleteSong(targetId.value);
    confirmOpen.value = false;
    await load();
  } finally {
    deleting.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Песни</h1>
      <RouterLink to="/admin/songs/new" class="btn-primary">+ Добавить</RouterLink>
    </div>
    <table class="w-full text-sm card">
      <thead class="text-left text-slate-500">
        <tr>
          <th class="p-2">Название</th><th class="p-2">Артист</th>
          <th class="p-2">Год</th><th class="p-2"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="s in songs" :key="s.id" class="border-t border-slate-100">
          <td class="p-2">{{ s.title }}</td>
          <td class="p-2">{{ s.artist?.name }}</td>
          <td class="p-2">{{ s.year }}</td>
          <td class="p-2 text-right space-x-2">
            <RouterLink :to="`/admin/songs/${s.id}/edit`" class="text-brand">Изменить</RouterLink>
            <button class="text-red-600" @click="askDelete(s.id)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>

    <ConfirmDialog
      v-model:open="confirmOpen"
      title="Удалить песню?"
      message="Песня будет удалена безвозвратно. Её отзывы и связи с плейлистами тоже удалятся."
      confirm-text="Удалить"
      :loading="deleting"
      @confirm="doDelete"
    />
  </div>
</template>