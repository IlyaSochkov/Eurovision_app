<script setup>
import { ref, onMounted } from 'vue';
import { getUsers, updateUser } from '../../api/admin';
import { useAuthStore } from '../../stores/auth';

const auth = useAuthStore();
const users = ref([]);
const error = ref('');
const selectedUser = ref(null); // Для модалки

async function load() {
  const { data } = await getUsers();
  users.value = data;
}

async function changeRole(user, role) {
  if (user.id === auth.user.id && role !== 'admin') {
    if (!confirm('Вы снимаете с себя права администратора. Продолжить?')) return;
  }
  try {
    await updateUser(user.id, { role });
    await load();
    if (selectedUser.value?.id === user.id) selectedUser.value.role = role;
  } catch (e) {
    error.value = e.response?.data?.error || 'Ошибка';
  }
}

async function toggleBlock(user) {
  if (user.id === auth.user.id) {
    alert('Нельзя заблокировать самого себя');
    return;
  }
  try {
    await updateUser(user.id, { is_blocked: !user.is_blocked });
    await load();
    if (selectedUser.value?.id === user.id) selectedUser.value.is_blocked = !user.is_blocked;
  } catch (e) {
    error.value = e.response?.data?.error || 'Ошибка';
  }
}

onMounted(load);
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Пользователи</h1>
    <p v-if="error" class="text-red-600 text-sm mb-2">{{ error }}</p>

    <table class="w-full text-sm card">
      <thead class="text-left text-slate-500">
        <tr>
          <th class="p-2">Email</th>
          <th class="p-2">Имя</th>
          <th class="p-2">Роль</th>
          <th class="p-2">Статус</th>
          <th class="p-2"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in users" :key="u.id" class="border-t border-slate-100">
          <td class="p-2">
            <!-- Клик открывает детали -->
            <button class="text-brand hover:underline font-medium" @click="selectedUser = u">
              {{ u.email }}
            </button>
          </td>
          <td class="p-2">{{ u.first_name }} {{ u.last_name }}</td>
          <td class="p-2">
            <select
              :value="u.role"
              class="input py-1 text-sm"
              :disabled="u.id === auth.user.id"
              @change="changeRole(u, $event.target.value)"
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </td>
          <td class="p-2">
            <span :class="u.is_blocked ? 'text-red-600' : 'text-green-600'">
              {{ u.is_blocked ? 'Заблокирован' : 'Активен' }}
            </span>
          </td>
          <td class="p-2 text-right">
            <button
              class="text-sm"
              :class="u.is_blocked ? 'text-green-600' : 'text-red-600'"
              :disabled="u.id === auth.user.id"
              @click="toggleBlock(u)"
            >
              {{ u.is_blocked ? 'Разблокировать' : 'Заблокировать' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Модалка просмотра профиля -->
    <Teleport to="body">
      <div v-if="selectedUser" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" @click.self="selectedUser = null">
        <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
          <h3 class="text-xl font-bold border-b pb-2">Профиль пользователя</h3>
          <div class="space-y-2 text-sm">
            <p><span class="text-slate-500 w-24 inline-block">ID:</span> {{ selectedUser.id }}</p>
            <p><span class="text-slate-500 w-24 inline-block">Email:</span> {{ selectedUser.email }}</p>
            <p><span class="text-slate-500 w-24 inline-block">Имя:</span> {{ selectedUser.first_name }} {{ selectedUser.last_name }}</p>
            <p><span class="text-slate-500 w-24 inline-block">Роль:</span> {{ selectedUser.role }}</p>
            <p><span class="text-slate-500 w-24 inline-block">Статус:</span> 
              <span :class="selectedUser.is_blocked ? 'text-red-600' : 'text-green-600'">
                {{ selectedUser.is_blocked ? 'Заблокирован' : 'Активен' }}
              </span>
            </p>
            <p><span class="text-slate-500 w-24 inline-block">Создан:</span> {{ new Date(selectedUser.createdAt).toLocaleDateString() }}</p>
          </div>
          <div class="flex justify-end pt-2">
            <button class="btn-secondary" @click="selectedUser = null">Закрыть</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>