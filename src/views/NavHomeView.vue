<template>
  <!-- 锁定界面 -->
  <div v-if="isLocked && !isUnlocked" class="lock-container">
    <div class="lock-box">
      <h1>🔐 访问验证</h1>
      <p class="lock-description">此导航站已启用访问保护</p>
      <form @submit.prevent="handleUnlock">
        <div class="form-group">
          <label for="unlock-password">请输入访问密钥:</label>
          <input
            id="unlock-password"
            type="password"
            v-model="unlockPassword"
            placeholder="请输入访问密钥"
            required
            class="form-input"
          />
        </div>
        <button type="submit" class="unlock-btn" :disabled="unlocking">
          {{ unlocking ? '验证中...' : '进入导航' }}
        </button>
      </form>
      <div v-if="unlockError" class="error-message">
        {{ unlockError }}
      </div>
    </div>
  </div>

  <!-- 正常导航界面 -->
  <div v-else class="nav-home">
    <!-- 主内容区 -->
    <main class="main-content">
      <!-- 顶部区域 -->
      <header class="header-section">

                <!-- 页面标题和控制区域 -->
        <div class="header-main">
          <div class="header-left">
            <h1 class="page-title">{{ title || 'home 直达' }}</h1>
            <div class="header-subtitle">简洁、美观的个人导航中心</div>
          </div>

          <div class="header-controls">
            <!-- 移动端菜单按钮 -->
            <button class="mobile-menu-btn" @click="toggleMobileMenu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- 移动端分类菜单 -->
        <div class="mobile-menu" :class="{ active: showMobileMenu }">
          <div class="mobile-menu-header">
            <div class="header-left">
              <h3>分类导航</h3>
              <img :src="githubLogo" alt="GitHub" class="header-github-icon" @click="openGitHub" />
            </div>
            <button class="close-btn" @click="closeMobileMenu">×</button>
          </div>
                    <ul class="mobile-category-list">
            <li
              v-for="category in categories"
              :key="category.id"
              class="mobile-category-item"
              @click="scrollToCategoryMobile(category.id)"
            >
              <span class="category-icon">{{ category.icon }}</span>
              <span class="category-name">{{ category.name }}</span>
            </li>
          </ul>
        </div>

        <!-- 移动端菜单遮罩 -->
        <div class="mobile-menu-overlay" :class="{ active: showMobileMenu }" @click="closeMobileMenu"></div>
      </header>

      <!-- 导航内容区 -->
      <div class="content-area">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading">
          <div class="loading-spinner"></div>
          <p>加载中...</p>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="error">
          <p>{{ error }}</p>
          <button @click="fetchCategories" class="retry-btn">重试</button>
        </div>

                <!-- 分类内容 -->
        <div v-else class="categories-container">
          <div class="categories-grid">
            <div
              v-for="category in categories"
              :key="category.id"
              class="category-column"
              :id="`category-${category.id}`"
            >
              <section class="category-section">
                <h2 class="category-title">
                  <span class="category-icon">{{ category.icon }}</span>
                  <span class="category-name">{{ category.name }}</span>
                </h2>

                <div class="sites-grid">
                  <a
                    v-for="site in category.sites"
                    :key="site.id"
                    :href="site.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="site-card"
                  >
                    <div class="site-icon">
                      <img :src="site.icon" :alt="site.name" @error="(e) => handleImageError(e, site.id)" />
                    </div>
                    <div class="site-info">
                      <h3 class="site-name">{{ site.name }}</h3>
                      <p class="site-description">{{ site.description }}</p>
                    </div>
                  </a>
                </div>
              </section>
            </div>
          </div>

          <!-- 页面底部信息 -->
          <footer class="page-footer" hidden="true">
            <div class="footer-content">
              <div class="footer-info">
                <h3>{{ title || 'home 直达' }}</h3>
                <p>一个简洁、美观的导航网站，收录优质网站资源</p>
              </div>

              <div class="footer-links">
                <a
                  href="https://github.com/maodeyu180/mao_nav"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="footer-link"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  开源项目
                </a>
              </div>
            </div>

            <div class="footer-bottom">
              <p>&copy; {{ new Date().getFullYear() }} home 直达 - 由 <a href="https://github.com/maodeyu180" target="_blank" rel="noopener noreferrer">maodeyu180</a> 用 ❤️ 制作</p>
              <p class="footer-tech">基于 Vue.js 构建 | <a href="https://github.com/maodeyu180/mao_nav" target="_blank" rel="noopener noreferrer">查看源代码</a></p>
            </div>
          </footer>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useNavigation } from '@/apis/useNavigation.js'
