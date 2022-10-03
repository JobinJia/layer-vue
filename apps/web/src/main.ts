import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import UI from 'ui'

// import './assets/main.css'
import 'ui/theme/default/layer.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(UI)

app.mount('#app')
