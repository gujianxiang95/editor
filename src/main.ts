import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ant from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
createApp(App).use(ant).use(store).use(router).mount('#app')
