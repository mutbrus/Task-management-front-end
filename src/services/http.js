import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  timeout: 15000,
})

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('tf_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

http.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401 || err.response?.data?.status === 'expired') {
      localStorage.removeItem('tf_token')
      if (!location.pathname.startsWith('/auth')) location.href = '/auth/login'
    }
    return Promise.reject(err)
  }
)

export const USE_MOCK = (import.meta.env.VITE_USE_MOCK ?? 'false') === 'true'
export const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms))
export default http
