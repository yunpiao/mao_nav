<template>
  <div class="min-h-screen bg-[#F4F1FA] relative overflow-hidden">
    <!-- Login Screen -->
    <div v-if="!isAuthenticated" class="min-h-screen flex items-center justify-center p-4">
      <!-- Background Blobs -->
      <div class="clay-blob clay-blob-purple" style="top: 10%; left: 15%; width: 300px; height: 300px; animation-delay: 0s;"></div>
      <div class="clay-blob clay-blob-pink" style="bottom: 15%; right: 20%; width: 350px; height: 350px; animation-delay: 2s;"></div>

      <div class="w-full max-w-sm relative z-10">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="clay-icon-container w-16 h-16 mx-auto mb-4">
            <Lock class="w-8 h-8 text-[#7C3AED]" />
          </div>
          <h1 class="text-2xl font-semibold text-clay-foreground">Admin Login</h1>
          <p class="text-sm text-clay-muted mt-2">Enter your credentials to continue</p>
        </div>

        <!-- Login Form -->
        <div class="clay-lock-card p-8">
          <form @submit.prevent="handleLogin" class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-clay-foreground mb-2">
                Password
              </label>
              <input
                type="password"
                v-model="loginPassword"
                class="clay-input"
                placeholder="Enter admin password"
                required
              />
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="clay-button w-full flex items-center justify-center gap-2"
            >
              <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
              {{ loading ? 'Verifying...' : 'Sign In' }}
            </button>

            <p v-if="loginError" class="text-sm text-red-600 text-center bg-red-50/80 rounded-lg p-3">
              {{ loginError }}
            </p>
          </form>
        </div>
      </div>
    </div>

    <!-- Admin Dashboard -->
    <div v-else class="min-h-screen flex">
      <!-- Sidebar -->
      <aside class="w-64 bg-white/80 backdrop-blur-xl border-r border-white/50 fixed inset-y-0 left-0 flex flex-col z-30 hidden lg:flex">
        <!-- Logo -->
        <div class="h-16 px-6 flex items-center border-b border-white/30">
          <span class="text-lg font-semibold text-clay-foreground">Admin Panel</span>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 p-4 space-y-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="handleTabClick(tab.id)"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left
                   transition-all duration-200"
            :class="activeTab === tab.id
              ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-lg'
              : 'text-clay-muted hover:bg-white/50 hover:text-clay-foreground'"
          >
            <component :is="tab.icon" class="w-5 h-5" />
            <span class="font-medium">{{ tab.label }}</span>
          </button>
        </nav>

        <!-- User/Logout -->
        <div class="p-4 border-t border-white/30">
          <button
            @click="logout"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                   text-clay-muted hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <LogOut class="w-5 h-5" />
            <span class="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      <!-- Mobile Header -->
      <div class="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-xl border-b border-white/50 z-30 flex items-center justify-between px-4">
        <span class="text-lg font-semibold text-clay-foreground">Admin Panel</span>
        <button
          @click="showMobileNav = !showMobileNav"
          class="clay-icon-container p-2"
        >
          <Menu class="w-5 h-5" />
        </button>
      </div>

      <!-- Mobile Navigation Overlay -->
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showMobileNav" class="lg:hidden fixed inset-0 z-40" @click="showMobileNav = false">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
          <div class="clay-card rounded-none absolute left-0 top-0 bottom-0 w-64 flex flex-col" @click.stop>
            <div class="h-16 px-6 flex items-center justify-between border-b border-white/30">
              <span class="text-lg font-semibold text-clay-foreground">Menu</span>
              <button @click="showMobileNav = false" class="clay-icon-container p-2">
                <X class="w-5 h-5" />
              </button>
            </div>
            <nav class="flex-1 p-4 space-y-1">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="handleTabClick(tab.id); showMobileNav = false"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors"
                :class="activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-lg'
                  : 'text-clay-muted hover:bg-white/50 hover:text-clay-foreground'"
              >
                <component :is="tab.icon" class="w-5 h-5" />
                <span class="font-medium">{{ tab.label }}</span>
              </button>
            </nav>
            <div class="p-4 border-t border-white/30">
              <button
                @click="logout"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                       text-clay-muted hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut class="w-5 h-5" />
                <span class="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Main Content -->
      <main class="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <!-- Page Header -->
          <div class="mb-8">
            <h1 class="text-2xl font-semibold text-clay-foreground">
              {{ currentTabLabel }}
            </h1>
            <p class="text-sm text-clay-muted mt-1">
              {{ currentTabDescription }}
            </p>
          </div>

          <!-- Loading Overlay -->
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div v-if="loading" class="fixed inset-0 z-50 flex items-center justify-center bg-[#F4F1FA]/80 backdrop-blur-sm">
              <div class="clay-card p-8 text-center">
                <div class="w-10 h-10 border-2 border-white/50 border-t-[#7C3AED] rounded-full animate-spin mx-auto mb-4"></div>
                <p class="text-clay-muted mb-4">Loading data...</p>
                <button
                  @click="skipLoading"
                  class="px-4 py-2 text-sm font-medium text-clay-muted hover:text-clay-foreground hover:bg-white/50 rounded-lg transition-colors"
                >
                  Skip loading
                </button>
              </div>
            </div>
          </transition>

          <!-- Tab Content -->
          <div class="clay-card">
            <!-- Categories Tab -->
            <div v-if="activeTab === 'categories'" class="p-6">
              <CategoryManager
                :categories="categories"
                @update="handleCategoriesUpdate"
                @save="saveToGitHub"
                @viewSites="switchToSiteManager"
                :loading="saving"
              />
            </div>

            <!-- Sites Tab -->
            <div v-if="activeTab === 'sites'" class="p-6">
              <SiteManager
                :categories="categories"
                :initialSelectedCategoryId="selectedCategoryId"
                @update="handleCategoriesUpdate"
                @save="saveToGitHub"
                :loading="saving"
              />
            </div>

            <!-- Settings Tab -->
            <div v-if="activeTab === 'settings'" class="p-6">
              <SystemSettings />
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Custom Dialog -->
    <CustomDialog
      :visible="dialogVisible"
      :type="dialogType"
      :title="dialogTitle"
      :message="dialogMessage"
      :details="dialogDetails"
      @close="closeDialog"
      @confirm="closeDialog"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Lock,
  LogOut,
  Loader2,
  Menu,
  X,
  FolderOpen,
  Globe,
  Settings
} from 'lucide-vue-next'
import CategoryManager from '../components/admin/CategoryManager.vue'
import SiteManager from '../components/admin/SiteManager.vue'
import SystemSettings from '../components/admin/SystemSettings.vue'
import CustomDialog from '../components/admin/CustomDialog.vue'
import { useGitHubAPI } from '../apis/useGitHubAPI.js'

