<template>
  <div class="space-y-6">
    <!-- Header Actions -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="flex items-center gap-4">
        <select
          v-model="selectedCategoryId"
          class="h-10 px-4 pr-10 bg-gray-50 border border-gray-200 rounded-lg
                 text-sm text-gray-900 appearance-none cursor-pointer
                 hover:border-gray-300 focus:bg-white focus:border-blue-500
                 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
        >
          <option value="">All Categories</option>
          <option v-for="category in localCategories" :key="category.id" :value="category.id">
            {{ category.icon }} {{ category.name }}
          </option>
        </select>
        <p class="text-sm text-gray-500">
          {{ filteredSites.length }} of {{ totalSites }} sites
        </p>
      </div>

      <div class="flex gap-3">
        <button
          @click="openAddModal"
          class="h-10 px-4 bg-gray-900 text-white text-sm font-medium rounded-lg
                 hover:bg-gray-800 active:scale-[0.98] transition-all
                 flex items-center gap-2"
        >
          <Plus class="w-4 h-4" />
          Add Site
        </button>
        <button
          @click="handleSave"
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

    <!-- Stats Bar -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div class="bg-white rounded-xl border border-gray-200 p-4 text-center">
        <div class="text-2xl font-semibold text-gray-900">{{ totalSites }}</div>
        <div class="text-xs text-gray-500 mt-1">Total Sites</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-4 text-center">
        <div class="text-2xl font-semibold text-gray-900">{{ localCategories.length }}</div>
        <div class="text-xs text-gray-500 mt-1">Categories</div>
      </div>
      <div class="bg-white rounded-xl border border-gray-200 p-4 text-center">
        <div class="text-2xl font-semibold text-blue-600">{{ filteredSites.length }}</div>
        <div class="text-xs text-gray-500 mt-1">Showing</div>
      </div>
      <div class="hidden sm:flex items-center bg-blue-50 rounded-xl border border-blue-100 p-4 text-sm text-blue-700">
        <Lightbulb class="w-4 h-4 mr-2 shrink-0" />
        <span class="line-clamp-2">Select a category to enable drag & drop sorting</span>
      </div>
    </div>

    <!-- Sites List -->
    <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <draggable
        v-model="currentPageSites"
        v-bind="dragOptions"
        @end="onDragEnd"
        item-key="id"
        tag="div"
        class="divide-y divide-gray-100"
      >
        <template #item="{ element: site }">
          <div
            class="group p-4 sm:p-5 hover:bg-gray-50 transition-colors"
            :class="{ 'cursor-move': selectedCategoryId }"
          >
            <div class="flex items-start sm:items-center gap-4">
              <!-- Drag Handle -->
              <div
                v-if="selectedCategoryId"
                class="flex items-center justify-center w-6 text-gray-300 hover:text-gray-500 cursor-grab shrink-0"
              >
                <GripVertical class="w-4 h-4" />
              </div>

              <!-- Site Icon -->
              <div class="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100
                          flex items-center justify-center shrink-0 overflow-hidden">
                <img
                  :src="getIconDisplayUrl(site.icon)"
                  :alt="site.name"
                  class="w-8 h-8 object-contain"
                  @error="handleImageError"
                />
              </div>

              <!-- Site Info -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-3 mb-1">
                  <h3 class="font-semibold text-gray-900 truncate">{{ site.name }}</h3>
                  <span class="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                    {{ getCategoryName(site.categoryId) }}
                  </span>
                </div>
                <p v-if="site.description" class="text-sm text-gray-500 truncate mb-1">
                  {{ site.description }}
                </p>
                <a
                  :href="site.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-xs text-blue-600 hover:text-blue-700 hover:underline truncate block"
                >
                  {{ site.url }}
                </a>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                  @click="editSite(site)"
                  class="w-8 h-8 flex items-center justify-center rounded-lg
                         text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                  title="Edit"
                >
                  <Pencil class="w-4 h-4" />
                </button>
                <button
                  @click="deleteSite(site)"
                  class="w-8 h-8 flex items-center justify-center rounded-lg
                         text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </template>
      </draggable>

      <!-- Empty State -->
      <div v-if="filteredSites.length === 0" class="p-12 text-center">
        <Globe class="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500 mb-4">No sites found</p>
        <button
          @click="openAddModal"
          class="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg
                 hover:bg-gray-800 transition-colors"
        >
          Add your first site
        </button>
      </div>
    </div>

    <!-- Drag Notice -->
    <div v-if="!selectedCategoryId && filteredSites.length > 0" class="bg-blue-50 border border-blue-100 rounded-xl p-4">
      <p class="text-sm text-blue-700 flex items-center gap-2">
        <Info class="w-4 h-4 shrink-0" />
        Select a specific category to enable drag & drop sorting
      </p>
    </div>

    <!-- Add/Edit Site Modal -->
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
          v-if="showAddModal || editingSite"
          class="fixed inset-0 z-[1000] flex items-center justify-center p-4"
        >
          <!-- Backdrop -->
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeModal"></div>

          <!-- Modal -->
          <div class="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <!-- Header -->
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">
                  {{ editingSite ? 'Edit Site' : 'Add Site' }}
                </h3>
                <p v-if="!editingSite && formData.categoryId" class="text-sm text-gray-500 mt-0.5">
                  Adding to {{ getCategoryName(formData.categoryId) }}
                </p>
              </div>
              <button
                @click="closeModal"
                class="w-8 h-8 flex items-center justify-center rounded-lg
                       text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                <X class="w-4 h-4" />
              </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="saveSite" class="p-6 space-y-5">
              <!-- Name & Category Row -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.name"
                    required
                    class="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl
                           text-sm text-gray-900 placeholder:text-gray-400
                           hover:border-gray-300 focus:bg-white focus:border-blue-500
                           focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    placeholder="Site name"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Category <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="formData.categoryId"
                    required
                    class="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl
                           text-sm text-gray-900 appearance-none cursor-pointer
                           hover:border-gray-300 focus:bg-white focus:border-blue-500
                           focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  >
                    <option value="">Select category</option>
                    <option v-for="category in localCategories" :key="category.id" :value="category.id">
                      {{ category.icon }} {{ category.name }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- URL -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  URL <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.url"
                  type="url"
                  required
                  class="w-full h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl
                         text-sm text-gray-900 placeholder:text-gray-400
                         hover:border-gray-300 focus:bg-white focus:border-blue-500
                         focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  placeholder="https://example.com"
                />
              </div>

              <!-- Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  v-model="formData.description"
                  rows="2"
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                         text-sm text-gray-900 placeholder:text-gray-400 resize-none
                         hover:border-gray-300 focus:bg-white focus:border-blue-500
                         focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                  placeholder="Brief description of the site"
                ></textarea>
              </div>

              <!-- Icon -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <div class="flex gap-3">
                  <input
                    v-model="formData.icon"
                    class="flex-1 h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl
                           text-sm text-gray-900 placeholder:text-gray-400
                           hover:border-gray-300 focus:bg-white focus:border-blue-500
                           focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                    placeholder="Icon URL or auto-detect"
                  />
                  <button
                    type="button"
                    @click="autoDetectIcon"
                    class="h-11 px-4 bg-gray-100 text-gray-700 text-sm font-medium rounded-xl
                           hover:bg-gray-200 active:scale-[0.98] transition-all
                           flex items-center gap-2 shrink-0"
                  >
                    <Search class="w-4 h-4" />
                    Auto
                  </button>
                </div>
                <div v-if="formData.icon" class="mt-3 flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200
                              flex items-center justify-center">
                    <img
                      :src="getIconDisplayUrl(formData.icon)"
                      alt="Icon preview"
                      class="w-6 h-6 object-contain"
                      @error="iconError = true"
                    />
                  </div>
                  <span class="text-xs text-gray-500">Icon preview</span>
                </div>
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
                  {{ editingSite ? 'Update' : 'Add' }}
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
import { ref, computed, watch } from 'vue'
import draggable from 'vuedraggable'
import {
  Plus,
  Save,
  Loader2,
  GripVertical,
  Pencil,
  Trash2,
  Globe,
  X,
  Search,
  Lightbulb,
  Info
} from 'lucide-vue-next'

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  },
  initialSelectedCategoryId: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update', 'save'])

