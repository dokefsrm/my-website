import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../api/index.js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const accessToken = ref(localStorage.getItem('accessToken') || '')
  const refreshToken = ref(localStorage.getItem('refreshToken') || '')

  const isLoggedIn = computed(() => !!accessToken.value && !!user.value)

  async function login(username, password) {
    const res = await api.post('/api/auth/login', { username, password })
    accessToken.value = res.accessToken
    refreshToken.value = res.refreshToken
    user.value = res.user
    localStorage.setItem('accessToken', res.accessToken)
    localStorage.setItem('refreshToken', res.refreshToken)
    return res
  }

  function logout() {
    user.value = null
    accessToken.value = ''
    refreshToken.value = ''
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }

  async function checkAuth() {
    if (!accessToken.value) return
    try {
      const res = await api.get('/api/auth/me')
      if (res.user) {
        user.value = res.user
      } else {
        logout()
      }
    } catch {
      logout()
    }
  }

  return { user, accessToken, refreshToken, isLoggedIn, login, logout, checkAuth }
})