const router = useRouter()
const { saveCategoriesToGitHub } = useGitHubAPI()

// Tab definitions
const tabs = [
  { id: 'categories', label: 'Categories', icon: FolderOpen },
  { id: 'sites', label: 'Sites', icon: Globe },
  { id: 'settings', label: 'Settings', icon: Settings }
]

// Authentication state
const isAuthenticated = ref(false)
const loginPassword = ref('')
const loginError = ref('')
const loading = ref(false)
const saving = ref(false)

// Admin state
const activeTab = ref('categories')
const categories = ref([])
const navTitle = ref('Home导航')
const selectedCategoryId = ref('')
const showMobileNav = ref(false)

// Computed
const currentTabLabel = computed(() => {
  const tab = tabs.find(t => t.id === activeTab.value)
  return tab ? tab.label : ''
})

const currentTabDescription = computed(() => {
  const descriptions = {
    categories: 'Manage your navigation categories',
    sites: 'Add and organize your site links',
    settings: 'Configure system preferences'
  }
  return descriptions[activeTab.value] || ''
})

// Emergency timeout for stuck loading
setTimeout(() => {
  if (loading.value) {
    console.warn('Loading state stuck, force reset')
    loading.value = false
    if (categories.value.length === 0) {
      categories.value = [
        { id: 'default', name: 'Default', icon: '📁', order: 0, sites: [] }
      ]
    }
  }
}, 5000)

