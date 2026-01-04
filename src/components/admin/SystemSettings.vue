<template>
  <div class="space-y-8">
    <!-- GitHub Connection Status -->
    <section class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Github class="w-5 h-5" />
          GitHub Integration
        </h3>
      </div>
      <div class="p-6">
        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-xl border"
          :class="connectionStatus?.connected
            ? 'bg-green-50 border-green-200'
            : 'bg-red-50 border-red-200'"
        >
          <div class="flex items-start gap-3">
            <div
              class="w-3 h-3 rounded-full mt-1 shrink-0"
              :class="connectionStatus?.connected ? 'bg-green-500' : 'bg-red-500'"
            ></div>
            <div>
              <p class="font-medium text-gray-900">
                {{ connectionStatus?.connected ? 'Connected' : 'Disconnected' }}
              </p>
              <div v-if="connectionStatus?.connected" class="mt-2 space-y-1">
                <p class="text-sm text-gray-600">
                  <span class="font-medium">Repository:</span> {{ connectionStatus.repo }}
                </p>
                <p class="text-sm text-gray-600">
                  <span class="font-medium">Permission:</span>
                  <span
                    v-if="connectionStatus.permissions?.push"
                    class="ml-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full"
                  >
                    Read & Write
                  </span>
                  <span
                    v-else
                    class="ml-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full"
                  >
                    Read Only
                  </span>
                </p>
              </div>
              <p v-else-if="connectionStatus?.error" class="text-sm text-red-600 mt-1">
                {{ connectionStatus.error }}
              </p>
            </div>
          </div>
          <button
            @click="testConnection"
            :disabled="testing"
            class="h-10 px-4 text-sm font-medium rounded-lg transition-all flex items-center gap-2 shrink-0"
            :class="testing
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]'"
          >
            <Loader2 v-if="testing" class="w-4 h-4 animate-spin" />
            <RefreshCw v-else class="w-4 h-4" />
            {{ testing ? 'Testing...' : 'Test Connection' }}
          </button>
        </div>
      </div>
    </section>

    <!-- Website Settings -->
    <section class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Globe class="w-5 h-5" />
          Website Settings
        </h3>
      </div>
      <div class="p-6 space-y-6">
        <!-- Website Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Website Title
          </label>
          <div class="flex gap-3">
            <input
              v-model="websiteTitle"
              type="text"
              maxlength="50"
              class="flex-1 h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl
                     text-sm text-gray-900 placeholder:text-gray-400
                     hover:border-gray-300 focus:bg-white focus:border-blue-500
                     focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
              placeholder="Enter website title"
            />
            <button
              @click="saveTitleToGitHub"
              :disabled="titleSaving || !websiteTitle.trim()"
              class="h-11 px-4 text-sm font-medium rounded-xl transition-all flex items-center gap-2 shrink-0"
              :class="titleSaving || !websiteTitle.trim()
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98]'"
            >
              <Loader2 v-if="titleSaving" class="w-4 h-4 animate-spin" />
              <Save v-else class="w-4 h-4" />
              {{ titleSaving ? 'Saving...' : 'Save' }}
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            Current: {{ currentTitle || 'Not set' }}
          </p>
        </div>

        <!-- Logo Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Website Logo
          </label>
          <div class="flex flex-col sm:flex-row gap-4">
            <div
              class="w-32 h-32 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50
                     flex items-center justify-center overflow-hidden shrink-0"
            >
              <img
                v-if="logoPreview"
                :src="logoPreview"
                alt="Logo preview"
                class="w-full h-full object-contain"
              />
              <img
                v-else-if="currentLogo"
                :src="currentLogo"
                alt="Current logo"
                class="w-full h-full object-contain"
              />
              <div v-else class="text-center text-gray-400">
                <ImageIcon class="w-8 h-8 mx-auto mb-2" />
                <p class="text-xs">No logo</p>
              </div>
            </div>
            <div class="flex flex-col gap-3">
              <input
                ref="logoFileInput"
                type="file"
                accept="image/png"
                @change="handleLogoSelect"
                class="hidden"
              />
              <button
                @click="selectLogo"
                class="h-10 px-4 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg
                       hover:bg-gray-200 active:scale-[0.98] transition-all flex items-center gap-2"
              >
                <FolderOpen class="w-4 h-4" />
                Select PNG File
              </button>
              <button
                v-if="selectedLogoFile"
                @click="saveLogoToGitHub"
                :disabled="logoSaving"
                class="h-10 px-4 text-sm font-medium rounded-lg transition-all flex items-center gap-2"
                :class="logoSaving
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]'"
              >
                <Loader2 v-if="logoSaving" class="w-4 h-4 animate-spin" />
                <Upload v-else class="w-4 h-4" />
                {{ logoSaving ? 'Uploading...' : 'Upload Logo' }}
              </button>
              <p class="text-xs text-gray-500">
                PNG only, recommended size: 128x128px
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Environment Variables -->
    <section class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Settings class="w-5 h-5" />
          Environment Variables
        </h3>
      </div>
      <div class="divide-y divide-gray-100">
        <div
          v-for="item in envItems"
          :key="item.key"
          class="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
        >
          <div>
            <p class="text-sm font-medium text-gray-900">{{ item.label }}</p>
            <p class="text-xs text-gray-500 font-mono">{{ item.key }}</p>
          </div>
          <div class="flex items-center gap-2">
            <span
              v-if="item.isSet"
              class="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full"
            >
              <CheckCircle class="w-3.5 h-3.5" />
              Configured
            </span>
            <span
              v-else-if="item.value"
              class="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-mono rounded-lg"
            >
              {{ item.value }}
            </span>
            <span
              v-else
              class="flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full"
            >
              <XCircle class="w-3.5 h-3.5" />
              Not configured
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Configuration Guide -->
    <section class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="text-base font-semibold text-gray-900 flex items-center gap-2">
          <BookOpen class="w-5 h-5" />
          Configuration Guide
        </h3>
      </div>
      <div class="divide-y divide-gray-100">
        <!-- Step 1 -->
        <div class="p-6">
          <h4 class="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span class="w-6 h-6 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center">1</span>
            Get GitHub Personal Access Token
          </h4>
          <ol class="text-sm text-gray-600 space-y-2 ml-8 list-decimal">
            <li>
              Go to
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:underline"
              >
                GitHub Settings → Developer settings → Personal access tokens
              </a>
            </li>
            <li>Click "Generate new token" → "Generate new token (fine-grained token)"</li>
            <li>Set token name and expiration. Select only the mao_nav repository for security</li>
            <li>
              <span class="font-medium">Repository permissions:</span>
              <ul class="mt-1 ml-4 space-y-1 list-disc">
                <li><code class="px-1.5 py-0.5 bg-gray-100 text-red-600 text-xs rounded">Contents</code> - Read and write</li>
                <li><code class="px-1.5 py-0.5 bg-gray-100 text-red-600 text-xs rounded">Metadata</code> - Read</li>
              </ul>
            </li>
            <li>Click "Generate token" and copy it</li>
          </ol>
        </div>

        <!-- Step 2 -->
        <div class="p-6">
          <h4 class="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span class="w-6 h-6 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center">2</span>
            Configure Environment Variables
          </h4>
          <p class="text-sm text-gray-600 mb-3 ml-8">
            Create a <code class="px-1.5 py-0.5 bg-gray-100 text-red-600 text-xs rounded">.env</code> file in the project root, or set in Vercel/Cloudflare Pages:
          </p>
          <div class="ml-8 bg-gray-900 rounded-xl p-4 overflow-x-auto">
            <pre class="text-sm text-gray-300 font-mono leading-relaxed"><code># Admin password
