import { createApp,ComponentCustomProperties } from 'vue'
import './style.css'
import App from './App.vue'
import ImageModel from './pages/home/image-model';
import { createPinia } from 'pinia';
const app = createApp(App);
app.use(createPinia())

app.mount('#app')