// 导入GitHub logo
import githubLogo from '@/assets/github.png'

// 使用导航API
const { categories, title, loading, error, fetchCategories } = useNavigation()

// 响应式数据
const showMobileMenu = ref(false) // 移动端菜单显示状态

// 表情图标数组 - 用于随机选择
const emojiIcons = [
  '🌟', '⭐', '🌈', '🔥', '💎', '🚀', '🌸', '🍀', '🌺', '🌻',
  '🌙', '☀️', '⚡', '💫', '✨', '🎯', '🎪', '🎨', '🎭', '🎪',
  '📱', '💻', '📺', '🎮', '📷', '📹', '🎬', '🎵', '🎧', '📚',
  '🔔', '🔍', '🔧', '⚙️', '🛠️', '🔨', '🔑', '🎁', '🎉', '🎊',
  '💡', '🔋', '📊', '📈', '📉', '💰', '🏆', '🎖️', '🏅', '🎗️',
  '🌍', '🌎', '🌏', '🗺️', '⛰️', '🏔️', '🌋', '🏞️', '🏝️', '🏜️',
  '💼', '👔', '🏢', '🏦', '🏪', '🏬', '🏭', '🏗️', '🏠', '🏡'
]

// 为每个网站生成并存储随机表情的映射
const siteEmojiMap = ref(new Map())

// 锁定功能相关
const isLocked = ref(false) // 是否启用锁定功能
const isUnlocked = ref(false) // 是否已解锁
const unlockPassword = ref('') // 解锁密码输入
const unlocking = ref(false) // 解锁中状态
const unlockError = ref('') // 解锁错误信息


// 自定义固定时间滚动函数
const smoothScrollTo = (container, targetTop, duration = 600) => {
  const startTop = container.scrollTop
  const distance = targetTop - startTop
  let startTime = null

  const animateScroll = (currentTime) => {
    if (startTime === null) startTime = currentTime
    const timeElapsed = currentTime - startTime
    const progress = Math.min(timeElapsed / duration, 1)

    // 使用缓动函数 (easeInOutCubic)
    const ease = progress < 0.5
      ? 4 * progress * progress * progress
      : 1 - Math.pow(-2 * progress + 2, 3) / 2

    container.scrollTop = startTop + distance * ease

    if (progress < 1) {
      requestAnimationFrame(animateScroll)
    }
  }

  requestAnimationFrame(animateScroll)
}

// 滚动到指定分类
const scrollToCategory = (categoryId) => {
  const element = document.getElementById(`category-${categoryId}`)
  const container = document.querySelector('.content-area')

  if (element && container) {
    // 检查是否为移动端
    const isMobile = window.innerWidth <= 768

    let targetTop = 0

    if (isMobile) {
      // 移动端：在 content-area 容器内滚动
      const elementOffsetTop = element.offsetTop
      const searchHeaderHeight = 80 // 固定高度，因为搜索框是fixed定位
      targetTop = elementOffsetTop - searchHeaderHeight
    } else {
      // 桌面端：在容器内滚动
      const searchHeader = document.querySelector('.search-header')
      const elementOffsetTop = element.offsetTop
      const searchHeaderHeight = searchHeader ? searchHeader.offsetHeight + 20 : 100
      targetTop = elementOffsetTop - searchHeaderHeight
    }

    // 使用固定时间滚动（600毫秒）
    smoothScrollTo(container, Math.max(0, targetTop), 600)
  }
}


// 检查是否启用锁定功能
const checkLockStatus = () => {
  const openLock = import.meta.env.VITE_OPEN_LOCK
  if (openLock && openLock.trim() !== '') {
    isLocked.value = true
    // 检查是否已经解锁过
    const savedUnlock = localStorage.getItem('nav_unlocked')
    if (savedUnlock === 'true') {
      isUnlocked.value = true
    }
  } else {
    isLocked.value = false
    isUnlocked.value = true // 如果没有启用锁定，默认为解锁状态
  }
}

