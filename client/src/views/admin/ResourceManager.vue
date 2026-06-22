<script setup>
import { ref, onMounted } from 'vue'
import api from '../../api/index.js'

const resources = ref([])
const loading = ref(true)
const showForm = ref(false)
const editing = ref(null)
const form = ref({ title: '', url: '', category: '工具', tags: '', description: '' })

async function fetchData() {
  try { const res = await api.get('/api/admin/resources'); resources.value = res.items } catch {}
  loading.value = false
}
function openNew() { editing.value = null; form.value = { title: '', url: '', category: '工具', tags: '', description: '' }; showForm.value = true }
function openEdit(r) { editing.value = r; form.value = { ...r, tags: (r.tags || []).join(', ') }; showForm.value = true }
async function save() {
  const data = { ...form.value, tags: form.value.tags.split(/[,，]/).map(t => t.trim()).filter(Boolean) }
  if (editing.value) { await api.put(`/api/admin/resources/${editing.value.id}`, data) }
  else { await api.post('/api/admin/resources', data) }
  showForm.value = false; fetchData()
}
async function remove(id) { if (!confirm('确定删除？')) return; await api.delete(`/api/admin/resources/${id}`); fetchData() }
onMounted(fetchData)
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>资源管理</h1>
      <button @click="openNew" class="btn-primary">+ 添加资源</button>
    </div>

    <div v-if="showForm" class="form-card">
      <h3>{{ editing ? '编辑' : '添加' }}资源</h3>
      <input v-model="form.title" placeholder="名称" class="input">
      <input v-model="form.url" placeholder="链接 URL" class="input">
      <input v-model="form.description" placeholder="描述" class="input">
      <div class="form-row">
        <select v-model="form.category" class="input" style="width:120px">
          <option>工具</option><option>书籍</option><option>网站</option>
        </select>
        <input v-model="form.tags" placeholder="标签（逗号分隔）" class="input" style="flex:1">
      </div>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button @click="save" class="btn-primary">保存</button>
        <button @click="showForm = false" class="btn-outline">取消</button>
      </div>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else-if="resources.length" class="list">
      <div v-for="r in resources" :key="r.id" class="list-item">
        <div>
          <strong>{{ r.title }}</strong>
          <span class="cat">{{ r.category }}</span>
        </div>
        <div>
          <button @click="openEdit(r)" class="btn-sm">编辑</button>
          <button @click="remove(r.id)" class="btn-sm danger">删除</button>
        </div>
      </div>
    </div>
    <div v-else class="empty">暂无资源</div>
    <div style="margin-top:24px"><RouterLink to="/admin">← 仪表盘</RouterLink></div>
  </div>
</template>

<style scoped>
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.btn-primary { padding: 10px 20px; background: #3b82f6; color: #fff; border-radius: 10px; font-weight: 500; border: none; cursor: pointer; }
.btn-outline { padding: 10px 20px; border: 1px solid #e2e8f0; background: #fff; border-radius: 10px; cursor: pointer; }
.form-card { background: #fff; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
.form-card h3 { margin-bottom: 16px; }
.input { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 14px; margin-bottom: 8px; }
.form-row { display: flex; gap: 8px; }
.list-item { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: #fff; border-radius: 10px; margin-bottom: 8px; box-shadow: 0 1px 2px rgba(0,0,0,0.04); }
.cat { padding: 2px 8px; border-radius: 4px; font-size: 11px; background: #eff6ff; color: #3b82f6; margin-left: 8px; }
.btn-sm { padding: 4px 12px; border-radius: 6px; font-size: 12px; border: 1px solid #e2e8f0; background: #fff; cursor: pointer; margin-left: 6px; }
.btn-sm.danger { color: #dc2626; }
</style>
