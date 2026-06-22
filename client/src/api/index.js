import axios from 'axios'

const api = axios.create({
  timeout: 10000,
})

// 请求拦截器：自动带 Token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器：自动刷新 Token
api.interceptors.response.use(
  res => res.data,
  async err => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem('refreshToken')
      if (refresh) {
        try {
          const { accessToken } = await axios.post('/api/auth/refresh', { refreshToken: refresh })
          localStorage.setItem('accessToken', accessToken)
          original.headers.Authorization = `Bearer ${accessToken}`
          return axios(original).then(r => r.data)
        } catch {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          window.location.href = '/admin/login'
        }
      }
    }
    return Promise.reject(err)
  }
)

export default api
