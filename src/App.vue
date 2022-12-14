<template>
  <div id="app">
    <Snackbar></Snackbar>
    <router-view />
  </div>
</template>

<script>
import Vue from "vue";
import Snackbar from "@/components/Snackbar.vue";

export default {
  data() {
    return {
      deferredPrompt: null,
    };
  },
  components: { Snackbar },
  created() {
    //Vue.prototype.$localurl = "http://10.120.17.157:8080";

    Vue.prototype.$localurl = "http://localhost:8081";
    Vue.prototype.$roomurl = "https://localhost:5000";

    //Vue.prototype.$localurl = "https://chatea-api-front-2.nahuelde.repl.co";
    //Vue.prototype.$roomurl = "https://38.109.228.250:8080";

    this.$axios.defaults.headers.common["Authorization"] =
      localStorage.getItem("$token");

    /* if (localStorage.getItem("$token") == null) {
      this.$router.push("/login");
    } */
    Vue.prototype.$isMobile = this.isMobile();

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
    });
    window.addEventListener("appinstalled", () => {
      this.deferredPrompt = null;
    });
  },
  mounted() {},
  methods: {
    async dismiss() {
      this.deferredPrompt = null;
    },
    async install() {
      this.deferredPrompt.prompt();
    },
    isMobile() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        if (screen.width > 500) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    },
  },
};
</script>

<style src="@/assets/css/fonts.css"></style>
<style src="@/assets/css/transitions.css"></style>
<style src="@/assets/css/app.css"></style>
<style src="@/assets/css/error.css"></style>
<style src="@/assets/css/components/loading.css"></style>
