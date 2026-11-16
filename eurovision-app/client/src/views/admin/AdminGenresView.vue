<script setup>
import { ref, onMounted } from 'vue';
import { getGenres, createGenre, updateGenre, deleteGenre } from '../../api/genres';
import ConfirmDialog from '../../components/ConfirmDialog.vue';

const genres = ref([]);
const formOpen = ref(false);
const editing = ref(null);
const form = ref({ title: '' });
const error = ref('');

const confirmOpen = ref(false);
const deleting = ref(false);
const targetId = ref(null);

async function load() {
  const { data } = await getGenres();
  genres.value = data;
}

function openCreate() {
  editing.value = null;
  form.value = { title: '' };
  formOpen.value = true;
  error.value = '';
}

function openEdit(g) {
  editing.value = g;
  form.value = { title: g.title };
  formOpen.value = true;
  error.value = '';
}

async function submit() {
  error.value = '';
  try {
    if (editing.value) await updateGenre(editing.value.id, form.value);
    else await createGenre(form.value);
    formOpen.value = false;
    await load();
  } catch (e) {
    error.value = e.response?.data?.error || 'Ошибка сохранения';
  }
}

function askDelete(id) {
  targetId.value = id;
  confirmOpen.value = true;
}

async function doDelete() {
  deleting.value = true;
  try {
    await deleteGenre(targetId.value);
    confirmOpen.value = false;
    await load();
  } catch (e) {
    alert(e.response?.data?.error || 'Не удалось удалить');
  } finally {
    deleting.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">Жанры</h1>
      <button class="btn-primary" @click="openCreate">+ Добавить</button>
    </div>

    <table class="w-full text-sm card">
      <thead class="text-left text-slate-500">
        <tr><th class="p-2">Название</th><th class="p-2"></th></tr>
      </thead>
      <tbody>
        <tr v-for="g in genres" :key="g.id" class="border-t border-slate-100">
          <td class="p-2">{{ g.title }}</td>
          <td class="p-2 text-right space-x-2">
            <button class="text-brand" @click="openEdit(g)">Изменить</button>
            <button class="text-red-600" @click="askDelete(g.id)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>

    <Teleport to="body">
      <div v-if="formOpen" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" @click.self="formOpen = false">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-3">
          <h3 class="text-lg font-bold">{{ editing ? 'Изменить жанр' : 'Новый жанр' }}</h3>
          <input v-model="form.title" class="input" placeholder="Название" />
          <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
          <div class="flex justify-end gap-2">
            <button class="btn-secondary" @click="formOpen = false">Отмена</button>
            <button class="btn-primary" @click="submit">Сохранить</button>
          </div>
        </div>
      </div>
    </Teleport>

    <ConfirmDialog
      v-model:open="confirmOpen"
      title="Удалить жанр?"
      message="Если к жанру привязаны песни, удаление будет отклонено."
      confirm-text="Удалить"
      :loading="deleting"
      @confirm="doDelete"
    />
  </div>
</template>