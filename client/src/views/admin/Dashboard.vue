<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'
import api from '../../api/index.js'

const auth = useAuthStore()
const postCount = ref(0)
const tutorialCount = ref(0)
const resourceCount = ref(0)

onMounted(async () => {
  try {
    const [posts, tutorials, resources] = await Promise.all([
      api.get('/api/admin/posts'),
      api.get('/api/admin/tutorials'),
      api.get('/api/admin/resources'),
    ])
    postCount.value = posts.total
    tutorialCount.value = tutorials.length
    resourceCount.value = resources.items.length
  } catch {}
})
</script>

<template>
  <div class="container">
    <div class="admin-header">
      <h1>📊 仪表盘</h1>
      <div>
        <span style="margin-right:16px;color:#64748b">👤 {{ auth.user?.nickname || auth.user?.username }}</span>
        <button class="btn-text" @click="auth.logout()">退出</button>
      </div>
    </div>

    <div class="stats-grid">
      <RouterLink to="/admin/posts" class="stat-card">
        <span class="num">{{ postCount }}</span>
        <span class="label">文章</span>
      </RouterLink>
      <RouterLink to="/admin/tutorials" class="stat-card">
        <span class="num">{{ tutorialCount }}</span>
        <span class="label">教程系列</span>
      </RouterLink>
      <RouterLink to="/admin/resources" class="stat-card">
        <span class="num">{{ resourceCount }}</span>
        <span class="label">资源</span>
      </RouterLink>
    </div>

    <div class="admin-nav">
      <RouterLink to="/admin/posts/new" class="btn-primary">✏️ 写文章</RouterLink>
      <RouterLink to="/admin/posts" class="btn-outline">管理文章</RouterLink>
      <RouterLink to="/admin/tutorials" class="btn-outline">管理教程</RouterLink>
      <RouterLink to="/admin/resources" class="btn-outline">管理资源</RouterLink>
      <RouterLink to="/admin/settings" class="btn-outline">个人设置</RouterLink>
    </div>

    <div style="margin-top:32px">
      <RouterLink to="/" class="btn-text" target="_blank">↗ 查看网站前台</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.admin-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 32px;
}
.stats-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px;
}
.stat-card {
  background: #fff; border-radius: 12px; padding: 28px; text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06); color: inherit;
  transition: all 0.2s;
}
.stat-card:hover { box-shadow: 0 4px 20px rgba(59,130,246,0.15); text-decoration: none; }
.stat-card .num { font-size: 36px; font-weight: 800; display: block; color: #3b82f6; }
.stat-card .label { font-size: 14px; color: #64748b; margin-top: 4px; display: block; }
.admin-nav { display: flex; flex-wrap: wrap; gap: 10px; }
.btn-primary, .btn-outline {
  padding: 10px 20px; border-radius: 10px; font-size: 14px; font-weight: 500;
  display: inline-block;
}
.btn-primary { background: #3b82f6; color: #fff; }
.btn-primary:hover { background: #2563eb; text-decoration: none; }
.btn-outline { border: 1px solid #e2e8f0; color: #334155; }
.btn-outline:hover { border-color: #3b82f6; color: #3b82f6; text-decoration: none; }
.btn-text { font-size: 14px; color: #64748b; background: none; border: none; cursor: pointer; }
.btn-text:hover { color: #3b82f6; }
@media (max-width: 640px) {
  .stats-grid { grid-template-columns: 1fr; }
}
</style>
