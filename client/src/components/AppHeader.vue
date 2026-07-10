<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth.js'
import { useRoute, useRouter } from 'vue-router'
import SearchBox from './SearchBox.vue'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const isDark = ref(false)

const isAdminPage = computed(() => route.path.startsWith('/admin'))
const isLoginPage = computed(() => route.path === '/admin/login')

onMounted(() => {
  isDark.value = localStorage.getItem('darkMode') === 'true'
})

watch(isDark, (val) => {
  document.body.classList.toggle('dark', val)
}, { immediate: true })

function toggleDark() {
  isDark.value = !isDark.value
  localStorage.setItem('darkMode', isDark.value)
}

function logout() {
  auth.logout()
  router.push('/admin/login')
}
</script>

<template>
  <!-- 后台页面导航 -->
  <nav v-if="isAdminPage && !isLoginPage" class="app-nav admin">
    <div class="nav-brand">
      <span class="brand-link">⚙️ 管理后台</span>
    </div>
    <div class="nav-links">
      <router-link to="/admin">仪表盘</router-link>
      <router-link to="/admin/posts">文章</router-link>
      <router-link to="/admin/tutorials">教程</router-link>
      <router-link to="/admin/resources">资源</router-link>
      <router-link to="/admin/settings">设置</router-link>
    </div>
    <div class="admin-right">
      <SearchBox />
      <button class="theme-toggle admin-toggle" @click="toggleDark" :title="isDark ? '亮色模式' : '暗色模式'" />
      <div class="user-menu">
        <span class="user-nick">👤 {{ auth.user?.nickname || auth.user?.username }}</span>
        <span class="user-drop">
          <router-link to="/" target="_blank" class="btn-sm">前台</router-link>
          <button class="btn-sm" @click="logout">退出</button>
        </span>
      </div>
    </div>
  </nav>

  <!-- 前台导航 -->
  <nav v-else-if="!isAdminPage" class="app-nav">
    <div class="nav-brand">
      <router-link to="/" class="brand-link">dokefsrm</router-link>
    </div>
    <div class="search-center">
      <SearchBox />
    </div>
    <div class="nav-links">
      <router-link to="/blog">博客</router-link>
      <router-link to="/tutorials">教程</router-link>
      <router-link to="/resources">资源</router-link>
      <router-link to="/about">关于</router-link>
      <button class="theme-toggle" @click="toggleDark" :title="isDark ? '亮色模式' : '暗色模式'" />
    </div>
  </nav>
</template>

<style scoped>
.app-nav {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 28px;
  background: var(--bg-card);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}
body.dark .app-nav:not(.admin) {
  background: linear-gradient(135deg, #1a1a2e 0%, #1e2746 50%, #1a1f35 100%);
  border-bottom-color: rgba(255,255,255,0.06);
}
.nav-brand { flex-shrink: 0; }
.search-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.nav-links {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
  margin-left: auto;
}
.app-nav.admin {
  background: #1a1a2e;
  color: #fff;
  border-bottom-color: rgba(255,255,255,0.08);
}
.admin .nav-links { margin-left: 0; }
.admin-right {
  display: flex; align-items: center; gap: 12px; margin-left: auto; flex-shrink: 0;
}
.user-menu { display: flex; align-items: center; gap: 6px; }
.user-drop { display: flex; gap: 4px; }
.brand-link {
  font-size: 20px;
  font-weight: 800;
  color: inherit;
  text-decoration: none;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.nav-links a {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 14px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.2s;
}
.nav-links a:hover, .nav-links a.router-link-active {
  background: rgba(59,130,246,0.1);
  color: #3b82f6;
}
.admin .nav-links a {
  color: #cbd5e1;
}
.admin .nav-links a:hover, .admin .nav-links a.router-link-active {
  background: rgba(255,255,255,0.1);
  color: #fff;
}
.nav-actions { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.user-nick { font-size: 13px; color: #94a3b8; }
.admin-toggle { border-color: rgba(255,255,255,0.2) !important; }
.btn-sm {
  padding: 5px 14px;
  border-radius: 6px;
  font-size: 12px;
  border: 1px solid rgba(255,255,255,0.2);
  background: transparent;
  color: #cbd5e1;
  cursor: pointer;
}
.btn-sm:hover { background: rgba(255,255,255,0.1); color: #fff; }
@media (max-width: 768px) {
  .search-center {
    position: static; transform: none; order: 3; flex: 1; min-width: 0;
  }
  .admin-right { flex-wrap: wrap; gap: 6px; }
  .user-drop { display: none; }
  .nav-links { order: 2; }
  .app-nav { padding: 10px 12px; flex-wrap: wrap; gap: 8px; }
  .nav-links a { padding: 4px 8px; font-size: 12px; }
  .app-nav.admin .nav-links { flex-wrap: wrap; }
}
</style>
