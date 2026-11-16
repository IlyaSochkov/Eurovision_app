<script setup>
import { watch, ref, onBeforeUnmount } from 'vue';

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: 'Подтвердите действие' },
  message: { type: String, default: 'Вы уверены?' },
  confirmText: { type: String, default: 'Подтвердить' },
  cancelText: { type: String, default: 'Отмена' },
  variant: { type: String, default: 'danger' }, // danger | primary
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(['confirm', 'cancel', 'update:open']);

const dialogRef = ref(null);

function close() {
  if (props.loading) return;
  emit('update:open', false);
  emit('cancel');
}

function confirm() {
  if (props.loading) return;
  emit('confirm');
}

// Закрытие по Esc + блокировка скролла body, пока открыто
function onKey(e) {
  if (e.key === 'Escape') close();
}

watch(
  () => props.open,
  (v) => {
    if (v) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => dialogRef.value?.focus());
    } else {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    }
  }
);

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey);
  document.body.style.overflow = '';
});
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="close"
      >
        <div
          ref="dialogRef"
          tabindex="-1"
          role="dialog"
          aria-modal="true"
          class="bg-white rounded-xl shadow-xl w-full max-w-md p-6 outline-none"
        >
          <h3 class="text-lg font-bold mb-2">{{ title }}</h3>
          <p class="text-slate-600 mb-6 whitespace-pre-line">{{ message }}</p>

          <div class="flex justify-end gap-2">
            <button class="btn-secondary" :disabled="loading" @click="close">
              {{ cancelText }}
            </button>
            <button
              :class="variant === 'danger' ? 'btn-danger' : 'btn-primary'"
              :disabled="loading"
              @click="confirm"
            >
              {{ loading ? 'Подождите...' : confirmText }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>