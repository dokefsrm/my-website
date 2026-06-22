<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth.js'

const router = useRouter()
const auth = useAuthStore()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(username.value, password.value)
    router.push('/admin')
  } catch (e) {
    error.value = e.response?.data?.error || '登录失败'
  }
  loading.value = false
}
</script>

<template>
  <div class="login-page">
    <form class="login-form" @submit.prevent="handleLogin">
      <h1>🔐 管理员登录</h1>
      <div v-if="error" class="error">{{ error }}</div>
      <input v-model="username" type="text" placeholder="用户名" required autocomplete="username">
      <input v-model="password" type="password" placeholder="密码" required autocomplete="current-password">
      <button type="submit" :disabled="loading">
        {{ loading ? '登录中...' : '登录' }}
      </button>
    </form>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #eff6ff, #f5f3ff);
}
.login-form {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 4px 30px rgba(0,0,0,0.08);
}
.login-form h1 { font-size: 22px; margin-bottom: 24px; text-align: center; }
.login-form input {
  width: 100%; padding: 12px 16px; border-radius: 10px;
  border: 1px solid #e2e8f0; font-size: 15px; margin-bottom: 12px;
  outline: none; transition: border-color 0.2s;
}
.login-form input:focus { border-color: #3b82f6; }
.login-form button {
  width: 100%; padding: 12px; border-radius: 10px;
  background: #3b82f6; color: #fff; font-size: 16px;
  font-weight: 600; border: none; cursor: pointer; margin-top: 8px;
  transition: background 0.2s;
}
.login-form button:hover { background: #2563eb; }
.login-form button:disabled { opacity: 0.6; cursor: default; }
.error {
  background: #fef2f2; color: #dc2626; padding: 10px 14px;
  border-radius: 8px; font-size: 14px; margin-bottom: 16px;
}
</style>
