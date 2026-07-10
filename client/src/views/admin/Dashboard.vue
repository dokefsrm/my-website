<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import api from '../../api/index.js'

const postCount = ref(0)
const tutorialCount = ref(0)
const resourceCount = ref(0)
const recentItems = ref([])

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

    // 收集最近更新
    const items = []
    posts.items.forEach(p => {
      items.push({
        type: '文章', typeClass: 'article',
        title: p.title, time: p.updated_at || p.created_at,
        link: `/admin/posts/${p.id}/edit`,
        status: p.status,
      })
    })
    tutorials.forEach(t => {
      items.push({
        type: '教程', typeClass: 'tutorial',
        title: t.title, time: t.updated_at || t.created_at,
        link: `/admin/tutorials`,
        status: t.status,
      })
    })
    resources.items.forEach(r => {
      items.push({
        type: '资源', typeClass: 'resource',
        title: r.title, time: r.updated_at || r.created_at,
        link: `/admin/resources`,
        status: 'published',
      })
    })
    // 按时间倒序，取最近 10 条
    items.sort((a, b) => new Date(b.time) - new Date(a.time))
    recentItems.value = items.slice(0, 10)
  } catch {}
})

function formatDate(d) {
  if (!d) return ''
  const dt = new Date(d)
  const now = new Date()
  const diff = now - dt
  if (diff < 3600000) return Math.floor(diff / 60000) + ' 分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + ' 小时前'
  return dt.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>

<template>
  <div class="container">
    <h1 class="dash-title">📊 仪表盘</h1>

    <!-- 统计卡片 -->
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

    <!-- 快捷操作 -->
    <div class="quick-actions">
      <RouterLink to="/admin/posts/new" class="btn-primary">✏️ 写文章</RouterLink>
      <RouterLink to="/admin/posts" class="btn-outline">管理文章</RouterLink>
      <RouterLink to="/admin/tutorials" class="btn-outline">管理教程</RouterLink>
      <RouterLink to="/admin/resources" class="btn-outline">管理资源</RouterLink>
      <RouterLink to="/admin/settings" class="btn-outline">个人设置</RouterLink>
    </div>

    <!-- 最近更新 -->
    <div class="recent-section" v-if="recentItems.length">
      <h2>🕐 最近更新</h2>
      <div class="recent-list">
        <RouterLink
          v-for="(item, i) in recentItems"
          :key="i"
          :to="item.link"
          class="recent-item"
        >
          <span class="recent-type" :class="item.typeClass">{{ item.type }}</span>
          <span class="recent-title">{{ item.title }}</span>
          <span v-if="item.status === 'draft'" class="draft-dot">草稿</span>
          <span class="recent-time">{{ formatDate(item.time) }}</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dash-title { margin-bottom: 28px; }

.stats-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 28px;
}
.stat-card {
  background: var(--bg-card); border-radius: 12px; padding: 28px; text-align: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06); color: inherit;
  transition: all 0.2s;
}
.stat-card:hover { box-shadow: 0 4px 20px rgba(59,130,246,0.15); text-decoration: none; }
.stat-card .num { font-size: 36px; font-weight: 800; display: block; color: #3b82f6; }
.stat-card .label { font-size: 14px; color: var(--text-secondary); margin-top: 4px; display: block; }

.quick-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 36px; }
.btn-primary, .btn-outline {
  padding: 10px 20px; border-radius: 10px; font-size: 14px; font-weight: 500; display: inline-block;
}
.btn-primary { background: #3b82f6; color: #fff; }
.btn-primary:hover { background: #2563eb; text-decoration: none; }
.btn-outline { border: 1px solid var(--border); color: var(--text); background: var(--bg-card); }
.btn-outline:hover { border-color: #3b82f6; color: #3b82f6; text-decoration: none; }

.recent-section h2 { font-size: 18px; margin-bottom: 16px; }
.recent-list {
  background: var(--bg-card); border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06); overflow: hidden;
}
.recent-item {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 20px; border-bottom: 1px solid var(--border);
  color: inherit; text-decoration: none; transition: background 0.15s;
}
.recent-item:last-child { border-bottom: none; }
.recent-item:hover { background: var(--brand-soft); text-decoration: none; }
.recent-type {
  flex-shrink: 0; padding: 2px 8px; border-radius: 4px;
  font-size: 11px; font-weight: 600; width: 40px; text-align: center;
}
.recent-type.article { background: #dbeafe; color: #1d4ed8; }
.recent-type.tutorial { background: #dcfce7; color: #15803d; }
.recent-type.resource { background: #fef3c7; color: #a16207; }
body.dark .recent-type.article { background: #1e3a5f; color: #93c5fd; }
body.dark .recent-type.tutorial { background: #14532d; color: #86efac; }
body.dark .recent-type.resource { background: #3b2e00; color: #fde047; }
.recent-title { flex: 1; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.draft-dot {
  flex-shrink: 0; padding: 1px 8px; border-radius: 10px;
  font-size: 11px; background: #fef9c3; color: #a16207;
}
body.dark .draft-dot { background: #3b2e00; color: #fde047; }
.recent-time { flex-shrink: 0; font-size: 12px; color: var(--text-muted); }

@media (max-width: 640px) {
  .stats-grid { grid-template-columns: 1fr; }
  .recent-item { flex-wrap: wrap; }
}
</style>
