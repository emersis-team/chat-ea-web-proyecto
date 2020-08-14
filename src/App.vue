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
    return {};
  },
  components: { Snackbar },
  created() {
    Vue.prototype.$localurl = "https://emersis.casya.com.ar";
    this.$axios.defaults.headers.common["Authorization"] =
      "Bearer " + localStorage.getItem("$token");
    if (localStorage.getItem("$token") == null) {
      this.$router.push("/login");
    }
    Vue.prototype.$isMobile = this.isMobile();
  },
  mounted() {},
  methods: {
    isMobile() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style src="@/assets/css/fonts.css"></style>
<style src="@/assets/css/transitions.css"></style>
<style src="@/assets/css/app.css"></style>
<style src="@/assets/css/error.css"></style>
<style src="@/assets/css/components/loading.css"></style>
