<script setup>
import { usePlayerStore } from '../stores/player';

const props = defineProps({ 
  song: Object,
  // Добавляем пропс для передачи всего списка песен (очереди)
  playlist: { type: Array, default: () => [] } 
});

const player = usePlayerStore();

function playSong() {
  // Если очередь передана — используем её. Если нет — создаем из одной песни.
  const queue = props.playlist.length ? props.playlist : [props.song];
  player.play(props.song, queue);
}
</script>

<template>
  <div class="card flex items-center gap-4 hover:shadow-md transition-shadow group">
    <img
      v-if="song.country?.flag_url"
      :src="song.country.flag_url"
      :alt="song.country.name"
      class="w-12 h-8 object-cover rounded shadow-sm"
    />
    <div class="flex-1 min-w-0">
      <RouterLink :to="`/songs/${song.id}`" class="font-semibold hover:text-brand block truncate">
        {{ song.title }}
      </RouterLink>
      <div class="text-sm text-slate-500 truncate">
        {{ song.artist?.name }} · {{ song.country?.name }} · {{ song.year }}
      </div>
      <div class="text-xs text-slate-400">{{ song.genre?.title }}</div>
    </div>
    
    <button 
      class="w-10 h-10 flex items-center justify-center rounded-full bg-brand text-white shadow-md hover:bg-brand-dark transition-all transform group-hover:scale-105 opacity-90 group-hover:opacity-100" 
      @click="playSong"
      title="Слушать"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" class="ml-0.5">
        <path d="M8 5v14l11-7z"/>
      </svg>
    </button>
  </div>
</template>