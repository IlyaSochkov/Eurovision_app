<script setup>
import { ref, onMounted } from 'vue';
import { getArtists, createArtist, updateArtist, deleteArtist } from '../../api/artists';
import { getCountries } from '../../api/countries';
import ConfirmDialog from '../../components/ConfirmDialog.vue';

const artists = ref([]);
const countries = ref([]);
const formOpen = ref(false);
const editing = ref(null);
const form = ref({ name: '', bio: '', country_id: '' });
const error = ref('');

const confirmOpen = ref(false);
const deleting = ref(false);
const targetId = ref(null);

async function load() {
  const [a, c] = await Promise.all([getArtists(), getCountries()]);
  artists.value = a.data;
  countries.value = c.data;
}

function openCreate() {
  editing.value = null;
  form.value = { name: '', bio: '', country_id: '' };
  formOpen.value = true;
  error.value = '';
}

function openEdit(a) {
  editing.value = a;
  form.value = { name: a.name, bio: a.bio || '', country_id: a.country_id };
  formOpen.value = true;
  error.value = '';
}

async function submit() {
  error.value = '';
  try {
    if (editing.value) await updateArtist(editing.value.id, form.value);
    else await createArtist(form.value);
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
    await deleteArtist(targetId.value);
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
      <h1 class="text-2xl font-bold">Исполнители</h1>
      <button class="btn-primary" @click="openCreate">+ Добавить</button>
    </div>

    <table class="w-full text-sm card">
      <thead class="text-left text-slate-500">
        <tr>
          <th class="p-2">Имя</th>
          <th class="p-2">Страна</th>
          <th class="p-2"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="a in artists" :key="a.id" class="border-t border-slate-100">
          <td class="p-2">{{ a.name }}</td>
          <td class="p-2">{{ a.country?.name || '—' }}</td>
          <td class="p-2 text-right space-x-2">
            <button class="text-brand" @click="openEdit(a)">Изменить</button>
            <button class="text-red-600" @click="askDelete(a.id)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>

    <Teleport to="body">
      <div v-if="formOpen" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" @click.self="formOpen = false">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-3">
          <h3 class="text-lg font-bold">{{ editing ? 'Изменить исполнителя' : 'Новый исполнитель' }}</h3>
          <input v-model="form.name" class="input" placeholder="Имя" />
          <select v-model.number="form.country_id" class="input">
            <option value="">Страна</option>
            <option v-for="c in countries" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
          <textarea v-model="form.bio" class="input" rows="4" placeholder="Биография"></textarea>
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
      title="Удалить исполнителя?"
      message="Если у исполнителя есть песни, удаление будет отклонено."
      confirm-text="Удалить"
      :loading="deleting"
      @confirm="doDelete"
    />
  </div>
</template>