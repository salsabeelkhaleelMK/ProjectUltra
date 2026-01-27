import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { clickOutside } from '@/directives/clickOutside'
import i18n from './locales'
// Import main CSS - includes Tailwind, Motork theme, and custom styles
import './assets/css/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.directive('click-outside', clickOutside)

app.mount('#app')
