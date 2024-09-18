import './assets/base.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'

const app = createApp(App, {
  currentYear: new Date().getFullYear(),
  // lastYearOnSeriesA: 2024
  lastYearOnSeriesA: 1985
})

app.use(createPinia())

app.mount('#app')
