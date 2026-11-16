<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const form = ref({ email: '', password: '', first_name: '', last_name: '' });
const error = ref('');
const loading = ref(false);

async function submit() {
  error.value = '';
  loading.value = true;
  try {
    await auth.register(form.value);
    const redirect = route.query.redirect;
    // Если redirect — это главная или пусто, ведём в библиотеку
    if (!redirect || redirect === '/') {
      router.push('/library');
    } else {
      router.push(redirect);
    }
  } catch (e) {
    error.value = e.response?.data?.error || 'Ошибка регистрации';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="max-w-md mx-auto card mt-8">
    <h2 class="text-2xl font-bold mb-4">Регистрация</h2>
    <form @submit.prevent="submit" class="space-y-3">
      <input v-model="form.first_name" class="input" placeholder="Имя" required />
      <input v-model="form.last_name" class="input" placeholder="Фамилия" required />
      <input v-model="form.email" type="email" class="input" placeholder="Email" required />
      <input v-model="form.password" type="password" class="input" placeholder="Пароль" required />
      <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
      <button class="btn-primary w-full" :disabled="loading">
        {{ loading ? 'Регистрируем...' : 'Создать аккаунт' }}
      </button>
    </form>
  </div>
</template>