// Local state
const localCategories = ref([])
const iconPreviews = ref(new Map())
const selectedCategoryId = ref('')
const showAddModal = ref(false)
const editingSite = ref(null)
const iconError = ref(false)

// Form data
const formData = ref({
  name: '',
  url: '',
  description: '',
  icon: '',
  categoryId: ''
})

// Watch props
watch(() => props.categories, (newCategories) => {
  localCategories.value = JSON.parse(JSON.stringify(newCategories))
}, { immediate: true, deep: true })

watch(() => props.initialSelectedCategoryId, (newCategoryId) => {
  if (newCategoryId) {
    selectedCategoryId.value = newCategoryId
  }
}, { immediate: true })

// Sync to parent
const syncToParent = () => {
  emit('update', localCategories.value)
}

// Computed
const allSites = computed(() => {
  const sites = []
  localCategories.value.forEach(category => {
    if (category.sites) {
      category.sites.forEach(site => {
        sites.push({
          ...site,
          categoryId: category.id
        })
      })
    }
  })
  return sites
})

const totalSites = computed(() => allSites.value.length)

const filteredSites = computed(() => {
  if (!selectedCategoryId.value) {
    return allSites.value
  }
  return allSites.value.filter(site => site.categoryId === selectedCategoryId.value)
})

