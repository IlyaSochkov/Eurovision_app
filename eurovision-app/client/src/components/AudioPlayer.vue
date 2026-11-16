<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { usePlayerStore } from '../stores/player';

const player = usePlayerStore();
const audio = ref(null);
const progress = ref(0);
const currentTime = ref(0);
const duration = ref(0);

// Форматирование времени (например, 3:45)
const formatTime = (secs) => {
  if (!secs || isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

onMounted(() => {
  if (audio.value) {
    player.setAudioEl(audio.value);
    
    audio.value.addEventListener('ended', () => player.next());
    
    audio.value.addEventListener('play', () => { player.isPlaying = true; });
    audio.value.addEventListener('pause', () => { player.isPlaying = false; });

    audio.value.addEventListener('timeupdate', () => {
      if (audio.value.duration) {
        currentTime.value = audio.value.currentTime;
        duration.value = audio.value.duration;
        progress.value = (audio.value.currentTime / audio.value.duration) * 100;
      }
    });
  }
});

// При смене песни сбрасываем прогресс
watch(() => player.currentSong, () => {
  progress.value = 0;
  currentTime.value = 0;
});

// Обработка перемотки (клик по ползунку)
function onSeek(e) {
  const time = Number(e.target.value);
  if (audio.value) {
    audio.value.currentTime = time;
    currentTime.value = time;
  }
}
</script>

<template>
  <!-- Скрытый тег audio -->
  <audio ref="audio" class="hidden"></audio>

  <div
    v-if="player.currentSong"
    class="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.1)]"
  >
    <div class="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center gap-4">
      
      <!-- Информация о треке (Слева) -->
      <div class="flex-1 min-w-0 flex items-center gap-3 w-full md:w-auto">
        <img 
          v-if="player.currentSong.country?.flag_url" 
          :src="player.currentSong.country.flag_url" 
          class="w-10 h-7 object-cover rounded shadow-sm hidden sm:block" 
        />
        <div class="min-w-0">
          <div class="font-medium text-slate-900 truncate">{{ player.currentSong.title }}</div>
          <div class="text-sm text-slate-500 truncate">{{ player.currentSong.artist?.name }}</div>
        </div>
      </div>

      <!-- Управление и прогресс (Центр) -->
      <div class="flex-1 flex flex-col items-center w-full max-w-lg">
        <!-- Кнопки -->
        <div class="flex items-center gap-2 sm:gap-4 mb-2">
          
          <button class="p-2 text-slate-600 hover:text-brand transition-colors rounded-full hover:bg-slate-100" @click="player.prev" title="Предыдущий трек">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.477 12l8.477-5.775c.47-.32.846-.22.846.22v11.11c0 .44-.376.54-.846.22L11.477 12zm-9 0l8.477-5.775c.47-.32.846-.22.846.22v11.11c0 .44-.376.54-.846.22L2.477 12z"/></svg>
          </button>

          <button class="p-3 bg-brand text-white rounded-full hover:bg-brand-dark transition-colors shadow-md flex items-center justify-center" @click="player.toggle">
            <svg v-if="player.isPlaying" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="ml-1"><path d="M8 5v14l11-7z"/></svg>
          </button>

          <button class="p-2 text-slate-600 hover:text-brand transition-colors rounded-full hover:bg-slate-100" @click="player.next" title="Следующий трек">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.523 12L4.046 5.775c-.47-.32-.846-.22-.846.22v11.11c0 .44.376.54.846.22L12.523 12zm9 0l-8.477-5.775c-.47-.32-.846-.22-.846.22v11.11c0 .44.376.54.846.22L21.523 12z"/></svg>
          </button>

          <button class="p-2 text-red-500 hover:text-red-700 transition-colors rounded-full hover:bg-red-50 ml-1 sm:ml-2" @click="player.stop" title="Остановить">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"/></svg>
          </button>
        </div>

        <!-- 3. Шкала перемотки и таймеры -->
        <div class="w-full flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>{{ formatTime(currentTime) }}</span>
          <input 
            type="range" 
            min="0" 
            :max="duration" 
            step="0.1"
            :value="currentTime" 
            @input="onSeek"
            class="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand"
          />
          <span>{{ formatTime(duration) }}</span>
        </div>
      </div>

      <!-- 2. Громкость (Справа) -->
      <div class="w-full md:w-auto flex items-center justify-end gap-2 text-slate-500">
        <button class="hover:text-brand" @click="player.setVolume(player.volume === 0 ? 1 : 0)">
          <svg v-if="player.volume === 0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
          <svg v-else-if="player.volume < 0.5" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/></svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
        </button>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01"
          :value="player.volume" 
          @input="player.setVolume(Number($event.target.value))"
          class="w-20 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand"
        />
      </div>

    </div>
  </div>
</template>