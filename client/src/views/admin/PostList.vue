<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import api from '../../api/index.js'

const posts = ref([])
const loading = ref(true)

async function fetchPosts() {
  try {
    const res = await api.get('/api/admin/posts')
    posts.value = res.items
  } catch {}
  loading.value = false
}

async function deletePost(id) {
  if (!confirm('确定删除这篇文章？')) return
  await api.delete(`/api/admin/posts/${id}`)
  posts.value = posts.value.filter(p => p.id !== id)
}

async function toggleStatus(post) {
  const newStatus = post.status === 'published' ? 'draft' : 'published'
  await api.put(`/api/admin/posts/${post.id}`, { status: newStatus })
  post.status = newStatus
}

onMounted(fetchPosts)
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>文章管理</h1>
      <RouterLink to="/admin/posts/new" class="btn-primary">+ 写文章</RouterLink>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <table v-else-if="posts.length" class="table">
      <thead>
        <tr>
          <th>标题</th>
          <th>状态</th>
          <th>日期</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in posts" :key="p.id">
          <td class="title-cell">{{ p.title }}</td>
          <td>
            <span class="status-badge" :class="p.status">
              {{ p.status === 'published' ? '已发布' : '草稿' }}
            </span>
          </td>
          <td class="date-cell">{{ new Date(p.created_at).toLocaleDateString('zh-CN') }}</td>
          <td class="actions-cell">
            <RouterLink :to="`/admin/posts/${p.id}/edit`" class="btn-sm">编辑</RouterLink>
            <button @click="toggleStatus(p)" class="btn-sm">
              {{ p.status === 'published' ? '撤回' : '发布' }}
            </button>
            <button @click="deletePost(p.id)" class="btn-sm danger">删除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="empty">暂无文章</div>

    <div style="margin-top:24px">
      <RouterLink to="/admin">← 返回仪表盘</RouterLink>
    </div>
  </div>
</template>

<style scoped>
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.btn-primary { padding: 10px 20px; background: #3b82f6; color: #fff; border-radius: 10px; font-weight: 500; }
.btn-primary:hover { background: #2563eb; text-decoration: none; }
.table { width: 100%; border-collapse: collapse; background: var(--bg-card); border-radius: 12px; overflow: hidden; box-shadow: var(--shadow); }
.table th { text-align: left; padding: 14px 16px; font-size: 13px; color: var(--text-muted); background: var(--bg-soft); border-bottom: 1px solid var(--border); }
.table td { padding: 14px 16px; border-bottom: 1px solid var(--border); font-size: 14px; }
.title-cell { font-weight: 500; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.date-cell { color: var(--text-muted); font-size: 13px; white-space: nowrap; }
.actions-cell { display: flex; gap: 6px; }
.btn-sm { padding: 4px 12px; border-radius: 6px; font-size: 12px; border: 1px solid var(--border); background: var(--bg-card); cursor: pointer; color: var(--text-secondary); }
.btn-sm:hover { border-color: var(--brand); color: var(--brand); text-decoration: none; }
.btn-sm.danger { color: #dc2626; }
.btn-sm.danger:hover { border-color: #dc2626; background: #fef2f2; }
body.dark .btn-sm.danger:hover { background: #3b1a1a; }
.status-badge { padding: 2px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; }
.status-badge.published { background: #dcfce7; color: #15803d; }
.status-badge.draft { background: #fef9c3; color: #a16207; }
body.dark .status-badge.published { background: #14532d; color: #86efac; }
body.dark .status-badge.draft { background: #3b2e00; color: #fde047; }
@media (max-width: 768px) {
  .table { font-size: 12px; }
  .table th, .table td { padding: 10px 8px; }
  .actions-cell { flex-direction: column; }
}
</style>
