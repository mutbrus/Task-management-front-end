import http, { USE_MOCK, delay } from './http'
import { unwrap } from './apiAdapter'
export const commentsService = {
  async list(taskId) { if(USE_MOCK){ await delay(100); return [] } return unwrap(await http.get(`/tasks/${taskId}/comments`)) },
  async add(taskId, text, userId='u1') { if(USE_MOCK){ await delay(200); return { id:'c'+Date.now(), user:userId, text, at:new Date().toISOString().slice(0,10) } } return unwrap(await http.post(`/tasks/${taskId}/comments`,{content:text})) },
}
