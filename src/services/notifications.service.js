import http, { USE_MOCK, delay } from './http'
import { mockNotifications } from '@/utils/mockData'
let notifs = [...mockNotifications]
export const notificationsService = {
  async list(){ if(USE_MOCK){ await delay(150); return [...notifs] } return (await http.get('/notifications')).data },
  async markAllRead(){ if(USE_MOCK){ await delay(100); notifs = notifs.map(n=>({...n,read:true})); return notifs } return (await http.post('/notifications/read-all')).data },
}
