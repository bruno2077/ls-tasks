import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import { createPinia } from 'pinia'
import './style.styl'

const pinia = createPinia()

createApp(App).use(router).use(pinia).mount('#app')