// 处理解锁
const handleUnlock = async () => {
  unlocking.value = true
  unlockError.value = ''

    try {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD

    if (!adminPassword) {
      throw new Error('访问密钥未配置')
    }

    if (unlockPassword.value === adminPassword) {
      isUnlocked.value = true
      localStorage.setItem('nav_unlocked', 'true')
      unlockPassword.value = ''
      console.log('导航站解锁成功')
    } else {
      throw new Error('访问密钥错误，请重新输入')
    }
  } catch (error) {
    unlockError.value = error.message
  } finally {
    unlocking.value = false
  }
}


// 获取或生成网站的固定表情图标
const getRandomEmoji = (siteId) => {
  // 如果已经为该网站分配了表情，直接返回
  if (siteEmojiMap.value.has(siteId)) {
    return siteEmojiMap.value.get(siteId)
  }

  // 使用 siteId 生成固定的随机种子，确保每次刷新都得到相同的表情
  let seed = 0
  for (let i = 0; i < siteId.length; i++) {
    seed += siteId.charCodeAt(i)
  }

  // 使用固定种子生成固定的随机索引
  const randomIndex = seed % emojiIcons.length
  const emoji = emojiIcons[randomIndex]
  siteEmojiMap.value.set(siteId, emoji)
  return emoji
}

// 处理图片加载错误
const handleImageError = (event, siteId) => {
  // 隐藏图片，显示表情图标
  event.target.style.display = 'none'

  // 创建表情元素替代图片
  const emojiSpan = document.createElement('span')
  emojiSpan.textContent = getRandomEmoji(siteId)
  emojiSpan.className = 'emoji-icon'
  emojiSpan.style.cssText = `
    font-size: 32px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  `

  // 替换图片元素
  event.target.parentNode.appendChild(emojiSpan)
  event.target.onerror = null // 防止无限循环
}

// 移动端菜单控制
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  // 控制body滚动
  if (showMobileMenu.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
  // 恢复body滚动
  document.body.style.overflow = ''
}

// 移动端分类滚动
const scrollToCategoryMobile = (categoryId) => {
  closeMobileMenu() // 先关闭菜单

  // 稍微延迟一下再滚动，确保菜单关闭动画完成
  setTimeout(() => {
    scrollToCategory(categoryId)
  }, 200)
}

// 打开GitHub项目页面
const openGitHub = () => {
  window.open('https://github.com/maodeyu180/mao_nav', '_blank')
}

// 组件挂载时获取数据
onMounted(() => {
  checkLockStatus() // 检查锁定状态
  fetchCategories()
})

// 组件卸载时清理样式
onUnmounted(() => {
  // 确保卸载时恢复body滚动
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* 锁定界面样式 */
.lock-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2c3e50;
  padding: 20px;
  z-index: 9999;
}

.lock-box {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.lock-box h1 {
  color: #2d3748;
  margin-bottom: 8px;
  font-size: 28px;
  font-weight: 600;
}

.lock-description {
  color: #718096;
  margin-bottom: 30px;
  font-size: 16px;
}

.lock-box .form-group {
  margin-bottom: 20px;
  text-align: left;
}

.lock-box .form-group label {
  display: block;
  margin-bottom: 8px;
  color: #4a5568;
  font-weight: 500;
  font-size: 14px;
}

.lock-box .form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #fff;
}

.lock-box .form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.unlock-btn {
  width: 100%;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 10px;
}

.unlock-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.unlock-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.lock-box .error-message {
  margin-top: 15px;
  padding: 12px;
  background: #fed7d7;
  color: #c53030;
  border-radius: 8px;
  font-size: 14px;
  border: 1px solid #feb2b2;
}

.nav-home {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d30 100%);
}



/* 右侧主内容区样式 */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.search-header {
  background: white;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 15px;
}

.search-container {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  gap: 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex: 1;
}

@media (max-width: 768px) {
  .search-container {
    margin: 0;
    max-width: none;
  }
}