const currentPageSites = computed({
  get() {
    return filteredSites.value
  },
  set(newSites) {
    updateSitesOrder(newSites)
  }
})

// Drag options
const dragOptions = computed(() => ({
  animation: 200,
  group: "sites",
  disabled: !selectedCategoryId.value,
  ghostClass: "opacity-50 bg-blue-50",
  scroll: true,
  forceAutoScrollFallback: true,
  scrollSensitivity: 100,
  scrollSpeed: 15,
  bubbleScroll: true
}))

// Get category name
const getCategoryName = (categoryId) => {
  const category = localCategories.value.find(cat => cat.id === categoryId)
  return category ? `${category.icon} ${category.name}` : 'Uncategorized'
}

// Get icon display URL
const getIconDisplayUrl = (iconPath) => {
  if (!iconPath) return ''
  if (iconPreviews.value.has(iconPath)) {
    return iconPreviews.value.get(iconPath)
  }
  return iconPath
}

// Edit site
const editSite = (site) => {
  editingSite.value = site
  showAddModal.value = false
  formData.value = {
    name: site.name,
    url: site.url,
    description: site.description,
    icon: site.icon,
    categoryId: site.categoryId
  }
  iconError.value = false
}

// Delete site
const deleteSite = (site) => {
  if (confirm(`Delete "${site.name}"?`)) {
    const category = localCategories.value.find(cat => cat.id === site.categoryId)
    if (category && category.sites) {
      category.sites = category.sites.filter(s => s.id !== site.id)
      syncToParent()
    }
  }
}

// Update sites order
const updateSitesOrder = (newSites) => {
  if (!selectedCategoryId.value) {
    return
  }

  const category = localCategories.value.find(cat => cat.id === selectedCategoryId.value)
  if (!category) return

  category.sites = newSites.map(site => ({
    id: site.id,
    name: site.name,
    url: site.url,
    description: site.description,
    icon: site.icon
  }))

  syncToParent()
}

// Drag end
const onDragEnd = () => {
  // Handled by updateSitesOrder
}

