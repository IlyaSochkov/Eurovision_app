<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const router = useRouter();
const form = ref({ first_name: auth.user.first_name, last_name: auth.user.last_name, password: '' });
const message = ref('');

async function save() {
  const payload = { first_name: form.value.first_name, last_name: form.value.last_name };
  if (form.value.password) payload.password = form.value.password;
  await auth.updateProfile(payload);
  message.value = 'Сохранено';
  form.value.password = '';
}

async function remove() {
  if (!confirm('Удалить профиль? Это действие необратимо.')) return;
  await auth.deleteProfile();
  router.push('/');
}
</script>

<template>
  <div class="max-w-lg mx-auto space-y-4">
    <h1 class="text-2xl font-bold">Профиль</h1>
    <div class="card space-y-3">
      <p class="text-sm text-slate-500">Email: {{ auth.user.email }}</p>
      <p class="text-sm text-slate-500">Роль: {{ auth.user.role }}</p>
      <input v-model="form.first_name" class="input" placeholder="Имя" />
      <input v-model="form.last_name" class="input" placeholder="Фамилия" />
      <input v-model="form.password" type="password" class="input" placeholder="Новый пароль (опционально)" />
      <p v-if="message" class="text-green-600 text-sm">{{ message }}</p>
      <button class="btn-primary" @click="save">Сохранить</button>
    </div>
    <button class="btn-danger" @click="remove">Удалить профиль</button>
  </div>
</template>