.search-engine-selector {
  position: relative;
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-right: 1px solid #e9ecef;
  transition: background-color 0.2s ease;
}

.search-engine-selector:hover {
  background: #e9ecef;
}

.engine-logo {
  width: 24px;
  height: 24px;
  margin: 8px;
  object-fit: contain;
  pointer-events: none;
  border-radius: 4px;
}

.engine-select {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  border: none;
  outline: none;
  background: transparent;
}

.search-input {
  flex: 1;
  border: none;
  padding: 12px 16px;
  font-size: 16px;
  outline: none;
  background: white;
}

.search-input::placeholder {
  color: #95a5a6;
}

/* 移动端菜单按钮显示控制 */
@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex !important;
  }
}

@media (min-width: 769px) {
  .mobile-menu-btn {
    display: none !important;
  }
}

/* 移动端菜单 */
.mobile-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 240px;
  height: 100vh;
  background: linear-gradient(180deg, #252526 0%, #1a1a1a 100%);
  box-shadow: -2px 0 20px rgba(0, 0, 0, 0.6);
  z-index: 1001;
  transition: right 0.3s ease;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  border-left: 1px solid rgba(64, 122, 255, 0.2);
}

.mobile-menu.active {
  right: 0;
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid rgba(64, 122, 255, 0.2);
  background: linear-gradient(135deg, #1a1a1a, #2d2d30);
  color: #FFFFFF;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mobile-menu-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.header-github-icon {
  width: 30px;
  height: 30px;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s ease;
  opacity: 0.8;
}

.header-github-icon:hover {
  opacity: 1;
  transform: scale(1.1);
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}

.mobile-category-list {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  overflow-y: auto;
  padding-bottom: 160px; /* 增加底部内边距确保最后一项完全可见 */
}

.mobile-category-item {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #FFFFFF;
}

.mobile-category-item:hover {
  background: rgba(64, 122, 255, 0.1);
  border-left: 3px solid #407AFF;
  padding-left: 17px;
}

.mobile-category-item .category-icon {
  font-size: 20px;
  margin-right: 12px;
  width: 24px;
  text-align: center;
}

.mobile-category-item .category-name {
  font-size: 16px;
  font-weight: 500;
  color: #FFFFFF;
}



/* 移动端菜单遮罩 */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}

.mobile-menu-overlay.active {
  opacity: 1;
  visibility: visible;
}

/* 内容区域样式 */
.content-area {
  flex: 1;
  padding: 15px 30px;
  padding-bottom: 100px;
  overflow-y: auto;
  background: transparent;
}

.loading, .error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #7f8c8d;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #ecf0f1;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.categories-container {
  max-width: 1400px;
  margin: 0 auto;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
  align-items: stretch;
}

.category-column {
  min-height: 0;
}

.category-section {
  background: linear-gradient(135deg, #252526 0%, #2d2d30 100%);
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(64, 122, 255, 0.2);
  margin-bottom: 30px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  backdrop-filter: blur(10px);
}

.category-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(64, 122, 255, 0.2);
  border-color: rgba(64, 122, 255, 0.4);
}

.category-title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.category-title .category-icon {
  font-size: 32px;
  margin-right: 16px;
}

.category-title .category-name {
  margin-left: 10px;
  font-size: 26px;
}

.sites-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  align-items: stretch;
}

.site-card {
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #3c3c3c 0%, #323233 100%);
  border-radius: 12px;
  padding: 15px;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
  height: 76px;
  box-sizing: border-box;
}

.site-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(64, 122, 255, 0.1), rgba(100, 149, 237, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.site-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(64, 122, 255, 0.2);
  border-color: rgba(64, 122, 255, 0.3);
}

.site-card:hover::before {
  opacity: 1;
}