// Dialog state
const dialogVisible = ref(false)
const dialogType = ref('success')
const dialogTitle = ref('')
const dialogMessage = ref('')
const dialogDetails = ref([])

// Login handler
const handleLogin = async () => {
  loading.value = true
  loginError.value = ''

  try {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD
    if (!adminPassword) {
      throw new Error('Admin password not configured')
    }

    if (loginPassword.value === adminPassword) {
      isAuthenticated.value = true
      localStorage.setItem('admin_authenticated', 'true')

      setTimeout(async () => {
        try {
          await loadCategories()
        } catch (error) {
          console.error('Failed to load data after login:', error)
          loading.value = false
        }
      }, 500)
    } else {
      throw new Error('Invalid password')
    }
  } catch (error) {
    loginError.value = error.message
  } finally {
    if (!isAuthenticated.value) {
      loading.value = false
    }
  }
}

// Logout handler
const logout = () => {
  isAuthenticated.value = false
  localStorage.removeItem('admin_authenticated')
  loginPassword.value = ''
  router.push('/')
}

// Load categories
const loadCategories = async () => {
  loading.value = true
  try {
    const { mockData } = await import('../mock/mock_data.js')
    categories.value = mockData.categories || []
    navTitle.value = mockData.title || 'Home导航'
  } catch (error) {
    console.error('Failed to load data:', error)
    categories.value = []
    navTitle.value = 'Home导航'
  } finally {
    loading.value = false
  }
}

// Handle tab click
const handleTabClick = (tabId) => {
  if (tabId === 'sites') {
    selectedCategoryId.value = ''
  }
  activeTab.value = tabId
}

// Handle categories update
const handleCategoriesUpdate = (newCategories) => {
  categories.value = newCategories
}

// Switch to site manager with category
const switchToSiteManager = (categoryId) => {
  selectedCategoryId.value = categoryId
  activeTab.value = 'sites'
}

// Show dialog
const showDialog = (type, title, message, details = []) => {
  dialogType.value = type
  dialogTitle.value = title
  dialogMessage.value = message
  dialogDetails.value = details
  dialogVisible.value = true
}

// Close dialog
const closeDialog = () => {
  dialogVisible.value = false
}

// Skip loading
const skipLoading = async () => {
  loading.value = false
  try {
    const { mockData } = await import('../mock/mock_data.js')
    categories.value = mockData.categories || []
    navTitle.value = mockData.title || 'Home导航'
  } catch {
    categories.value = [
      { id: 'default', name: 'Default', icon: '📁', order: 0, sites: [] }
    ]
    navTitle.value = 'Home导航'
  }

  showDialog(
    'info',
    'Loading Skipped',
    'Using local data. You can reconnect to GitHub in Settings.',
    [`• Categories: ${categories.value.length}`]
  )
}

// Save to GitHub
const saveToGitHub = async () => {
  saving.value = true
  try {
    await saveCategoriesToGitHub({
      categories: categories.value,
      title: navTitle.value
    })
    showDialog(
      'success',
      'Saved Successfully',
      'Your changes have been saved to GitHub.',
      [
        '• Changes will be deployed in 2-3 minutes',
        '• Check your deployment status if needed'
      ]
    )
  } catch (error) {
    showDialog(
      'error',
      'Save Failed',
      'An error occurred while saving.',
      [`• Error: ${error.message}`]
    )
  } finally {
    saving.value = false
  }
}

// Mount
onMounted(() => {
  loading.value = false

  const savedAuth = localStorage.getItem('admin_authenticated')
  if (savedAuth === 'true') {
    isAuthenticated.value = true

    import('../mock/mock_data.js').then(({ mockData }) => {
      categories.value = mockData.categories || []
      navTitle.value = mockData.title || 'Home导航'
    }).catch(error => {
      console.error('Failed to load local data:', error)
      categories.value = []
      navTitle.value = 'Home导航'
    })
  }
})
</script>
