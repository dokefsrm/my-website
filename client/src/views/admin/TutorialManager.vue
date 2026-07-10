<script setup>
import { ref, onMounted } from 'vue'
import api from '../../api/index.js'

const tutorials = ref([])
const loading = ref(true)
const showForm = ref(false)
const editing = ref(null)
const form = ref({ title: '', description: '', order: 0, status: 'draft' })

async function fetchData() {
  try { tutorials.value = await api.get('/api/admin/tutorials') } catch {}
  loading.value = false
}

function openNew() {
  editing.value = null
  form.value = { title: '', description: '', order: 0, status: 'draft' }
  showForm.value = true
}
function openEdit(t) {
  editing.value = t
  form.value = { title: t.title, description: t.description || '', order: t.order, status: t.status }
  showForm.value = true
}
async function save() {
  if (editing.value) {
    await api.put(`/api/admin/tutorials/${editing.value.id}`, form.value)
  } else {
    await api.post('/api/admin/tutorials', form.value)
  }
  showForm.value = false
  fetchData()
}
async function remove(id) {
  if (!confirm('确定删除？')) return
  await api.delete(`/api/admin/tutorials/${id}`)
  fetchData()
}
onMounted(fetchData)
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>教程管理</h1>
      <button @click="openNew" class="btn-primary">+ 新建系列</button>
    </div>

    <div v-if="showForm" class="form-card">
      <h3>{{ editing ? '编辑系列' : '新建系列' }}</h3>
      <input v-model="form.title" placeholder="系列标题" class="input">
      <input v-model="form.description" placeholder="描述" class="input">
      <div class="form-row">
        <input v-model.number="form.order" type="number" placeholder="排序" class="input" style="width:100px">
        <select v-model="form.status" class="input" style="width:120px">
          <option value="draft">草稿</option>
          <option value="published">发布</option>
        </select>
      </div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button @click="save" class="btn-primary">保存</button>
        <button @click="showForm = false" class="btn-outline">取消</button>
      </div>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="tutorials.length" class="list">
      <div v-for="t in tutorials" :key="t.id" class="list-item">
        <div>
          <strong>{{ t.title }}</strong>
          <span class="status-badge" :class="t.status">{{ t.status === 'published' ? '已发布' : '草稿' }}</span>
        </div>
        <div>
          <button @click="openEdit(t)" class="btn-sm">编辑</button>
          <button @click="remove(t.id)" class="btn-sm danger">删除</button>
        </div>
      </div>
    </div>

    <div v-else class="empty">暂无教程</div>

    <div style="margin-top:24px"><RouterLink to="/admin">← 仪表盘</RouterLink></div>
  </div>
</template>

<style scoped>
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.btn-primary { padding: 10px 20px; background: var(--brand); color: #fff; border-radius: 10px; font-weight: 500; border: none; cursor: pointer; }
.btn-outline { padding: 10px 20px; border: 1px solid var(--border); background: var(--bg-card); border-radius: 10px; cursor: pointer; color: var(--text-secondary); }
.form-card { background: var(--bg-card); border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: var(--shadow); }
.form-card h3 { margin-bottom: 16px; }
.input { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border); font-size: 14px; margin-bottom: 8px; background: var(--bg); color: var(--text); }
.form-row { display: flex; gap: 8px; }
.list-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: var(--bg-card); border-radius: 10px; margin-bottom: 8px; box-shadow: var(--shadow); }
.btn-sm { padding: 4px 12px; border-radius: 6px; font-size: 12px; border: 1px solid var(--border); background: var(--bg-card); cursor: pointer; margin-left: 6px; color: var(--text-secondary); }
.btn-sm.danger { color: #dc2626; }
.status-badge { padding: 2px 8px; border-radius: 20px; font-size: 11px; margin-left: 8px; }
.status-badge.published { background: #dcfce7; color: #15803d; }
.status-badge.draft { background: #fef9c3; color: #a16207; }
body.dark .status-badge.published { background: #14532d; color: #86efac; }
body.dark .status-badge.draft { background: #3b2e00; color: #fde047; }
</style>
