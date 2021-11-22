<template>
  <div class="token">
  </div>
</template>

<script>
export default {
  name: "token",
  components: {},
  data() {
    return {

    };
  },
  created() {},
  mounted() {
    localStorage.setItem("$token", this.$route.params.token);
    localStorage.setItem("$expire", Date.now() + 604800000);
    this.$axios.defaults.headers.common["Authorization"] =
              "Bearer " + localStorage.getItem("$token");
    this.getUsuario();
  },
  methods: {
    getUsuario() {
      var that = this;
      this.$axios
        .post(this.$localurl + "/api/user/")
        .then(function(response) {
          localStorage.setItem("$userId", response.data.id);
          localStorage.setItem(
            "$expire",
            Date.now() + response.data.expires_in
          );
          that.$axios.defaults.headers.common["Authorization"] =
            "Bearer " + localStorage.getItem("$token");
          that.$eventHub.$emit("loged");
          that.$router.push("/");
        })
        .catch(function(response) {
          console.log(response);
          that.errorUsuario = true;
          that.errorPassword = true;
        });
    }
  }
};
</script>

<style>
@import "../assets/css/views/login.css";
</style>
