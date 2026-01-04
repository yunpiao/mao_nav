<template>
  <teleport to="body">
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="visible" class="fixed inset-0 z-[2000] flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-sm"
          @click="handleOverlayClick"
        ></div>

        <!-- Dialog Panel -->
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="visible"
            class="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden"
            @click.stop
          >
            <!-- Header -->
            <div class="px-6 py-5 border-b border-gray-100">
              <div class="flex items-center gap-4">
                <!-- Icon -->
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  :class="iconContainerClass"
                >
                  <CheckCircle v-if="type === 'success'" class="w-6 h-6" />
                  <XCircle v-else-if="type === 'error'" class="w-6 h-6" />
                  <Loader2 v-else-if="type === 'loading'" class="w-6 h-6 animate-spin" />
                  <Info v-else class="w-6 h-6" />
                </div>

                <!-- Title -->
                <h3 class="text-lg font-semibold text-gray-900">{{ title }}</h3>
              </div>
            </div>

            <!-- Body -->
            <div class="px-6 py-5">
              <p class="text-gray-600 leading-relaxed">{{ message }}</p>

              <!-- Details -->
              <div v-if="details && details.length > 0" class="mt-4 bg-gray-50 rounded-xl p-4">
                <p
                  v-for="detail in details"
                  :key="detail"
                  class="text-sm text-gray-500 py-1"
                >
                  {{ detail }}
                </p>
              </div>
            </div>

            <!-- Footer -->
            <div class="px-6 py-4 bg-gray-50 flex justify-end gap-3">
              <button
                v-if="showCancel"
                @click="handleCancel"
                class="h-10 px-4 text-sm font-medium text-gray-600 hover:text-gray-900
                       hover:bg-gray-100 rounded-lg transition-colors"
              >
                {{ cancelText }}
              </button>
              <button
                @click="handleConfirm"
                :disabled="loading"
                class="h-10 px-5 text-sm font-medium rounded-lg transition-all duration-200
                       flex items-center gap-2"
                :class="confirmButtonClass"
              >
                <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
                {{ confirmText }}
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { watch, computed } from 'vue'
import { CheckCircle, XCircle, Info, Loader2 } from 'lucide-vue-next'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'info', 'loading'].includes(value)
  },
  title: {
    type: String,
    default: 'Notice'
  },
  message: {
    type: String,
    required: true
  },
  details: {
    type: Array,
    default: () => []
  },
  showCancel: {
    type: Boolean,
    default: false
  },
  confirmText: {
    type: String,
    default: 'OK'
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  loading: {
    type: Boolean,
    default: false
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  },
  autoClose: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['confirm', 'cancel', 'close'])

// Icon container styling based on type
const iconContainerClass = computed(() => {
  const classes = {
    success: 'bg-green-50 text-green-600',
    error: 'bg-red-50 text-red-600',
    loading: 'bg-blue-50 text-blue-600',
    info: 'bg-blue-50 text-blue-600'
  }
  return classes[props.type] || classes.info
})

// Confirm button styling based on type
const confirmButtonClass = computed(() => {
  if (props.loading) {
    return 'bg-gray-300 text-white cursor-not-allowed'
  }
  if (props.type === 'error') {
    return 'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]'
  }
  return 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]'
})

let autoCloseTimer = null

const handleConfirm = () => {
  if (!props.loading) {
    emit('confirm')
  }
}

const handleCancel = () => {
  emit('cancel')
}

const handleOverlayClick = () => {
  if (props.closeOnOverlay && !props.loading) {
    emit('close')
  }
}

// Auto close functionality
watch(() => props.visible, (newValue) => {
  if (newValue && props.autoClose > 0) {
    autoCloseTimer = setTimeout(() => {
      emit('close')
    }, props.autoClose)
  } else if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
    autoCloseTimer = null
  }
}, { immediate: true })
</script>
