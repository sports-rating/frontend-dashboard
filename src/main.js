import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.css";
import { createPinia } from "pinia";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import router from "./router";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import VueTelInput from "vue-tel-input";
import "vue-tel-input/vue-tel-input.css";
import { VueQueryPlugin } from "@tanstack/vue-query";

const app = createApp(App);
const pinia = createPinia();
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

const globalOptions = {
  mode: "auto",
};

app.use(VueTelInput, globalOptions);
pinia.use(piniaPluginPersistedstate);
app.use(ElementPlus);
app.use(VueQueryPlugin);
app.use(router);
app.use(pinia);
app.mount("#app");
