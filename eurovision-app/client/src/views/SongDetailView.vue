<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getSong } from '../api/songs';
import { getReviewsForSong, createReview, updateReview, deleteReview } from '../api/reviews';
import { useAuthStore } from '../stores/auth';
import { usePlayerStore } from '../stores/player';
import AddToPlaylistModal from '../components/AddToPlaylistModal.vue';

const route = useRoute();
const auth = useAuthStore();
const player = usePlayerStore();

const song = ref(null);
const reviews = ref([]);
const form = ref({ rating: 5, comment: '' });
const editingId = ref(null);
const error = ref('');
const isPlaylistModalOpen = ref(false);

const myReview = computed(() =>
  reviews.value.find((r) => r.user_id === auth.user?.id)
);

async function load() {
  try {
    const { data } = await getSong(route.params.id);
    song.value = data;
    
    const r = await getReviewsForSong(route.params.id);
    reviews.value = r.data;
    
    if (myReview.value) {
      form.value = { rating: myReview.value.rating, comment: myReview.value.comment };
      editingId.value = myReview.value.id;
    }
  } catch (e) {
    error.value = 'Не удалось загрузить данные о песне';
  }
}

async function submitReview() {
  error.value = '';
  try {
    if (editingId.value) {
      await updateReview(editingId.value, form.value);
    } else {
      await createReview({ song_id: song.value.id, ...form.value });
    }
    await load();
  } catch (e) {
    error.value = e.response?.data?.error || 'Ошибка при сохранении отзыва';
  }
}

async function removeReview() {
  if (!confirm('Удалить отзыв?')) return;
  try {
    await deleteReview(editingId.value);
    editingId.value = null;
    form.value = { rating: 5, comment: '' };
    await load();
  } catch (e) {
    error.value = 'Не удалось удалить отзыв';
  }
}

onMounted(load);
</script>

<template>
  <div v-if="song" class="space-y-6 max-w-4xl mx-auto">
    <!-- Карточка песни -->
    <div class="card flex flex-col md:flex-row gap-6 items-start">
      <img 
        v-if="song.country?.flag_url" 
        :src="song.country.flag_url" 
        class="w-24 h-16 object-cover rounded shadow-sm border border-slate-100" 
        :alt="song.country.name"
      />
      
      <div class="flex-1">
        <h1 class="text-3xl font-bold text-slate-900">{{ song.title }}</h1>
        <p class="text-slate-600 mt-1">
          {{ song.artist?.name }} · {{ song.country?.name }} · {{ song.year }} · {{ song.genre?.title }}
        </p>
        
        <!-- Кнопки действий -->
        <div class="mt-5 flex flex-wrap gap-2">
          <!-- Кнопка Слушать -->
          <button 
            class="btn-primary flex items-center gap-2" 
            @click="player.play(song, [song])"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="ml-0.5">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Слушать
          </button>

          <!-- Кнопка В плейлист -->
          <button 
            v-if="auth.isAuthenticated" 
            class="btn-secondary flex items-center gap-2" 
            @click="isPlaylistModalOpen = true"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            В плейлист
          </button>

          <!-- Кнопка YouTube -->
          <a 
            v-if="song.video_url" 
            :href="song.video_url" 
            target="_blank" 
            class="btn-secondary flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" class="text-red-600">
              <path d="M21.582 6.186a2.6 2.6 0 0 0-1.835-1.835C18.12 3.9 12 3.9 12 3.9s-6.12 0-7.747.451A2.6 2.6 0 0 0 2.418 6.186C2 7.813 2 11 2 11s0 3.187.418 4.814a2.6 2.6 0 0 0 1.835 1.835c1.627.451 7.747.451 7.747.451s6.12 0 7.747-.451a2.6 2.6 0 0 0 1.835-1.835C22 14.187 22 11 22 11s0-3.187-.418-4.814zM10 15V7l5.5 4-5.5 4z"/>
            </svg>
            YouTube
          </a>
        </div>
      </div>
    </div>

    <!-- Текст песни -->
    <div v-if="song.lyrics" class="card">
      <h2 class="text-xl font-bold mb-4 text-slate-800">Текст песни</h2>
      <pre class="whitespace-pre-wrap font-sans text-slate-700 leading-relaxed">{{ song.lyrics }}</pre>
    </div>

    <!-- Отзывы -->
    <div class="card">
      <h2 class="text-xl font-bold mb-4 text-slate-800">Отзывы ({{ reviews.length }})</h2>
      
      <!-- Форма отзыва (для авторизованных) -->
      <div v-if="auth.isAuthenticated" class="space-y-3 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
        <div class="flex items-center gap-4">
          <label class="text-sm font-medium text-slate-700">Оценка:</label>
          <select v-model.number="form.rating" class="input w-24 py-1">
            <option v-for="n in 5" :key="n" :value="n">{{ n }} ★</option>
          </select>
        </div>
        <textarea 
          v-model="form.comment" 
          class="input" 
          rows="3" 
          placeholder="Поделитесь впечатлениями о песне..."
        ></textarea>
        
        <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
        
        <div class="flex gap-2">
          <button class="btn-primary" @click="submitReview">
            {{ editingId ? 'Обновить отзыв' : 'Оставить отзыв' }}
          </button>
          <button v-if="editingId" class="btn-danger" @click="removeReview">
            Удалить
          </button>
        </div>
      </div>

      <!-- Список отзывов -->
      <div v-if="!reviews.length" class="text-slate-500 text-sm italic">
        Пока нет отзывов. Будьте первым!
      </div>
      <ul v-else class="divide-y divide-slate-100">
        <li v-for="r in reviews" :key="r.id" class="py-4">
          <div class="flex items-center justify-between mb-1">
            <div class="font-medium text-slate-900">
              {{ r.user?.first_name }} {{ r.user?.last_name }}
            </div>
            <div class="text-amber-500 font-medium">{{ r.rating }} ★</div>
          </div>
          <div class="text-slate-700 text-sm">{{ r.comment }}</div>
        </li>
      </ul>
    </div>

    <!-- Модалка добавления в плейлист -->
    <AddToPlaylistModal 
      v-if="song"
      v-model:open="isPlaylistModalOpen" 
      :song-id="song.id" 
      @added="() => {}" 
    />
  </div>
</template>