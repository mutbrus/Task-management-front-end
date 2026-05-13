import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { useUiStore } from './stores/ui'

const app = createApp(App)
app.use(createPinia())
app.use(router)
useUiStore().initTheme()
app.mount('#app')
