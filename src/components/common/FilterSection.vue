<script setup>
import { X } from 'lucide-vue-next'

defineProps({
  tags: {
    type: Array,
    default: () => []
  },
  selectedTag: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['select', 'reset'])

const handleSelect = (tag) => {
  emit('select', tag)
}

const handleReset = () => {
  emit('reset')
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2 mb-8">
    <!-- All Tag -->
    <button
      @click="handleReset"
      :class="[
        'directory-tag cursor-pointer transition-all',
        !selectedTag ? 'directory-tag-active' : 'hover:bg-slate-200 dark:hover:bg-slate-600'
      ]"
    >
      全部
    </button>

    <!-- Category Tags -->
    <button
      v-for="tag in tags"
      :key="tag.id"
      @click="handleSelect(tag.id)"
      :class="[
        'directory-tag cursor-pointer transition-all',
        selectedTag === tag.id ? 'directory-tag-active' : 'hover:bg-slate-200 dark:hover:bg-slate-600'
      ]"
    >
      {{ tag.name }}
    </button>

    <!-- Reset Button (when filter is active) -->
    <button
      v-if="selectedTag"
      @click="handleReset"
      class="ml-2 flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700
             dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
    >
      <X class="w-4 h-4" />
      <span>清除筛选</span>
    </button>
  </div>
</template>
