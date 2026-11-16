<script setup>
import { ref, onMounted } from 'vue';
import { getCountries, createCountry, updateCountry, deleteCountry } from '../../api/countries';
import ConfirmDialog from '../../components/ConfirmDialog.vue';

const countries = ref([]);
const error = ref('');
const formOpen = ref(false);
const editing = ref(null);
const form = ref({ name: '', flag_url: ''});

const confirmOpen = ref(false);
const deleting = ref(false);
const targetId = ref(null);

async function load() {
  const { data } = await getCountries();
  countries.value = data;
}

function openCreate() {
  editing.value = null;
  form.value = { name: '', flag_url: ''};
  formOpen.value = true;
  error.value = '';
}

function openEdit(c) {
  editing.value = c;
  form.value = {
    name: c.name,
    flag_url: c.flag_url || '',
    latitude: c.latitude,
    longitude: c.longitude,
  };
  formOpen.value = true;
  error.value = '';
}

async function submit() {
  error.value = '';
  try {
    if (editing.value) await updateCountry(editing.value.id, form.value);
    else await createCountry(form.value);
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
    await deleteCountry(targetId.value);
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
      <h1 class="text-2xl font-bold">Страны</h1>
      <button class="btn-primary" @click="openCreate">+ Добавить</button>
    </div>

    <table class="w-full text-sm card">
      <thead class="text-left text-slate-500">
        <tr>
          <th class="p-2">Флаг</th>
          <th class="p-2">Название</th>
          <th class="p-2"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="c in countries" :key="c.id" class="border-t border-slate-100">
          <td class="p-2"><img v-if="c.flag_url" :src="c.flag_url" class="w-8 h-5 rounded" /></td>
          <td class="p-2">{{ c.name }}</td>
          <td class="p-2 text-right space-x-2">
            <button class="text-brand" @click="openEdit(c)">Изменить</button>
            <button class="text-red-600" @click="askDelete(c.id)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Модалка формы -->
    <Teleport to="body">
      <div v-if="formOpen" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" @click.self="formOpen = false">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-3">
          <h3 class="text-lg font-bold">{{ editing ? 'Изменить страну' : 'Новая страна' }}</h3>
          <input v-model="form.name" class="input" placeholder="Название" />
          <input v-model="form.flag_url" class="input" placeholder="URL флага" />
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
      title="Удалить страну?"
      message="Если к стране привязаны артисты или песни, удаление будет отклонено."
      confirm-text="Удалить"
      :loading="deleting"
      @confirm="doDelete"
    />
  </div>
</template>