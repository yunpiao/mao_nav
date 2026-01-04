<template>
  <div class="space-y-6">
    <!-- Header Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <p class="text-sm text-gray-500">
        {{ localCategories.length }} categories total
      </p>
      <div class="flex gap-3">
        <button
          @click="showAddModal = true"
          class="h-10 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg
                 hover:bg-gray-800 active:scale-[0.98] transition-all
                 flex items-center gap-2"
        >
          <Plus class="w-4 h-4" />
          Add Category
        </button>
        <button
          @click="$emit('save')"
          :disabled="loading"
          class="h-10 px-4 text-sm font-medium rounded-lg transition-all
                 flex items-center gap-2"
          :class="loading
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]'"
        >
          <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
          <Save v-else class="w-4 h-4" />
          {{ loading ? 'Saving...' : 'Save to GitHub' }}
        </button>
      </div>
    </div>

    <!-- Categories List -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
      <div
        v-for="(category, index) in localCategories"
        :key="category.id"
        class="group hover:bg-gray-50 transition-colors cursor-pointer"
        @click="$emit('viewSites', category.id)"
      >
        <div class="p-4 sm:p-5">
          <div class="flex items-start sm:items-center gap-4">
            <!-- Icon -->
            <div
              class="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl shrink-0
                     group-hover:bg-blue-50 transition-colors"
              @click.stop="editCategory(category)"
            >
              {{ category.icon }}
            </div>

            <!-- Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-1">
                <h3
                  class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer"
                  @click.stop="editCategory(category)"
                >
                  {{ category.name }}
                </h3>
                <span class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  #{{ category.order }}
                </span>
              </div>
              <p class="text-sm text-gray-500">
                {{ category.sites?.length || 0 }} sites · Click to manage
              </p>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                @click.stop="moveCategory(index, -1)"
                :disabled="index === 0"
                class="w-8 h-8 flex items-center justify-center rounded-lg
                       text-gray-400 hover:bg-gray-100 hover:text-gray-600
                       disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Move up"
              >
                <ChevronUp class="w-4 h-4" />
              </button>
              <button
                @click.stop="moveCategory(index, 1)"
                :disabled="index === localCategories.length - 1"
                class="w-8 h-8 flex items-center justify-center rounded-lg
                       text-gray-400 hover:bg-gray-100 hover:text-gray-600
                       disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Move down"
              >
                <ChevronDown class="w-4 h-4" />
              </button>
              <button
                @click.stop="editCategory(category)"
                class="w-8 h-8 flex items-center justify-center rounded-lg
                       text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                title="Edit"
              >
                <Pencil class="w-4 h-4" />
              </button>
              <button
                @click.stop="deleteCategory(category.id)"
                class="w-8 h-8 flex items-center justify-center rounded-lg
                       text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                title="Delete"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Sites Preview -->
          <div v-if="category.sites && category.sites.length > 0" class="mt-4 ml-16">
            <div class="flex flex-wrap gap-2">
              <div
                v-for="site in category.sites.slice(0, 6)"
                :key="site.id"
                class="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100"
              >
                <img
                  :src="site.icon"
                  :alt="site.name"
                  class="w-4 h-4 object-contain"
                  @error="handleImageError"
                />
                <span class="text-xs text-gray-600">{{ site.name }}</span>
              </div>
              <div
                v-if="category.sites.length > 6"
                class="flex items-center px-3 py-1.5 bg-gray-100 rounded-lg text-xs text-gray-500"
              >
                +{{ category.sites.length - 6 }} more
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="localCategories.length === 0" class="p-12 text-center">
        <FolderOpen class="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500 mb-4">No categories yet</p>
        <button
          @click="showAddModal = true"
          class="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg
                 hover:bg-gray-800 transition-colors"
        >
          Add your first category
        </button>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <teleport to="body">
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showAddModal || editingCategory"
          class="fixed inset-0 z-[1000] flex items-center justify-center p-4"
        >
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeModal"></div>

          <!-- Modal -->
          <div class="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
            <!-- Header -->
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900">
                {{ editingCategory ? 'Edit Category' : 'Add Category' }}
              </h3>
              <button
                @click="closeModal"
                class="w-8 h-8 flex items-center justify-center rounded-lg
                       text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="saveCategory" class="p-6 space-y-5">
              <!-- Icon -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <input
                  v-model="formData.icon"
                  class="w-full h-14 px-4 bg-gray-50 border border-gray-200 rounded-xl
                         text-2xl text-center
                         hover:border-gray-300 focus:bg-white focus:border-blue-500
                         focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  placeholder="📁"
                />
                <div class="mt-3 grid grid-cols-8 gap-2">
                  <button
                    v-for="emoji in emojiSuggestions"
                    :key="emoji"
                    type="button"
                    @click="formData.icon = emoji"
                    class="w-10 h-10 flex items-center justify-center text-xl rounded-lg
                           hover:bg-gray-100 transition-colors"
                    :class="formData.icon === emoji ? 'bg-blue-50 ring-2 ring-blue-500' : 'bg-gray-50'"
                  >
                    {{ emoji }}
                  </button>
                </div>
              </div>

              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  v-model="formData.name"
                  required
                  class="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl
                         text-sm text-gray-900 placeholder:text-gray-400
                         hover:border-gray-300 focus:bg-white focus:border-blue-500
                         focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  placeholder="Category name"
                />
              </div>

              <!-- Order -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Sort Order
                </label>
                <input
                  v-model.number="formData.order"
                  type="number"
                  required
                  class="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl
                         text-sm text-gray-900 placeholder:text-gray-400
                         hover:border-gray-300 focus:bg-white focus:border-blue-500
                         focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  placeholder="0"
                />
                <p class="mt-1 text-xs text-gray-400">Lower numbers appear first</p>
              </div>

              <!-- Actions -->
              <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  @click="closeModal"
                  class="h-10 px-4 text-sm font-medium text-gray-600
                         hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="h-10 px-5 bg-gray-900 text-white text-sm font-medium rounded-lg
                         hover:bg-gray-800 active:scale-[0.98] transition-all"
                >
                  {{ editingCategory ? 'Update' : 'Add' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import {
  Plus,
  Save,
  Loader2,
  ChevronUp,
  ChevronDown,
  Pencil,
  Trash2,
  X,
  FolderOpen
} from 'lucide-vue-next'

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update', 'save', 'viewSites'])

// Local state
const localCategories = ref([])
const showAddModal = ref(false)
const editingCategory = ref(null)

// Form data
const formData = ref({
  icon: '📁',
  name: '',
  order: 0
})

// Emoji suggestions
const emojiSuggestions = [
  '📁', '🛠️', '🎨', '📚', '👥', '⚙️', '🎮', '💼',
  '☁️', '🔧', '📊', '🎵', '📱', '💻', '🌐', '🔍'
]

// Watch props
watch(() => props.categories, (newCategories) => {
  localCategories.value = JSON.parse(JSON.stringify(newCategories))
}, { immediate: true, deep: true })

// Sync to parent
const syncToParent = () => {
  emit('update', localCategories.value)
}

// Move category
const moveCategory = (index, direction) => {
  const newIndex = index + direction
  if (newIndex < 0 || newIndex >= localCategories.value.length) return

  const categories = [...localCategories.value]
  const item = categories.splice(index, 1)[0]
  categories.splice(newIndex, 0, item)

  categories.forEach((category, idx) => {
    category.order = idx
  })

  localCategories.value = categories
  syncToParent()
}

// Edit category
const editCategory = (category) => {
  editingCategory.value = category
  formData.value = {
    icon: category.icon,
    name: category.name,
    order: category.order
  }
}

// Delete category
const deleteCategory = (categoryId) => {
  if (confirm('Delete this category? All sites in it will also be deleted.')) {
    localCategories.value = localCategories.value.filter(cat => cat.id !== categoryId)
    syncToParent()
  }
}

// Save category
const saveCategory = () => {
  if (editingCategory.value) {
    const index = localCategories.value.findIndex(cat => cat.id === editingCategory.value.id)
    if (index !== -1) {
      localCategories.value[index] = {
        ...localCategories.value[index],
        ...formData.value
      }
    }
  } else {
    const newCategory = {
      id: `category-${Date.now()}`,
      ...formData.value,
      sites: []
    }
    localCategories.value.push(newCategory)
  }

  syncToParent()
  closeModal()
}

// Close modal
const closeModal = () => {
  showAddModal.value = false
  editingCategory.value = null
  formData.value = {
    icon: '📁',
    name: '',
    order: localCategories.value.length
  }
}

// Handle image error
const handleImageError = (event) => {
  event.target.src = '/favicon.ico'
  event.target.onerror = null
}
</script>
