import { createApp,ComponentCustomProperties } from 'vue'
import './style.css'
import App from './App.vue'
import ImageModel from './pages/home/image-model';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus'
import 'lib-flexible/flexible.js'
import 'element-plus/dist/index.css'
const app = createApp(App);
app.use(createPinia())
app.mount('#app')