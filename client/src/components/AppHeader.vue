<script setup>
import { useAuthStore } from '../stores/auth.js'
import { useRouter, useRoute } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const isAdmin = () => route.path.startsWith('/admin')

function goAdmin() {
  router.push(auth.isLoggedIn ? '/admin' : '/admin/login')
}
</script>

<template>
  <nav class="app-nav" :class="{ admin: isAdmin() }">
    <div class="nav-brand">
      <router-link to="/" class="brand-link">dokefsrm</router-link>
    </div>
    <div class="nav-links" v-if="!isAdmin()">
      <router-link to="/blog">博客</router-link>
      <router-link to="/tutorials">教程</router-link>
      <router-link to="/resources">资源</router-link>
      <router-link to="/about">关于</router-link>
    </div>
    <div class="nav-actions">
      <button class="btn-admin" @click="goAdmin">
        {{ auth.isLoggedIn ? '后台' : '登录' }}
      </button>
    </div>
  </nav>
</template>

<style scoped>
.app-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0,0,0,0.06);
  position: sticky;
  top: 0;
  z-index: 100;
}
.app-nav.admin {
  background: #1a1a2e;
  color: #fff;
}
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
.nav-links {
  display: flex;
  gap: 8px;
}
.nav-links a {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 14px;
  color: #555;
  text-decoration: none;
  transition: all 0.2s;
}
.nav-links a:hover, .nav-links a.router-link-active {
  background: rgba(59,130,246,0.1);
  color: #3b82f6;
}
.btn-admin {
  padding: 6px 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-admin:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}
@media (max-width: 640px) {
  .nav-links { gap: 2px; }
  .nav-links a { padding: 6px 8px; font-size: 13px; }
}
</style>
