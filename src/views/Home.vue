<template>
  <div class="home">
    <div class="home-body">
      <div class="home-left">
        <input
          class="home-buscar"
          type="text"
          placeholder="Buscar"
          @keyup="buscar()"
          ref="inputBuscar"
        />
        <div class="home-left-conversaciones">
          <div
            v-for="conversacion in conversacionesFiltradas"
            :key="conversacion.id"
            @click="elegirConversacion(conversacion)"
            v-bind:class="{
              'home-conversacion-elegida': conversacion == conversacionElegida
            }"
          >
            <Conversacion :conversacion="conversacion"></Conversacion>
          </div>
        </div>
        <button class="home-logout" @click="logout()">Cerrar sesión</button>
      </div>
      <div class="home-right" v-show="!$isMobile">
        <Chat
          v-if="conversacionElegida != null"
          :conversacion="conversacionElegida"
        ></Chat>
      </div>
    </div>
  </div>
</template>

<script>
import Conversacion from "@/components/Conversacion.vue";
import Chat from "@/components/Chat.vue";
import Vue from "vue";
import Echo from "laravel-echo";

window.Pusher = require("pusher-js");

export default {
  name: "Home",
  components: {
    Conversacion,
    Chat
  },
  data() {
    return {
      conversacionElegida: null,
      conversacionesFiltradas: [],
      conversaciones: [],
      mensajes: []
    };
  },
  mounted() {
    if (this.$isMobile) {
      this.mostrarChat = false;
    }
    this.getConversaciones();

    window.Echo = new Echo({
      broadcaster: "pusher",
      key: "ASDASD2121",
      wsHost: "chat-ea-web-sockets-back.casya.com.ar",
      wsPort: 6001,
      disableStats: true
    });
    window.Echo.channel("home").listen("NewMessage", (e) => {
      console.log(e);
    });
  },
  methods: {
    getConversaciones() {
      var that = this;
      this.$axios
        .get(this.$localurl + "/api/v1/messages")
        .then(function(response) {
          that.conversaciones = response.data.conversations;
          that.conversacionesFiltradas = that.conversaciones;
        })
        .catch(function(response) {
          if (response.response.status == 401) {
            localStorage.removeItem("$expire");
            if(window.location.pathname.split("/").reverse()[0] != "login"){
              that.$router.push("/login");
            }
          }
        });
    },
    buscar() {
      var inputBuscar = this.$refs.inputBuscar.value.toUpperCase();
      this.conversacionesFiltradas = this.conversaciones.filter(
        c =>
          c.user_dest.name.toUpperCase().indexOf(inputBuscar) > -1 ||
          c.user_dest.email.toUpperCase().indexOf(inputBuscar) > -1
      );
    },
    elegirConversacion(conversacion) {
      if (this.$isMobile) {
        this.$router.push(
          "/chat/" + conversacion.id + "/" + conversacion.user_dest.id
        );
      }
      this.conversacionElegida = conversacion;
      Vue.prototype.$conversacionElegida = conversacion;

      this.$eventHub.$emit("chat-get", conversacion.id);
    },
    logout() {
      var that = this;
      this.$axios
        .post(this.$localurl + "/api/v1/auth/logout")
        .then(function() {
          localStorage.removeItem("$token");
          localStorage.removeItem("$userId");
          localStorage.removeItem("$expire");
          if(window.location.pathname.split("/").reverse()[0] != "login"){
              that.$router.push("/login");
            }
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        });
    }
  }
};
</script>

<style scoped src="../assets/css/views/home.css"></style>
