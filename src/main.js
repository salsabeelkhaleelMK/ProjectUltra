import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { clickOutside } from '@/directives/clickOutside'
// Import component library CSS first (before custom styles)
// Import using direct path since it's not exported in package.json exports field
import '../node_modules/@motork/component-library/dist/component-library.css'
import './style.css'
import './styles/theme.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.directive('click-outside', clickOutside)

app.mount('#app')