// Test image
const testImage = async (imageUrl) => {
  const isSameDomain = imageUrl.startsWith(window.location.origin) ||
                      imageUrl.startsWith('/') ||
                      imageUrl.startsWith('./') ||
                      !imageUrl.startsWith('http')

  if (isSameDomain) {
    const response = await fetch(imageUrl, { method: 'HEAD' })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    const contentLength = response.headers.get('content-length')
    if (contentLength && parseInt(contentLength) < 100) {
      throw new Error('File too small')
    }
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(imageUrl)
      img.onerror = () => reject(new Error('Invalid image'))
      img.src = imageUrl
    })
  }

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      if (img.naturalWidth < 1 || img.naturalHeight < 1) {
        reject(new Error('Invalid image dimensions'))
        return
      }
      resolve(imageUrl)
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = imageUrl
  })
}

// Try fallback services
const tryFallbackServices = async (domain) => {
  const iconServiceUrls = [
    `https://icon.maodeyu.fun/favicon/${domain}`,
    `https://www.faviconextractor.com/favicon/${domain}`
  ]

  for (const iconServiceUrl of iconServiceUrls) {
    try {
      await testImage(iconServiceUrl)
      formData.value.icon = iconServiceUrl
      iconError.value = false
      return
    } catch (error) {
      console.log('Icon service failed:', error.message)
    }
  }

  alert('Could not detect icon. Please enter the icon URL manually.')
}

// Auto detect icon
const autoDetectIcon = async () => {
  if (!formData.value.url) {
    alert('Please enter the site URL first')
    return
  }

  try {
    const url = new URL(formData.value.url)
    await tryFallbackServices(url.host)
  } catch {
    alert('Invalid URL format')
  }
}

// Save site
const saveSite = () => {
  const category = localCategories.value.find(cat => cat.id === formData.value.categoryId)
  if (!category) {
    alert('Please select a valid category')
    return
  }

  if (!category.sites) {
    category.sites = []
  }

  if (editingSite.value) {
    const originalCategory = localCategories.value.find(cat =>
      cat.sites && cat.sites.some(s => s.id === editingSite.value.id)
    )

    const updatedSite = {
      id: editingSite.value.id,
      name: formData.value.name,
      url: formData.value.url,
      description: formData.value.description,
      icon: formData.value.icon
    }

    if (originalCategory && originalCategory.id === formData.value.categoryId) {
      const siteIndex = originalCategory.sites.findIndex(s => s.id === editingSite.value.id)
      if (siteIndex !== -1) {
        originalCategory.sites[siteIndex] = updatedSite
      }
    } else {
      if (originalCategory && originalCategory.sites) {
        originalCategory.sites = originalCategory.sites.filter(s => s.id !== editingSite.value.id)
      }
      category.sites.push(updatedSite)
    }
  } else {
    const newSite = {
      id: `site-${Date.now()}`,
      name: formData.value.name,
      url: formData.value.url,
      description: formData.value.description,
      icon: formData.value.icon
    }
    category.sites.push(newSite)
  }

  syncToParent()
  closeModal()
}

// Open add modal
const openAddModal = () => {
  showAddModal.value = true
  const defaultCategoryId = selectedCategoryId.value || (localCategories.value[0]?.id || '')
  formData.value = {
    name: '',
    url: '',
    description: '',
    icon: '',
    categoryId: defaultCategoryId
  }
  iconError.value = false
}

// Close modal
const closeModal = () => {
  showAddModal.value = false
  editingSite.value = null
  formData.value = {
    name: '',
    url: '',
    description: '',
    icon: '',
    categoryId: ''
  }
  iconError.value = false
}

// Handle image error
const handleImageError = (event) => {
  event.target.src = '/favicon.ico'
  event.target.onerror = null
}

// Handle save
const handleSave = () => {
  emit('save')
}

// Watch category change
watch(selectedCategoryId, () => {
  console.log('Category changed:', selectedCategoryId.value)
})
</script>
