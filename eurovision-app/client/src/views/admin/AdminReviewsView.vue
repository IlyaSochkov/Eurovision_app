<script setup>
import { ref, onMounted } from 'vue';
import { getAllReviews, deleteAnyReview } from '../../api/admin.js';
import ConfirmDialog from '../../components/ConfirmDialog.vue';

const reviews = ref([]);
const confirmOpen = ref(false);
const deleting = ref(false);
const targetId = ref(null);
const error = ref('');

async function load() {
  try {
    const { data } = await getAllReviews();
    reviews.value = data;
  } catch (e) {
    error.value = e.response?.data?.error || 'Ошибка загрузки';
  }
}

function askDelete(id) {
  targetId.value = id;
  confirmOpen.value = true;
}

async function doDelete() {
  deleting.value = true;
  try {
    await deleteAnyReview(targetId.value);
    confirmOpen.value = false;
    await load();
  } catch (e) {
    error.value = e.response?.data?.error || 'Не удалось удалить';
  } finally {
    deleting.value = false;
  }
}

onMounted(load);
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Модерация отзывов</h1>
    <p v-if="error" class="text-red-600 text-sm mb-2">{{ error }}</p>
    <div v-if="!reviews.length" class="text-slate-500">Отзывов пока нет</div>

    <ul v-else class="space-y-2">
      <li v-for="r in reviews" :key="r.id" class="card flex flex-col md:flex-row md:items-center gap-3">
        <div class="flex-1">
          <div class="text-sm text-slate-500">
            {{ r.user?.email }} · {{ r.user?.first_name }} · песня «{{ r.song?.title }}»
          </div>
          <div class="font-medium">{{ r.rating }} ★</div>
          <div class="text-slate-700">{{ r.comment }}</div>
        </div>
        <button class="btn-danger self-start" @click="askDelete(r.id)">Удалить</button>
      </li>
    </ul>

    <ConfirmDialog
      v-model:open="confirmOpen"
      title="Удалить отзыв?"
      message="Отзыв будет удалён из базы безвозвратно."
      confirm-text="Удалить"
      :loading="deleting"
      @confirm="doDelete"
    />
  </div>
</template>