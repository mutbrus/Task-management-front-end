import http, { USE_MOCK, delay } from './http'
import { unwrap, mapUser } from './apiAdapter'

export const authService = {
  async login(email, password) {
    if (USE_MOCK) { await delay(); return { token: 'mock-jwt-token', user: { id:'u1', name: email.split('@')[0]||'Alex', email, avatar: 'AM' } } }
    const data = unwrap(await http.post('/auth/login', { email, password }))
    return { token: data.token, user: mapUser(data.user) }
  },
  async register(payload) {
    if (USE_MOCK) { await delay(); return { token: 'mock-jwt-token', user: { id:'u1', name: payload.name, email: payload.email, avatar: payload.name.slice(0,2).toUpperCase() } } }
    const data = unwrap(await http.post('/auth/register', payload))
    return { token: data.token, user: mapUser(data.user) }
  },
  async forgotPassword(email) {
    if (USE_MOCK) { await delay(); return { ok: true } }
    return { ok: true, email }
  },
  async me() {
    if (USE_MOCK) { await delay(200); return { id:'u1', name:'Alex Morgan', email:'alex@taskflow.app', avatar:'AM' } }
    return mapUser(unwrap(await http.get('/auth/me')))
  },
}
