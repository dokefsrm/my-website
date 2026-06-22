<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../api/index.js'

const route = useRoute()
const router = useRouter()
const isEdit = !!route.params.id

const title = ref('')
const content = ref('')
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
      excerpt.value = found.excerpt || ''
      tags.value = (found.tags || []).join(', ')
      status.value = found.status || 'draft'
      // 获取完整内容
      try {
        const full = await api.get(`/api/admin/posts/${route.params.id}`)
        if (full) content.value = full.content || ''
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
      <label>内容（支持 HTML）</label>
      <textarea v-model="content" rows="18" class="input textarea" placeholder="<p>段落文字</p><h2>小标题</h2><img src='/uploads/xxx.jpg' alt=''><a href='https://...'>链接</a><pre><code>代码块</code></pre><blockquote>引用</blockquote>"></textarea>
      <span class="hint">支持 HTML：p, h1-h4, img, a, pre, code, blockquote, ul/ol/li, strong, em</span>
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
.form-group label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 6px; color: #475569; }
.input { width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 15px; outline: none; font-family: inherit; }
.input:focus { border-color: #3b82f6; }
.textarea { resize: vertical; font-family: 'Fira Code', monospace; font-size: 13px; line-height: 1.6; }
.hint { font-size: 12px; color: #94a3b8; margin-top: 4px; display: block; }
.form-row { display: flex; gap: 16px; }
.flex-1 { flex: 1; }
.actions { display: flex; gap: 12px; margin-top: 24px; }
.btn-primary, .btn-outline { padding: 10px 24px; border-radius: 10px; font-size: 15px; font-weight: 500; cursor: pointer; border: none; }
.btn-primary { background: #3b82f6; color: #fff; }
.btn-outline { background: #fff; border: 1px solid #e2e8f0; color: #334155; }
.btn-primary:hover { background: #2563eb; }
.btn-outline:hover { border-color: #3b82f6; }
button:disabled { opacity: 0.5; cursor: default; }
select.input { width: 140px; }
.msg { padding: 10px 14px; border-radius: 8px; background: #f0fdf4; color: #15803d; margin-bottom: 16px; font-size: 14px; }
.msg.err { background: #fef2f2; color: #dc2626; }
@media (max-width: 640px) { .form-row { flex-direction: column; } select.input { width: 100%; } }
</style>
