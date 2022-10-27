<template>
  <div class="form">
    <div class="row">
      <label class="label">Usuario</label>
      <input
        class="input"
        type="text"
        placeholder="Escribe tu usuario aquí"
        ref="loginUser"
        v-bind:class="{ 'error-input': errorUsuario }"
      >
    </div>
    <div class="row">
      <label class="label">Contraseña</label>
      <input
        class="input"
        type="password"
        ref="loginPassword"
        v-on:keyup.enter="login()"
        v-bind:class="{ 'error-input': errorPassword }"
      >
      <img
        class="input-ojo"
        src="../assets/img/ojo.png"
        v-show="!mostrarOjoActivo"
        @click="changePasswordType('text')"
      >
      <img
        class="input-ojo"
        src="../assets/img/ojo-active.png"
        v-show="mostrarOjoActivo"
        @click="changePasswordType('password')"
      >
    </div>
    <button class="btn" @click="login()">Ingresar</button>
  </div>
</template>

<script>
const NOT_FOUND_USER = 404;

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

      if (username === "") {
        guardar = false;
        this.errorUsuario = true;
      } else {
        this.errorUsuario = false;
      }

      if (password === "") {
        guardar = false;
        this.errorPassword = true;
      } else {
        this.errorPassword = false;
      }

      if (guardar === true) {
        var that = this;
        this.$axios
          .post(this.$localurl + "/api/auth/login", {
            email: username,
            password: password
          })
          .then(function(response) {
            localStorage.setItem("$userId", response.data.id);
            localStorage.setItem("$username", response.data.name);

            that.$router.push("/");
          })
          .catch(function({ response }) {
						if(response.status === NOT_FOUND_USER) {
							that.$router.push({ name: "complete", params: { email: username } });
							return;
						}

            that.errorUsuario = true;
            that.errorPassword = true;
          });
      }
    }
  }
};
</script>

<style>
@import "../assets/css/views/forms.css";
</style>
