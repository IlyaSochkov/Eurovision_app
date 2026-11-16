import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePlayerStore = defineStore('player', () => {
  const currentSong = ref(null);
  const queue = ref([]);
  const isPlaying = ref(false);
  const audioEl = ref(null);
  const volume = ref(1); // Громкость от 0 до 1

  function setAudioEl(el) {
    audioEl.value = el;
    if (audioEl.value) {
      audioEl.value.volume = volume.value; // Применяем сохраненную громкость
    }
  }

  function play(song, newQueue = null) {
    if (!audioEl.value) return;
    
    // Если передан новый плейлист/очередь
    if (newQueue) queue.value = newQueue;
    
    // Если очередь пуста, но мы запускаем песню — добавляем её в очередь
    if (queue.value.length === 0) {
      queue.value = [song];
    }

    currentSong.value = song;
    isPlaying.value = true;

    const baseUrl = 'http://localhost:3000';
    const src = song.audio_url?.startsWith('http') ? song.audio_url : `${baseUrl}${song.audio_url}`;
    
    // Принудительно меняем src и загружаем
    audioEl.value.src = src;
    audioEl.value.load(); 
    audioEl.value.play().catch(e => {
      console.error('Playback failed:', e);
      isPlaying.value = false;
    });
  }

  function pause() {
    isPlaying.value = false;
    audioEl.value?.pause();
  }

  function resume() {
    if (!currentSong.value) return;
    isPlaying.value = true;
    audioEl.value?.play();
  }

  function toggle() {
    if (!currentSong.value) return;
    if (isPlaying.value) pause();
    else resume();
  }

  function stop() {
    if (audioEl.value) {
      audioEl.value.pause();
      audioEl.value.currentTime = 0;
    }
    isPlaying.value = false;
    currentSong.value = null;
  }

  // Поиск текущего индекса в очереди
  const getCurrentIndex = () => {
    return queue.value.findIndex((s) => s.id === currentSong.value?.id);
  };

  function next() {
    if (!queue.value.length || queue.value.length === 1) return;
    const idx = getCurrentIndex();
    const nextSong = queue.value[(idx + 1) % queue.value.length];
    play(nextSong);
  }

  function prev() {
    if (!queue.value.length || queue.value.length === 1) return;
    const idx = getCurrentIndex();
    const prevSong = queue.value[(idx - 1 + queue.value.length) % queue.value.length];
    play(prevSong);
  }

  function setVolume(val) {
    volume.value = val;
    if (audioEl.value) {
      audioEl.value.volume = val;
    }
  }

  return { 
    currentSong, queue, isPlaying, volume,
    play, pause, resume, toggle, stop, next, prev, setAudioEl, setVolume 
  };
});