import http, { USE_MOCK, delay } from './http'
import { mockUsers } from '@/utils/mockData'
import { unwrap, mapUser } from './apiAdapter'
let users = [...mockUsers]
export const usersService = {
  async list() {
    if(USE_MOCK){ await delay(); return [...users] }
    const data = unwrap(await http.get('/admin/users/getList', { params: { size: 100 } }))
    const rows = data?.data_items || data?.data || data || []
    return rows.map(mapUser)
  },
  async invite(email) {
    if(USE_MOCK){ await delay(); const u={id:'u'+Date.now(),name:email.split('@')[0],email,avatar:email.slice(0,2).toUpperCase(),role:'Member'}; users.push(u); return u }
    const payload = { single_id: 1, full_name: email.split('@')[0], email, user_role: 'user' }
    const data = unwrap(await http.post('/admin/users/create', payload))
    return { id: data.user_id || data.hash, hash: data.hash, name: payload.full_name, email, role: 'Member', avatar: email.slice(0,2).toUpperCase() }
  },
}
