import 'primeicons/primeicons.css';
import "@/styles/global.css";
import { createApp } from "vue";
import { createPinia } from "pinia";
import PrimeVue from 'primevue/config';
import App from "./App.vue";
import { router } from "./router";


const pinia = createPinia();

createApp(App)
  .use(router)
  .use(pinia)
  .use(PrimeVue, {
    unstyled: true, 
  })
  .mount("#app");
