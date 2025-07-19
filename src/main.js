import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initMockData } from './utils/mockData'

// 初始化模拟数据
initMockData()

const app = createApp(App)
app.use(router)
app.mount('#app')
