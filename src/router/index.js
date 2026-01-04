import { createRouter, createWebHistory } from 'vue-router'
import NavHomeView from '../views/NavHomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: NavHomeView,
      meta: { title: '云飘导航 - 工具箱' }
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/AdminView.vue'),
      meta: {
        title: '管理后台 - 云飘导航',
        requiresAuth: true
      }
    },
  ],
})

// 路由前置守卫
router.beforeEach((to, from, next) => {
  if (to.meta?.title) {
    document.title = to.meta.title
  } else {
    document.title = '云飘导航'
  }
  next()
})

export default router
