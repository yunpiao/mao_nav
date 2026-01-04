<script setup>
import { ref, watch } from 'vue'
import { Search, X } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '搜索站点...'
  }
})

const emit = defineEmits(['update:modelValue', 'search', 'clear'])

const localValue = ref(props.modelValue)

watch(() => props.modelValue, (newVal) => {
  localValue.value = newVal
})

const handleInput = (e) => {
  localValue.value = e.target.value
  emit('update:modelValue', e.target.value)
  emit('search', e.target.value)
}

const handleClear = () => {
  localValue.value = ''
  emit('update:modelValue', '')
  emit('clear')
}

const handleKeydown = (e) => {
  if (e.key === 'Enter' && localValue.value) {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(localValue.value)}`, '_blank')
  }
}
</script>

<template>
  <div class="relative max-w-xl mx-auto">
    <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
    <input
      type="text"
      :value="localValue"
      @input="handleInput"
      @keydown="handleKeydown"
      class="input-search pl-12"
      :placeholder="placeholder"
    />
    <button
      v-if="localValue"
      @click="handleClear"
      class="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full
             flex items-center justify-center
             hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
    >
      <X class="w-4 h-4 text-slate-400" />
    </button>
  </div>
</template>
