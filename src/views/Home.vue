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
      <div class="home-right" v-show="!$isMobile">
        <Chat v-if="conversacionElegida != null" :conversacion="conversacionElegida"></Chat>
      </div>
    </div>
  </div>
</template>

<script>
import Conversacion from "@/components/Conversacion.vue";
import Chat from "@/components/Chat.vue";

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
            that.$router.push("/login");
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
      this.$eventHub.$emit("chat-get", conversacion.id);
    }
  }
};
</script>

<style scoped src="../assets/css/views/home.css"></style>
