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
          >
          <img class="home-buscar-img" src="../assets/img/buscar.png">
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
        <Chat v-if="conversacionElegida != null" :conversacion="conversacionElegida"></Chat>
      </div>
    </div>
  </div>
</template>

<script>
import Conversacion from "@/components/Conversacion.vue";
import Chat from "@/components/Chat.vue";
import Vue from "vue";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

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
      mensajes: [],
      stompClient: null,
      count: 0
    };
  },
  mounted() {
    if (this.$isMobile) {
      this.mostrarChat = false;
    }
    this.getConversaciones();

    this.conectarWebSocket();
  },
  methods: {
    conectarWebSocket() {
      var socket = new SockJS(this.$localurl + "/websocket");
      this.stompClient = Stomp.over(socket);
      this.stompClient.debug = () => {};
      var that = this;
      this.stompClient.connect({}, function(frame) {
        console.log("Connected: " + frame);
        that.stompClient.subscribe(
          "/notificacion/mensaje/" + localStorage.getItem("$userId"),
          messageOutput => {
            console.log("subscribe");
            console.log(messageOutput);
            that.getConversaciones();
            that.$eventHub.$emit("chat-update");
          }
        );
      });
    },
    desconectarWebSocket() {
      if (this.stompClient != null) {
        this.stompClient.disconnect();
      }
      console.log("Disconnected");
    },
    sendMessage(from, text) {
      console.log("sendMessage");
      var json = { from: from, text: text.toString() };
      this.stompClient.send("/app/chat", JSON.stringify(json), {});
    },
    showMessageOutput(messageOutput) {
      console.log("showMessageOutput");
      console.log(messageOutput);
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
          if (
            response != null &&
            (response.response.status == 401 || response.response.status == 400)
          ) {
            localStorage.removeItem("$expire");
            if (window.location.pathname.split("/").reverse()[0] != "login") {
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
          if (window.location.pathname.split("/").reverse()[0] != "login") {
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