.site-icon {
  width: 40px;
  height: 40px;
  margin-right: 12px;
  border-radius: 8px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.site-icon img {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

/* 表情图标样式 */
.site-icon .emoji-icon {
  font-size: 28px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: transform 0.3s ease;
}

.site-card:hover .emoji-icon {
  transform: scale(1.1);
}

.site-info {
  flex: 1;
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.site-name {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #FFFFFF;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.site-description {
  font-size: 12px;
  color: #CCCCCC;
  margin: 0;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 页面底部 */
.page-footer {
  margin-top: 60px;
  padding: 40px 0;
  background: linear-gradient(135deg, #252526 0%, #2d2d30 100%);
  border-radius: 12px;
  border-top: 3px solid #407AFF;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
  gap: 30px;
}

.footer-info h3 {
  color: #FFFFFF;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.footer-info p {
  color: #CCCCCC;
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
}

.footer-links {
  display: flex;
  gap: 15px;
}

.footer-link {
  display: flex;
  align-items: center;
  color: #407AFF;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 20px;
  background: rgba(64, 122, 255, 0.1);
  border: 1px solid rgba(64, 122, 255, 0.3);
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.footer-link:hover {
  background: rgba(64, 122, 255, 0.2);
  color: #64B5FF;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 122, 255, 0.4);
  border-color: rgba(64, 122, 255, 0.5);
}

.footer-link svg {
  margin-right: 6px;
  transition: transform 0.3s ease;
}

.footer-link:hover svg {
  transform: scale(1.1);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
  text-align: center;
}

.footer-bottom p {
  color: #CCCCCC;
  font-size: 13px;
  margin: 5px 0;
  line-height: 1.4;
}

.footer-bottom a {
  color: #407AFF;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.footer-bottom a:hover {
  color: #64B5FF;
  text-decoration: underline;
}

.footer-tech {
  font-size: 12px !important;
  opacity: 0.8;
}

/* 顶部控制按钮样式 */
.header-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.mobile-menu-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #FFFFFF;
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.mobile-menu-btn:hover {
  background: rgba(64, 122, 255, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(64, 122, 255, 0.3);
  color: #407AFF;
}

/* 页面标题样式 */
.header-main {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30px;
}

.header-left {
  display: flex;
  flex-direction: column;
}

.page-title {
  color: #FFFFFF;
  font-size: 22px;
  font-weight: 700;
  text-shadow: 0 2px 8px rgba(64, 122, 255, 0.3);
  margin: 0 0 2px 0;
  background: linear-gradient(135deg, #407AFF, #64B5FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.header-subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  font-weight: 400;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  line-height: 1.2;
}

/* 顶部区域样式 */
.header-section {
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(45, 45, 48, 0.95));
  backdrop-filter: blur(15px);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
  padding: 8px 0;
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid rgba(64, 122, 255, 0.2);
}

/* 搜索区域样式 */
.search-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 30px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .nav-home {
    min-height: 100vh;
  }

  .main-content {
    width: 100%;
  }

  .header-section {
    padding: 6px 0;
    position: relative;
  }

  .header-main {
    padding: 0 20px;
  }

  .page-title {
    font-size: 20px;
  }

  .header-subtitle {
    font-size: 11px;
  }

  .search-section {
    padding: 0 20px;
  }

  .search-container {
    max-width: none;
  }

  .search-input {
    padding: 16px 20px;
    font-size: 16px;
  }



  .content-area {
    padding: 30px 20px;
  }

  .categories-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .category-section {
    margin-bottom: 20px;
    padding: 20px;
  }

  .sites-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    align-items: stretch;
  }

  .site-card {
    padding: 20px;
    height: 88px;
    box-sizing: border-box;
  }

  .site-icon {
    width: 48px;
    height: 48px;
    margin-right: 16px;
  }

  .site-icon img {
    width: 32px;
    height: 32px;
  }

  .site-name {
    font-size: 18px;
  }

  .site-description {
    font-size: 14px;
  }

  .category-title {
    font-size: 24px;
    margin-bottom: 25px;
  }

  .category-title .category-icon {
    font-size: 28px;
    padding: 8px;
  }

  .category-title .category-name {
    font-size: 20px;
  }

  .site-icon {
    width: 48px;
    height: 48px;
    margin-right: 16px;
  }

  .site-icon img {
    width: 32px;
    height: 32px;
  }

  /* 移动端表情图标样式 */
  .site-icon .emoji-icon {
    font-size: 32px;
    width: 32px;
    height: 32px;
  }

  /* 移动端页面底部 */
  .page-footer {
    margin-top: 40px;
    padding: 30px 20px;
  }

  .footer-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .footer-links {
    justify-content: center;
  }

  .footer-bottom {
    padding-top: 15px;
  }

  .footer-bottom p {
    font-size: 12px;
  }


}

/* 中等屏幕响应式调整 */
@media (min-width: 769px) and (max-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 25px;
  }

  .category-section {
    padding: 20px;
  }

  .sites-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    align-items: stretch;
  }

  .site-card {
    padding: 12px;
    height: 68px;
    box-sizing: border-box;
  }

  .site-icon {
    width: 36px;
    height: 36px;
    margin-right: 10px;
  }

  .site-icon img {
    width: 24px;
    height: 24px;
  }

  .site-name {
    font-size: 14px;
  }

  .site-description {
    font-size: 11px;
  }
}

/* 深色主题样式 */
.dark-theme {
  background-color: #2c3e50 !important;
  color: #ecf0f1 !important;
}

.dark-theme .nav-home {
  background-color: #2c3e50 !important;
}

.dark-theme .header-section {
  background: linear-gradient(135deg, rgba(26, 26, 26, 0.95), rgba(34, 34, 34, 0.95)) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
}

.dark-theme .page-title {
  background: linear-gradient(135deg, #ecf0f1, #3498db) !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

.dark-theme .header-subtitle {
  color: rgba(236, 240, 241, 0.7) !important;
}

.dark-theme .content-area {
  background-color: #2c3e50 !important;
}

.dark-theme .category-section {
  background: #34495e !important;
  border-color: #404040 !important;
  display: flex !important;
  flex-direction: column !important;
  height: 100% !important;
}

.dark-theme .category-section:hover {
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4) !important;
}

.dark-theme .category-title {
  color: #ecf0f1 !important;
}

.dark-theme .site-card {
  background: #2d2d2d !important;
  border-color: #404040 !important;
  color: #ecf0f1 !important;
}

.dark-theme .site-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.4) !important;
}

.dark-theme .site-name {
  color: #ecf0f1 !important;
}

.dark-theme .site-description {
  color: #bdc3c7 !important;
}

.dark-theme .site-icon {
  background: #404040 !important;
}

.dark-theme .mobile-menu {
  background: #2d2d2d !important;
  color: #ecf0f1 !important;
}

.dark-theme .mobile-menu-header {
  background: #1a1a1a !important;
  color: #ecf0f1 !important;
}

.dark-theme .mobile-category-item {
  border-color: #404040 !important;
  color: #ecf0f1 !important;
}

.dark-theme .mobile-category-item:hover {
  background: #404040 !important;
}

.dark-theme .mobile-category-item .category-name {
  color: #ecf0f1 !important;
}

.dark-theme .mobile-menu-overlay {
  background: rgba(0, 0, 0, 0.7) !important;
}

.dark-theme .page-footer {
  background: linear-gradient(135deg, #2d2d2d 0%, #404040 100%) !important;
  border-color: #404040 !important;
}

.dark-theme .footer-info h3 {
  color: #ecf0f1 !important;
}

.dark-theme .footer-info p {
  color: #bdc3c7 !important;
}

.dark-theme .footer-bottom p {
  color: #95a5a6 !important;
}

.dark-theme .footer-bottom a {
  color: #3498db !important;
}

.dark-theme .loading,
.dark-theme .error {
  color: #bdc3c7 !important;
}

.dark-theme .lock-container {
  background: #2c3e50 !important;
}

.dark-theme .lock-box {
  background: #34495e !important;
  color: #ecf0f1 !important;
}

.dark-theme .lock-box h1 {
  color: #ecf0f1 !important;
}

.dark-theme .lock-description {
  color: #bdc3c7 !important;
}

.dark-theme .lock-box .form-group label {
  color: #bdc3c7 !important;
}

.dark-theme .lock-box .form-input {
  background: #404040 !important;
  border-color: #555 !important;
  color: #ecf0f1 !important;
}

.dark-theme .lock-box .form-input:focus {
  border-color: #3498db !important;
}

.dark-theme .unlock-btn {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%) !important;
}

.dark-theme .lock-box .error-message {
  background: rgba(231, 76, 60, 0.2) !important;
  color: #e74c3c !important;
  border-color: #e74c3c !important;
}

</style>
