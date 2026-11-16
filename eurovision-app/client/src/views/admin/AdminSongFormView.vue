<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getSong, createSong, updateSong, uploadAudio } from '../../api/songs';
import { getArtists } from '../../api/artists';
import { getCountries } from '../../api/countries';
import { getGenres } from '../../api/genres';

const route = useRoute();
const router = useRouter();
const isEdit = computed(() => Boolean(route.params.id));

const form = ref({
  title: '', artist_id: '', country_id: '', genre_id: '',
  year: '', audio_url: '', video_url: '', lyrics: '',
});
const artists = ref([]); const countries = ref([]); const genres = ref([]);
const uploading = ref(false);
const error = ref('');

onMounted(async () => {
  const [a, c, g] = await Promise.all([getArtists(), getCountries(), getGenres()]);
  artists.value = a.data; countries.value = c.data; genres.value = g.data;
  if (isEdit.value) {
    const { data } = await getSong(route.params.id);
    form.value = {
      title: data.title, artist_id: data.artist_id, country_id: data.country_id,
      genre_id: data.genre_id, year: data.year, audio_url: data.audio_url,
      video_url: data.video_url, lyrics: data.lyrics,
    };
  }
});

async function onFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const fd = new FormData();
  fd.append('audio', file);
  uploading.value = true;
  try {
    const { data } = await uploadAudio(fd);
    form.value.audio_url = data.audio_url;
  } finally {
    uploading.value = false;
  }
}

async function submit() {
  error.value = '';
  try {
    if (isEdit.value) await updateSong(route.params.id, form.value);
    else await createSong(form.value);
    router.push('/admin/songs');
  } catch (e) {
    error.value = e.response?.data?.error || 'Ошибка сохранения';
  }
}
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">{{ isEdit ? 'Редактировать песню' : 'Новая песня' }}</h1>
  <form class="card space-y-3" @submit.prevent="submit">
    <input v-model="form.title" class="input" placeholder="Название" required />
    <select v-model.number="form.artist_id" class="input" required>
      <option value="">Артист</option>
      <option v-for="a in artists" :key="a.id" :value="a.id">{{ a.name }}</option>
    </select>
    <select v-model.number="form.country_id" class="input" required>
      <option value="">Страна</option>
      <option v-for="c in countries" :key="c.id" :value="c.id">{{ c.name }}</option>
    </select>
    <select v-model.number="form.genre_id" class="input" required>
      <option value="">Жанр</option>
      <option v-for="g in genres" :key="g.id" :value="g.id">{{ g.title }}</option>
    </select>
    <input v-model.number="form.year" type="number" class="input" placeholder="Год" required />
    <div class="space-y-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
  <label class="block text-sm font-medium text-slate-700">MP3-файл</label>
    
    <input 
      type="file" 
      accept=".mp3,audio/mpeg" 
      class="block w-full text-sm text-slate-500
        file:mr-4 file:py-2 file:px-4
        file:rounded-full file:border-0
        file:text-sm file:font-semibold
        file:bg-brand-light file:text-brand-dark
        hover:file:bg-brand file:hover:text-white
        cursor-pointer"
      @change="onFile" 
    />
    
    <div v-if="uploading" class="text-sm text-brand font-medium animate-pulse">
      ⏳ Загрузка файла на сервер...
    </div>
    
    <div v-else-if="form.audio_url" class="text-sm text-green-600 flex items-center gap-2">
      ✅ Файл готов: <span class="font-mono text-xs bg-green-100 px-1 rounded">{{ form.audio_url }}</span>
    </div>
  </div>
    <input v-model="form.video_url" class="input" placeholder="YouTube URL" />
    <textarea v-model="form.lyrics" class="input" rows="6" placeholder="Текст песни"></textarea>
    <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
    <button class="btn-primary">Сохранить</button>
  </form>
</template>