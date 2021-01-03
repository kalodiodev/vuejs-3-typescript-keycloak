import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { Authentication } from './auth'
import './index.css'

const auth = new Authentication()
auth.init()

createApp(App, { auth: auth }).use(router).mount('#app')
