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
      mensajes: [],
      eventSource: null
    };
  },
  mounted() {
    if (this.$isMobile) {
      this.mostrarChat = false;
    }
    this.getConversaciones();
    this.conectarSSE();
    // this.$eventHub.$on("home-desconectar-socket", this.desconectarSSE());
  },
  methods: {
    conectarSSE() {
      if(localStorage.getItem("$userId") != null){
        console.log("Conectando al sse");
        var that = this;
        this.eventSource = new EventSource('http://127.0.0.1:8000/api/v1/openStreamedResponse');
        this.eventSource.onopen = () => {
          console.log("connection opened");
        }
        this.eventSource.onmessage = (event) => {
          console.log("result", event.data);
          that.$eventHub.$emit("chat-get");
          that.getConversaciones();
        }
        this.eventSource.onerror = (event) => {
          console.log("onerror: "+event.target.readyState)
          if (event.target.readyState === EventSource.CLOSED) {
            console.log('eventsource closed (' + event.target.readyState + ')')
          }
        }     
      }
    },
    desconectarSSE(){
      if(this.eventSource != null){
        console.log("Desconecto SSE");
        this.eventSource.close();
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
          if (response.response != null && response.response.status == 401) {
            localStorage.removeItem("$expire");
            localStorage.removeItem("$userId");
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
          that.desconectarSSE();
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