VITE_ADMIN_PASSWORD=your_password_here

# GitHub configuration
VITE_GITHUB_TOKEN=your_github_token_here
VITE_GITHUB_OWNER=your_github_username
VITE_GITHUB_REPO=mao_nav
VITE_GITHUB_BRANCH=master</code></pre>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="p-6">
          <h4 class="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span class="w-6 h-6 bg-gray-900 text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
            Security Notes
          </h4>
          <ul class="text-sm text-gray-600 space-y-2 ml-8">
            <li class="flex items-start gap-2">
              <Shield class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <span>Never commit <code class="px-1.5 py-0.5 bg-gray-100 text-red-600 text-xs rounded">.env</code> file to Git</span>
            </li>
            <li class="flex items-start gap-2">
              <Key class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <span>Keep your GitHub Token secure and private</span>
            </li>
            <li class="flex items-start gap-2">
              <RefreshCw class="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <span>Rotate tokens regularly for better security</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- System Info -->
    <section class="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100">
        <h3 class="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Info class="w-5 h-5" />
          System Information
        </h3>
      </div>
      <div class="p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span class="text-sm font-medium text-gray-600">Vue Version</span>
            <span class="text-sm text-gray-900 font-mono">{{ systemInfo.vueVersion }}</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span class="text-sm font-medium text-gray-600">Build Tool</span>
            <span class="text-sm text-gray-900 font-mono">Vite</span>
          </div>
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span class="text-sm font-medium text-gray-600">Build Time</span>
            <span class="text-sm text-gray-900 font-mono">{{ systemInfo.buildTime }}</span>
          </div>
          <div class="col-span-1 sm:col-span-2 p-3 bg-gray-50 rounded-lg">
            <span class="text-sm font-medium text-gray-600 block mb-1">Browser</span>
            <span class="text-xs text-gray-500 font-mono break-all">{{ systemInfo.userAgent }}</span>
          </div>
        </div>
      </div>
    </section>

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
import { useGitHubAPI } from '../../apis/useGitHubAPI.js'
import CustomDialog from './CustomDialog.vue'
import {
  Github,
  Globe,
  Settings,
  BookOpen,
  Info,
  RefreshCw,
  Save,
  Loader2,
  FolderOpen,
  Upload,
  CheckCircle,
  XCircle,
  Shield,
  Key,
  Image as ImageIcon
} from 'lucide-vue-next'

