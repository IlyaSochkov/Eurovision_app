<script setup>
import { computed } from 'vue';

const props = defineProps({
  page: { type: Number, required: true },
  total: { type: Number, required: true },
  perPage: { type: Number, default: 10 },
  maxVisible: { type: Number, default: 5 },
});

const emit = defineEmits(['update:page']);

const totalPages = computed(() => Math.max(1, Math.ceil(props.total / props.perPage)));

const pages = computed(() => {
  const total = totalPages.value;
  const cur = props.page;
  const max = props.maxVisible;
  if (total <= max) return Array.from({ length: total }, (_, i) => i + 1);

  const half = Math.floor(max / 2);
  let start = Math.max(1, cur - half);
  let end = Math.min(total, start + max - 1);
  start = Math.max(1, end - max + 1);

  const result = [];
  if (start > 1) {
    result.push(1);
    if (start > 2) result.push('...');
  }
  for (let i = start; i <= end; i++) result.push(i);
  if (end < total) {
    if (end < total - 1) result.push('...');
    result.push(total);
  }
  return result;
});

function go(p) {
  if (p === '...' || p === props.page) return;
  if (p < 1 || p > totalPages.value) return;
  emit('update:page', p);
}

const from = computed(() => (props.total === 0 ? 0 : (props.page - 1) * props.perPage + 1));
const to = computed(() => Math.min(props.page * props.perPage, props.total));
</script>

<template>
  <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
    <div class="text-sm text-slate-500">
      Показано {{ from }}–{{ to }} из {{ total }}
    </div>

    <nav class="flex items-center gap-1" aria-label="Пагинация">
      <button
        class="btn-secondary text-sm disabled:opacity-40"
        :disabled="page <= 1"
        @click="go(page - 1)"
      >
        ←
      </button>

      <button
        v-for="(p, i) in pages"
        :key="i"
        :class="[
          'px-3 py-1.5 text-sm rounded-lg',
          p === page
            ? 'bg-brand text-white'
            : p === '...'
            ? 'text-slate-400 cursor-default'
            : 'bg-slate-200 hover:bg-slate-300 text-slate-800',
        ]"
        :disabled="p === '...'"
        @click="go(p)"
      >
        {{ p }}
      </button>

      <button
        class="btn-secondary text-sm disabled:opacity-40"
        :disabled="page >= totalPages"
        @click="go(page + 1)"
      >
        →
      </button>
    </nav>
  </div>
</template>