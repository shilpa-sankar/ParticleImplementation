import { createApp } from 'vue'
import { createPinia } from 'pinia';
import './style.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia(); // Create the Pinia store
app.use(pinia); 
app.mount('#app')
