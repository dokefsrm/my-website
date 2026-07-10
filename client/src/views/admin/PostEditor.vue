<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../api/index.js'
import RichEditor from '../../components/RichEditor.vue'

const route = useRoute()
const router = useRouter()
const isEdit = !!route.params.id

const title = ref('')
const content = ref('')
const cover = ref('')
const excerpt = ref('')
const tags = ref('')
const status = ref('published')
const saving = ref(false)
const message = ref('')

onMounted(async () => {
  if (!isEdit) return
  try {
    const all = await api.get('/api/admin/posts')
    const found = all.items.find(p => p.id === Number(route.params.id))
    if (found) {
      title.value = found.title || ''
      cover.value = found.cover || ''
      excerpt.value = found.excerpt || ''
      tags.value = (found.tags || []).join(', ')
      status.value = found.status || 'draft'
      try {
        const full = await api.get(`/api/admin/posts/${route.params.id}`)
        if (full) { content.value = full.content || ''; cover.value = full.cover || cover.value }
      } catch { content.value = '' }
    } else {
      router.push('/admin/posts')
    }
  } catch { router.push('/admin/posts') }
})

async function save(publish) {
  saving.value = true
  message.value = ''
  const data = {
    title: title.value,
    content: content.value,
    cover: cover.value,
    excerpt: excerpt.value || content.value.replace(/<[^>]*>/g, '').slice(0, 150),
    tags: tags.value.split(/[,，]/).map(t => t.trim()).filter(Boolean),
    status: publish ? 'published' : 'draft',
  }
  try {
    if (isEdit) {
      await api.put(`/api/admin/posts/${route.params.id}`, data)
    } else {
      await api.post('/api/admin/posts', data)
    }
    message.value = publish ? '发布成功 ✓' : '草稿已保存 ✓'
  } catch (e) {
    message.value = '保存失败: ' + (e.response?.data?.error || e.message)
  }
  saving.value = false
}

function uploadCover() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = async e => {
    const file = e.target.files[0]
    if (!file) return
    const form = new FormData()
    form.append('file', file)
    try {
      const token = localStorage.getItem('accessToken')
      const res = await fetch('/api/admin/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: form })
      const data = await res.json()
      if (data.url) cover.value = data.url
    } catch { alert('上传失败') }
  }
  input.click()
}
</script>

<template>
  <div class="container">
    <h1>{{ isEdit ? '编辑文章' : '写文章' }}</h1>

    <div v-if="message" class="msg" :class="{ err: message.includes('失败') }">{{ message }}</div>

    <div class="form-group">
      <label>标题</label>
      <input v-model="title" type="text" placeholder="文章标题" class="input">
    </div>

    <div class="form-group">
      <label>封面图（URL 或上传）</label>
      <div class="cover-row">
        <input v-model="cover" type="text" placeholder="https://... 或将图片拖入编辑器" class="input flex-1">
        <button class="btn-outline-sm" @click="uploadCover">📤 上传</button>
      </div>
      <img v-if="cover" :src="cover" class="cover-preview">
    </div>

    <div class="form-group">
      <label>内容</label>
      <RichEditor v-model="content" placeholder="开始写作..." />
    </div>

    <div class="form-row">
      <div class="form-group flex-1">
        <label>标签（逗号分隔）</label>
        <input v-model="tags" type="text" placeholder="Vue, 前端" class="input">
      </div>
      <div class="form-group">
        <label>状态</label>
        <select v-model="status" class="input">
          <option value="draft">草稿</option>
          <option value="published">已发布</option>
        </select>
      </div>
    </div>

    <div class="form-group">
      <label>摘要</label>
      <input v-model="excerpt" type="text" placeholder="留空自动从内容提取" class="input">
    </div>

    <div class="actions">
      <button @click="save(false)" :disabled="saving" class="btn-outline">💾 存草稿</button>
      <button @click="save(true)" :disabled="saving" class="btn-primary">📤 发布</button>
    </div>
  </div>
</template>

<style scoped>
h1 { margin-bottom: 24px; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 6px; color: var(--text-secondary); }
.input { width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--border); font-size: 15px; outline: none; font-family: inherit; background: var(--bg-card); color: var(--text); }
.input:focus { border-color: var(--brand); }
.textarea { resize: vertical; font-family: 'Fira Code', monospace; font-size: 13px; line-height: 1.6; }
.hint { font-size: 12px; color: var(--text-muted); margin-top: 4px; display: block; }
.form-row { display: flex; gap: 16px; }
.flex-1 { flex: 1; }
.actions { display: flex; gap: 12px; margin-top: 24px; }
.btn-primary, .btn-outline { padding: 10px 24px; border-radius: 10px; font-size: 15px; font-weight: 500; cursor: pointer; border: none; }
.btn-primary { background: var(--brand); color: #fff; }
.btn-outline { background: var(--bg-card); border: 1px solid var(--border); color: var(--text-secondary); }
.btn-primary:hover { background: var(--brand-hover); }
.btn-outline:hover { border-color: var(--brand); }
button:disabled { opacity: 0.5; cursor: default; }
select.input { width: 140px; }
.msg { padding: 10px 14px; border-radius: 8px; background: #dcfce7; color: #15803d; margin-bottom: 16px; font-size: 14px; }
.msg.err { background: #fef2f2; color: #dc2626; }
body.dark .msg { background: #14532d; color: #86efac; }
body.dark .msg.err { background: #3b1a1a; color: #fca5a5; }
.cover-row { display: flex; gap: 8px; align-items: center; }
.cover-preview { max-width: 300px; max-height: 150px; border-radius: 8px; margin-top: 8px; border: 1px solid var(--border); }
.btn-outline-sm { padding: 8px 14px; border: 1px solid var(--border); background: var(--bg-card); border-radius: 8px; cursor: pointer; font-size: 13px; white-space: nowrap; color: var(--text-secondary); }
.btn-outline-sm:hover { border-color: var(--brand); }
@media (max-width: 640px) { .form-row { flex-direction: column; } select.input { width: 100%; } }
</style>
