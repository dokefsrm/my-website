<script setup>
import { ref, onMounted } from 'vue'
import api from '../../api/index.js'

const form = ref({ name: '', bio: '', skills: '', github: '', email: '' })
const message = ref('')
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await api.get('/api/about')
    form.value = {
      name: data.name || '',
      bio: data.bio || '',
      skills: (data.skills || []).join(', '),
      github: data.social?.github || '',
      email: data.social?.email || '',
    }
  } catch {}
  loading.value = false
})

async function save() {
  message.value = ''
  try {
    await api.put('/api/admin/about', {
      name: form.value.name,
      bio: form.value.bio,
      skills: form.value.skills.split(/[,，]/).map(s => s.trim()).filter(Boolean),
      social: { github: form.value.github, email: form.value.email },
    })
    message.value = '保存成功 ✓'
  } catch (e) {
    message.value = '保存失败: ' + (e.response?.data?.error || e.message)
  }
}
</script>

<template>
  <div class="container">
    <h1>个人设置</h1>

    <div v-if="loading" class="loading">加载中...</div>

    <div v-else class="form-card">
      <div v-if="message" class="msg" :class="{ err: message.includes('失败') }">{{ message }}</div>

      <div class="form-group">
        <label>昵称</label>
        <input v-model="form.name" class="input">
      </div>
      <div class="form-group">
        <label>个人介绍</label>
        <textarea v-model="form.bio" rows="4" class="input"></textarea>
      </div>
      <div class="form-group">
        <label>技能（逗号分隔）</label>
        <input v-model="form.skills" class="input" placeholder="JavaScript, Vue, Node.js">
      </div>
      <div class="form-group">
        <label>GitHub</label>
        <input v-model="form.github" class="input" placeholder="https://github.com/xxx">
      </div>
      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" class="input">
      </div>

      <button @click="save" class="btn-primary">保存设置</button>
    </div>

    <div style="margin-top:24px"><RouterLink to="/admin">← 仪表盘</RouterLink></div>
  </div>
</template>

<style scoped>
.form-card { background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); max-width: 600px; }
.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 14px; font-weight: 600; margin-bottom: 6px; color: #475569; }
.input { width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 15px; outline: none; font-family: inherit; }
.input:focus { border-color: #3b82f6; }
.btn-primary { padding: 12px 24px; background: #3b82f6; color: #fff; border: none; border-radius: 10px; font-size: 15px; cursor: pointer; }
.btn-primary:hover { background: #2563eb; }
.msg { padding: 10px 14px; border-radius: 8px; background: #f0fdf4; color: #15803d; margin-bottom: 16px; font-size: 14px; }
.msg.err { background: #fef2f2; color: #dc2626; }
</style>
