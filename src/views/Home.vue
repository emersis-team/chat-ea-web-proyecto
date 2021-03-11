<template>
  <div class="home">
    <div class="home-body">
      <div class="home-left">
        <div>
          <input
            class="home-buscar"
            type="text"
            placeholder="Buscar"
            @keyup="buscar()"
            ref="inputBuscar"
          />
          <img class="home-buscar-img" src="../assets/img/buscar.png" />
        </div>
        <div class="home-left-conversaciones">
          <div
            v-for="(conversacion, index) in conversacionesFiltradas"
            :key="index"
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
    this.conectarSocket();    
  },
  methods: {
    conectarSocket(){
      if(localStorage.getItem("$userId") != null){
        var that = this;
        window.Echo = new Echo({
          broadcaster: "pusher",
          key: "ASDASD2121",
          wsHost: "127.0.0.1",
          wsPort: 6001,
        // wssPort: 6001,
          disableStats: true,
          forceTLS: false,
          enabledTransports: ["ws"]
        });
        console.log("Conectando al websocket canal: " + "user."+localStorage.getItem("$userId"));
        window.Echo.channel("user."+localStorage.getItem("$userId")).listen("NewMessage", (e) => {
          console.log("Recibo mensaje por websocket");
          console.log(e);
          that.$eventHub.$emit("chat-get");
          that.getConversaciones();
        });
      }
    },
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
      conversacion.ammount_no_read = 0;
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
