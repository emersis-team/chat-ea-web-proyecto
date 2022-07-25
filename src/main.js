import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import "./registerServiceWorker";

Vue.config.productionTip = false;

Vue.prototype.$eventHub = new Vue(); // Global event bus
Vue.prototype.$axios = axios;

Vue.prototype.$localurl = process.env.VUE_APP_SERVER_URL;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
