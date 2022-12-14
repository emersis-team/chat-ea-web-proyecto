<template>
  <div class="form">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :is-full-page="fullPage"
    ></loading>
    <div class="row">
      <label class="label">Usuario</label>
      <input
        class="input"
        type="text"
        placeholder="Escribe tu usuario aquí"
        ref="loginUser"
        v-bind:class="{ 'error-input': errorUsuario }"
      />
    </div>
    <div class="row">
      <label class="label">Contraseña</label>
      <input
        class="input"
        type="password"
        ref="loginPassword"
        v-on:keyup.enter="login()"
        v-bind:class="{ 'error-input': errorPassword }"
      />
      <img
        class="input-ojo"
        src="../assets/img/ojo.png"
        v-show="!mostrarOjoActivo"
        @click="changePasswordType('text')"
      />
      <img
        class="input-ojo"
        src="../assets/img/ojo-active.png"
        v-show="mostrarOjoActivo"
        @click="changePasswordType('password')"
      />
    </div>
    <button class="btn" @click="login()">Ingresar</button>
  </div>
</template>

<script>
const NOT_FOUND_USER = 404;
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
export default {
  name: "login",
  components: {
    Loading,
  },
  data() {
    return {
      mostrarOjoActivo: false,
      errorUsuario: false,
      errorPassword: false,
      isLoading: false,
      fullPage: true,
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
        this.isLoading = true;
        var that = this;
        this.$axios
          .post(this.$localurl + "/auth/login", {
            email: username,
            password: password,
          })
          .then(function (response) {
            localStorage.setItem("$userId", response.data.id);
            localStorage.setItem("$username", response.data.name);
            localStorage.setItem("$email", response.data.email);
            localStorage.setItem("$token", response.data.token);
            localStorage.setItem("$admin", response.data.isAdmin);
            localStorage.setItem("$dni", response.data.dni);
            localStorage.setItem("$lastname", response.data.lastname);
            localStorage.setItem("$organization", response.data.organization);
            that.isLoading = false;
            that.$router.push("/");
          })
          .catch(function ({ response }) {
            if (response.status === NOT_FOUND_USER) {
              that.$router.push({
                name: "complete",
                params: { email: username },
              });
              /* return; */
            } else {
              that.$router.push("/login");
            }
            that.isLoading = false;
            that.errorUsuario = true;
            that.errorPassword = true;
          });
      }
    },
  },
};
</script>

<style>
@import "../assets/css/views/forms.css";
</style>
