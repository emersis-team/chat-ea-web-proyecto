<template>
  <div class="login">
    <div class="login-row">
      <label class="login-label">Usuario</label>
      <input
        class="login-input"
        type="text"
        placeholder="Escribe tu usuario aquí"
        ref="loginUser"
        v-bind:class="{ 'error-input': errorUsuario }"
      >
    </div>
    <div class="login-row">
      <label class="login-label">Contraseña</label>
      <input
        class="login-input"
        type="password"
        ref="loginPassword"
        v-on:keyup.enter="login()"
        v-bind:class="{ 'error-input': errorPassword }"
      >
      <img
        class="login-input-ojo"
        src="../assets/img/ojo.png"
        v-show="!mostrarOjoActivo"
        @click="changePasswordType('text')"
      >
      <img
        class="login-input-ojo"
        src="../assets/img/ojo-active.png"
        v-show="mostrarOjoActivo"
        @click="changePasswordType('password')"
      >
    </div>
    <button class="login-btn" @click="login()">Ingresar</button>
  </div>
</template>

<script>
export default {
  name: "login",
  components: {},
  data() {
    return {
      mostrarOjoActivo: false,
      errorUsuario: false,
      errorPassword: false
    };
  },
  created() {},
  mounted() {
    if (
      localStorage.getItem("$expire") != null &&
      localStorage.getItem("$expire") < Date.now()
    ) {
      this.$router.push("/");
    }
  },
  methods: {
    changePasswordType(tipo) {
      if (tipo == "text") {
        this.mostrarOjoActivo = true;
      } else {
        this.mostrarOjoActivo = false;
      }
      this.$refs.loginPassword.type = tipo;
    },
    login() {
      var guardar = true;

      var username = this.$refs.loginUser.value;
      var password = this.$refs.loginPassword.value;

      if (username == "") {
        guardar = false;
        this.errorUsuario = true;
      } else {
        this.errorUsuario = false;
      }
      if (password == "") {
        guardar = false;
        this.errorPassword = true;
      } else {
        this.errorPassword = false;
      }
      if (guardar == true) {
        var that = this;
        this.$axios
          .post(this.$localurl + "/api/auth/login", {
            email: username,
            password: password
          })
          .then(function(response) {
            localStorage.setItem("$token", response.data.token);
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
  }
};
</script>

<style>
@import "../assets/css/views/login.css";
</style>