const { verifyGitHubConnection, loadCategoriesFromGitHub, saveCategoriesToGitHub, uploadBinaryFile } = useGitHubAPI()

// Connection status
const connectionStatus = ref(null)
const testing = ref(false)

// Environment config
const envConfig = ref({
  adminPassword: '',
  githubToken: '',
  githubOwner: '',
  githubRepo: '',
  githubBranch: ''
})

// Computed env items for display
const envItems = computed(() => [
  {
    key: 'VITE_ADMIN_PASSWORD',
    label: 'Admin Password',
    isSet: !!envConfig.value.adminPassword,
    value: null
  },
  {
    key: 'VITE_GITHUB_TOKEN',
    label: 'GitHub Token',
    isSet: !!envConfig.value.githubToken,
    value: null
  },
  {
    key: 'VITE_GITHUB_OWNER',
    label: 'GitHub Owner',
    isSet: false,
    value: envConfig.value.githubOwner || 'Default: maodeyu180'
  },
  {
    key: 'VITE_GITHUB_REPO',
    label: 'GitHub Repository',
    isSet: false,
    value: envConfig.value.githubRepo || 'Default: mao_nav'
  },
  {
    key: 'VITE_GITHUB_BRANCH',
    label: 'GitHub Branch',
    isSet: false,
    value: envConfig.value.githubBranch || 'Default: master'
  }
])

// System info
const systemInfo = ref({
  vueVersion: '',
  buildTime: '',
  userAgent: ''
})

// Website settings
const websiteTitle = ref('')
const currentTitle = ref('')
const titleSaving = ref(false)

// Logo settings
const logoFileInput = ref(null)
const selectedLogoFile = ref(null)
const logoPreview = ref('')
const currentLogo = ref('/logo.png')
const logoSaving = ref(false)

// Dialog state
const dialogVisible = ref(false)
const dialogType = ref('success')
const dialogTitle = ref('')
const dialogMessage = ref('')
const dialogDetails = ref([])

const showDialog = (type, title, message, details = []) => {
  dialogType.value = type
  dialogTitle.value = title
  dialogMessage.value = message
  dialogDetails.value = details
  dialogVisible.value = true
}

const closeDialog = () => {
  dialogVisible.value = false
}

