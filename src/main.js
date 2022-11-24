import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import "./registerServiceWorker";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import {
  faExpand,
  faCompress,
  faVideo,
  faVideoSlash,
  faMicrophone,
  faMicrophoneSlash,
  faDisplay,
} from "@fortawesome/free-solid-svg-icons";

library.add(
  faExpand,
  faCompress,
  faVideo,
  faVideoSlash,
  faMicrophone,
  faMicrophoneSlash,
  faDisplay
);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.prototype.$eventHub = new Vue(); // Global event bus
Vue.prototype.$axios = axios;

Vue.prototype.$localurl = process.env.VUE_APP_SERVER_URL;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
