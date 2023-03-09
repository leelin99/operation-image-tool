import { createApp,ComponentCustomProperties } from 'vue'
import './style.css'
import App from './App.vue'
import ImageModel from './pages/home/image-model';
import { createPinia } from 'pinia';
import { Lazyload } from 'vant';
import 'lib-flexible/flexible.js'
const app = createApp(App);
app.use(Lazyload, {
  lazyComponent: true,
});
app.use(createPinia())
app.mount('#app')