// Test GitHub connection
const testConnection = async () => {
  testing.value = true
  try {
    connectionStatus.value = await verifyGitHubConnection()
  } catch (error) {
    connectionStatus.value = {
      connected: false,
      error: error.message
    }
  } finally {
    testing.value = false
  }
}

// Check environment config
const checkEnvConfig = () => {
  envConfig.value = {
    adminPassword: import.meta.env.VITE_ADMIN_PASSWORD ? '***' : '',
    githubToken: import.meta.env.VITE_GITHUB_TOKEN ? '***' : '',
    githubOwner: import.meta.env.VITE_GITHUB_OWNER || '',
    githubRepo: import.meta.env.VITE_GITHUB_REPO || '',
    githubBranch: import.meta.env.VITE_GITHUB_BRANCH || ''
  }
}

// Get system info
const getSystemInfo = () => {
  systemInfo.value = {
    vueVersion: '3.x',
    buildTime: new Date().toLocaleString('zh-CN'),
    userAgent: navigator.userAgent
  }
}

// Load website settings
const loadWebsiteSettings = async () => {
  try {
    const data = await loadCategoriesFromGitHub()
    currentTitle.value = data.title || 'Home导航'
    websiteTitle.value = currentTitle.value
  } catch (error) {
    console.error('Failed to load website settings:', error)
    currentTitle.value = 'Home导航'
    websiteTitle.value = 'Home导航'
  }
}

// Save title to GitHub
const saveTitleToGitHub = async () => {
  if (!websiteTitle.value.trim()) {
    showDialog('error', 'Input Error', 'Please enter a website title', [])
    return
  }

  titleSaving.value = true
  try {
    const data = await loadCategoriesFromGitHub()
    data.title = websiteTitle.value.trim()
    await saveCategoriesToGitHub(data)

    currentTitle.value = websiteTitle.value.trim()
    showDialog(
      'success',
      'Title Saved',
      'Your website title has been saved to GitHub.',
      [
        '• Changes will be deployed in 2-3 minutes',
        '• Check your deployment status if needed'
      ]
    )
  } catch (error) {
    console.error('Failed to save title:', error)
    showDialog(
      'error',
      'Save Failed',
      'An error occurred while saving the title.',
      [`• Error: ${error.message}`]
    )
  } finally {
    titleSaving.value = false
  }
}

// Select logo file
const selectLogo = () => {
  logoFileInput.value?.click()
}

// Handle logo file selection
const handleLogoSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return

  if (file.type !== 'image/png') {
    showDialog('error', 'Invalid Format', 'Please select a PNG image file', [])
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    showDialog(
      'error',
      'File Too Large',
      'Image file size must be under 2MB',
      [`• Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`]
    )
    return
  }

  selectedLogoFile.value = file

  const reader = new FileReader()
  reader.onload = (e) => {
    logoPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

// Save logo to GitHub
const saveLogoToGitHub = async () => {
  if (!selectedLogoFile.value) {
    showDialog('error', 'No File Selected', 'Please select a logo file first', [])
    return
  }

  logoSaving.value = true
  try {
    const arrayBuffer = await selectedLogoFile.value.arrayBuffer()
    const githubPath = 'public/logo.png'
    const message = `chore: update website logo - ${new Date().toLocaleString('zh-CN')}`

    await uploadBinaryFile(githubPath, arrayBuffer, message)

    currentLogo.value = logoPreview.value
    selectedLogoFile.value = null
    logoPreview.value = ''
    logoFileInput.value.value = ''

    showDialog(
      'success',
      'Logo Uploaded',
      'Your website logo has been saved to GitHub.',
      [
        '• Changes will be deployed in 2-3 minutes',
        '• Refresh the page after deployment to see the new logo'
      ]
    )
  } catch (error) {
    console.error('Failed to upload logo:', error)
    showDialog(
      'error',
      'Upload Failed',
      'An error occurred while uploading the logo.',
      [`• Error: ${error.message}`]
    )
  } finally {
    logoSaving.value = false
  }
}

onMounted(() => {
  checkEnvConfig()
  getSystemInfo()
  testConnection()
  loadWebsiteSettings()
})
</script>
