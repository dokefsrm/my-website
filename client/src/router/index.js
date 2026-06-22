import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth.js'

const routes = [
  // 公开页面
  { path: '/', name: 'Home', component: () => import('../views/Home.vue') },
  { path: '/blog', name: 'Blog', component: () => import('../views/BlogList.vue') },
  { path: '/blog/:id', name: 'BlogPost', component: () => import('../views/BlogPost.vue') },
  { path: '/tutorials', name: 'Tutorials', component: () => import('../views/Tutorials.vue') },
  { path: '/tutorials/:id', name: 'TutorialChapters', component: () => import('../views/TutorialChapters.vue') },
  { path: '/resources', name: 'Resources', component: () => import('../views/Resources.vue') },
  { path: '/about', name: 'About', component: () => import('../views/About.vue') },

  // 管理后台
  { path: '/admin/login', name: 'Login', component: () => import('../views/admin/Login.vue') },
  { path: '/admin', name: 'Dashboard', component: () => import('../views/admin/Dashboard.vue'), meta: { auth: true } },
  { path: '/admin/posts', name: 'PostList', component: () => import('../views/admin/PostList.vue'), meta: { auth: true } },
  { path: '/admin/posts/new', name: 'PostNew', component: () => import('../views/admin/PostEditor.vue'), meta: { auth: true } },
  { path: '/admin/posts/:id/edit', name: 'PostEdit', component: () => import('../views/admin/PostEditor.vue'), meta: { auth: true } },
  { path: '/admin/tutorials', name: 'TutorialManager', component: () => import('../views/admin/TutorialManager.vue'), meta: { auth: true } },
  { path: '/admin/resources', name: 'ResourceManager', component: () => import('../views/admin/ResourceManager.vue'), meta: { auth: true } },
  { path: '/admin/settings', name: 'Settings', component: () => import('../views/admin/Settings.vue'), meta: { auth: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.auth) {
    const auth = useAuthStore()
    if (!auth.isLoggedIn) {
      return next('/admin/login')
    }
  }
  next()
})

export default router
