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
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import VueApexCharts from "vue3-apexcharts";


const app = createApp(App);
const pinia = createPinia();
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

const globalOptions = {
  mode: "auto",
};

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';


library.add(fas, far);
app.component("QuillEditor", QuillEditor);
app.component('font-awesome-icon', FontAwesomeIcon);
app.component("apexchart", VueApexCharts);

app.use(VueApexCharts);
app.use(VueTelInput, globalOptions);
pinia.use(piniaPluginPersistedstate);
app.use(ElementPlus);
app.use(VueQueryPlugin);
app.use(router);
app.use(pinia);
app.mount("#app");
