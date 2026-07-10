<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../../api/index.js'

const resources = ref([])
const loading = ref(true)
const showForm = ref(false)
const editing = ref(null)
const selectedCat = ref('全部')
const form = ref({ title: '', url: '', category: '程序', tags: '', description: '' })

const categories = ['程序', '书本', '网站', '工具', '其他']

// 按分类筛选
const filtered = computed(() => {
  if (selectedCat.value === '全部') return resources.value
  return resources.value.filter(r => r.category === selectedCat.value)
})

// 每个分类的数量
const catCounts = computed(() => {
  const counts = {}
  categories.forEach(c => { counts[c] = resources.value.filter(r => r.category === c).length })
  return counts
})

async function fetchData() {
  try { const res = await api.get('/api/admin/resources'); resources.value = res.items } catch {}
  loading.value = false
}
function openNew() {
  editing.value = null
  form.value = { title: '', url: '', category: '程序', tags: '', description: '' }
  showForm.value = true
}
function openEdit(r) {
  editing.value = r
  form.value = { ...r, tags: (r.tags || []).join(', ') }
  showForm.value = true
}
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

    <!-- 添加/编辑表单 -->
    <div v-if="showForm" class="form-card">
      <h3>{{ editing ? '编辑' : '添加' }}资源</h3>
      <div class="form-row">
        <div class="form-group flex-1">
          <label>名称</label>
          <input v-model="form.title" placeholder="资源名称" class="input">
        </div>
        <div class="form-group" style="width:140px">
          <label>分类</label>
          <select v-model="form.category" class="input">
            <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label>链接 URL</label>
        <input v-model="form.url" placeholder="https://..." class="input">
      </div>
      <div class="form-group">
        <label>描述</label>
        <input v-model="form.description" placeholder="简短描述" class="input">
      </div>
      <div class="form-group">
        <label>标签（逗号分隔）</label>
        <input v-model="form.tags" placeholder="免费, 开源, Windows" class="input">
      </div>
      <div style="display:flex;gap:8px">
        <button @click="save" class="btn-primary">保存</button>
        <button @click="showForm = false" class="btn-outline">取消</button>
      </div>
    </div>

    <!-- 分类筛选标签 -->
    <div class="filter-bar">
      <button class="filter-btn" :class="{ active: selectedCat === '全部' }" @click="selectedCat = '全部'">
        全部 ({{ resources.length }})
      </button>
      <button
        v-for="c in categories"
        :key="c"
        class="filter-btn"
        :class="{ active: selectedCat === c }"
        @click="selectedCat = c"
      >
        {{ c }} ({{ catCounts[c] || 0 }})
      </button>
    </div>

    <div v-if="loading" class="loading">加载中...</div>

    <!-- 按分类分组展示 -->
    <template v-else-if="filtered.length">
      <div v-for="cat in (selectedCat === '全部' ? categories.filter(c => catCounts[c] > 0) : [selectedCat])" :key="cat" class="cat-section">
        <h3 class="cat-title">{{ cat }} <span class="cat-count">{{ catCounts[cat] || 0 }}</span></h3>
        <div class="list">
          <div v-for="r in (selectedCat === '全部' ? resources.filter(r => r.category === cat) : filtered)" :key="r.id" class="list-item">
            <div class="item-info">
              <strong>{{ r.title }}</strong>
              <span class="item-desc">{{ r.description }}</span>
            </div>
            <div class="item-tags" v-if="r.tags?.length">
              <span class="mini-tag" v-for="t in r.tags" :key="t">{{ t }}</span>
            </div>
            <div class="item-actions">
              <button @click="openEdit(r)" class="btn-sm">编辑</button>
              <button @click="remove(r.id)" class="btn-sm danger">删除</button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="empty">暂无「{{ selectedCat }}」类资源</div>

    <div style="margin-top:24px"><RouterLink to="/admin">← 仪表盘</RouterLink></div>
  </div>
</template>

<style scoped>
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.btn-primary { padding: 10px 20px; background: var(--brand); color: #fff; border-radius: 10px; font-weight: 500; border: none; cursor: pointer; }
.btn-outline { padding: 10px 20px; border: 1px solid var(--border); background: var(--bg-card); border-radius: 10px; cursor: pointer; color: var(--text-secondary); }

.form-card { background: var(--bg-card); border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: var(--shadow); }
.form-card h3 { margin-bottom: 16px; }
.form-group { margin-bottom: 12px; }
.form-group label { display: block; font-size: 13px; font-weight: 600; color: var(--text-secondary); margin-bottom: 4px; }
.input { width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border); font-size: 14px; outline: none; background: var(--bg); color: var(--text); }
.input:focus { border-color: var(--brand); }
.form-row { display: flex; gap: 12px; }
.flex-1 { flex: 1; }

.filter-bar { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.filter-btn {
  padding: 6px 16px; border-radius: 20px; border: 1px solid var(--border);
  background: var(--bg-card); font-size: 13px; cursor: pointer; transition: all 0.2s; color: var(--text-secondary);
}
.filter-btn:hover { border-color: var(--brand); color: var(--brand); }
.filter-btn.active { background: var(--brand); color: #fff; border-color: var(--brand); }

.cat-section { margin-bottom: 24px; }
.cat-title { font-size: 16px; font-weight: 700; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid var(--border); }
.cat-count { font-size: 13px; color: var(--text-muted); font-weight: 400; margin-left: 6px; }

.list-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px; background: var(--bg-card); border-radius: 10px;
  margin-bottom: 6px; box-shadow: var(--shadow); gap: 16px;
}
.item-info strong { display: block; font-size: 14px; }
.item-desc { font-size: 12px; color: var(--text-muted); }
.item-tags { display: flex; gap: 4px; flex-wrap: wrap; }
.mini-tag {
  padding: 1px 8px; border-radius: 10px; font-size: 11px;
  background: var(--bg-soft); color: var(--text-secondary); white-space: nowrap;
}
.item-actions { display: flex; gap: 4px; flex-shrink: 0; }
.btn-sm { padding: 4px 12px; border-radius: 6px; font-size: 12px; border: 1px solid var(--border); background: var(--bg-card); cursor: pointer; color: var(--text-secondary); }
.btn-sm:hover { border-color: var(--brand); color: var(--brand); }
.btn-sm.danger { color: #dc2626; }
.btn-sm.danger:hover { border-color: #dc2626; background: #fef2f2; }
body.dark .btn-sm.danger:hover { background: #3b1a1a; }

@media (max-width: 768px) {
  .list-item { flex-direction: column; align-items: flex-start; gap: 8px; }
  .item-actions { align-self: flex-end; }
}
</style>
