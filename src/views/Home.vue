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
          <img class="home-buscar-img" src="../assets/img/search-26.png" />
        </div>
        <div class="home-left-conversaciones">
          <div
            v-for="(conversacion, index) in conversacionesFiltradas"
						v-if="hasConversations"
            :key="index"
            @click="elegirConversacion(conversacion)"
            v-bind:class="{
              'home-conversacion-elegida': conversacion == conversacionElegida,
            }"
          >
            <Conversacion :conversacion="conversacion"></Conversacion>
          </div>
					<div v-if="!hasConversations">
						<InfoContacts></InfoContacts>
					</div>
        </div>
        <RouterLink :to="`/admin`"
          ><img
            class="user-profile-icon"
            src="../assets/img/icono-contacto.png"
          />
        </RouterLink>
        <button class="home-logout" @click="logout()">Cerrar sesión</button>
      </div>
      <div
        class="home-right"
        :class="{ 'home-right-with-map': conversacionElegida != null }"
      >
        <Chat
          v-if="conversacionElegida != null"
          :conversacion="conversacionElegida"
          :contactos="contactos"
        ></Chat>
        <Mapa :posiciones="posiciones" :contactos="contactos"></Mapa>
      </div>
    </div>
  </div>
</template>

<script>
import Conversacion from "@/components/Conversacion.vue";
import InfoContacts from "@/components/InfoContacts.vue";
import Chat from "@/components/Chat.vue";
import Mapa from "@/components/Mapa.vue";
import Vue from "vue";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

export default {
  name: "Home",
  components: {
    Conversacion,
    Chat,
    Mapa,
		InfoContacts,
  },
  data() {
    return {
      conversacionElegida: null,
      conversacionesFiltradas: [],
      conversaciones: [],
			hasConversations: false,
      mensajes: [],
      contactos: [],
      posiciones: [],
      stompClient: null,
      count: 0,
      ultimaPosicion: null,
    };
  },
  mounted() {
    if (this.$isMobile) {
      this.mostrarChat = false;
    }
    this.getConversaciones();
    this.getContactos();
    this.getPosiciones();

    this.conectarWebSocket();
  },
  methods: {
    conectarWebSocket() {
      var socket = new SockJS(this.$localurl + "/websocket");
      this.stompClient = Stomp.over(socket);
      this.stompClient.debug = () => {};
      var that = this;
      this.stompClient.connect({}, function (frame) {
        console.log("Connected: " + frame);
        that.stompClient.subscribe(
          "/notificacion/mensaje/" + localStorage.getItem("$userId"),
          (messageOutput) => {
            console.log("nuevo mensaje");
            console.log(messageOutput);
            that.getConversaciones();
            that.$eventHub.$emit("chat-update");
          }
        );
        that.stompClient.subscribe(
          "/notificacion/posicion/" + localStorage.getItem("$userId"),
          (messageOutput) => {
            console.log("nuevo mensaje posicion");
            let body = JSON.parse(messageOutput.body);
            console.log(body);
            let array = that.posiciones.filter(
              (p) => p[0].user_id == body.user_id
            )[0];
            if (array != null) {
              array.unshift(body);
            } else {
              array = [body];
              that.posiciones.push(array);
            }
            that.$forceUpdate();
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
      let userId = localStorage.getItem("$userId");

      var that = this;
      this.$axios
        .get(this.$localurl + "/api/" + userId + "/conversations/")
        .then(function (response) {
          that.conversaciones = response.data.conversations;
          that.conversacionesFiltradas = that.conversaciones;
					that.hasConversations = true;
        })
        .catch(function (response) {
					that.hasConversations = false;
					debugger;
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
    getContactos() {
      var that = this;
      this.$axios
        .get(this.$localurl + "/api/usuarios")
        .then(function (response) {
          that.contactos = response.data;
        })
        .catch(function (response) {
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
        (c) =>
          c.user_dest.name.toUpperCase().indexOf(inputBuscar) > -1 ||
          c.user_dest.email.toUpperCase().indexOf(inputBuscar) > -1
      );
    },
    elegirConversacion(conversacion) {
      if (conversacion != this.conversacionElegida) {
        conversacion.ammount_no_read = 0;
        conversacion.conversacionElegida = true;
        this.conversacionElegida = conversacion;
        Vue.prototype.$conversacionElegida = conversacion;

        this.$eventHub.$emit("chat-get", conversacion.conversation_id);

        let that = this;
        let cantidad = 0;
        let lat = 0;
        let lon = 0;
        conversacion.conversation_members.forEach((member) => {
          if (that.getLastPositon(member) != null) {
            lat = lat + parseFloat(that.getLastPositon(member)[0].lat);
            lon = lon + parseFloat(that.getLastPositon(member)[0].lon);
            cantidad++;
          }
        });
        if (cantidad != 0) {
          lat = lat / cantidad;
          lon = lon / cantidad;
          this.$eventHub.$emit("map-center", [
            parseFloat(lat),
            parseFloat(lon),
          ]);
        } else {
          this.$eventHub.$emit("map-center-propia");
        }
      } else {
        Vue.prototype.$conversacionElegida = null;
        this.conversacionElegida = null;
        this.$eventHub.$emit("map-center-propia");
      }
    },
    logout() {
      localStorage.removeItem("$token");
      localStorage.removeItem("$userId");
      localStorage.removeItem("$expire");
      if (window.location.pathname.split("/").reverse()[0] != "login") {
        this.$router.push("/login");
      }
    },
    getPosiciones() {
      var that = this;
      this.$axios
        .get(
          this.$localurl +
            "/api/position/" +
            localStorage.getItem("$userId") +
            "/user_contacts_positions"
        )
        .then(function (response) {
          that.posiciones = response.data.user_contacts_positions;
          if (
            response.data.user_positions != null &&
            response.data.user_positions.length > 0
          ) {
            that.ultimaPosicion = {
              coords: {
                latitude: response.data.user_positions[0].lat,
                longitude: response.data.user_positions[0].lon,
                altitude: response.data.user_positions[0].alt,
              },
            };
          }
          that.watchCurrentPosition();
          console.log(response.data);
        })
        .catch(function (response) {
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
    getLastPositon(member) {
      return this.posiciones.filter((p) => p[0].user_id == member.user_id)[0];
    },
    watchCurrentPosition() {
      var that = this;
      navigator.geolocation.watchPosition(function (position) {
        if (
          that.ultimaPosicion == null ||
          that.calcCrow(
            that.ultimaPosicion.coords.latitude,
            that.ultimaPosicion.coords.longitude,
            position.coords.latitude,
            position.coords.longitude
          ) > 100
        ) {
          that.ultimaPosicion = position;
          that.reportarUbicacion(position);
        }
      });
    },
    reportarUbicacion(position) {
      console.log("reporto ubicacion: " + position);
      let json = {
        user_id: localStorage.getItem("$userId"),
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        alt: position.coords.altitude != null ? position.coords.altitude : 0,
      };
      this.$axios
        .post(this.$localurl + "/api/position/user_position", json)
        .then(function (response) {
          console.log(response);
        })
        .catch(function (response) {
          console.log(response);
        });
    },
    calcCrow(lat1, lon1, lat2, lon2) {
      var R = 6371; // km
      var dLat = this.toRad(lat2 - lat1);
      var dLon = this.toRad(lon2 - lon1);
      lat1 = this.toRad(lat1);
      lat2 = this.toRad(lat2);

      var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) *
          Math.sin(dLon / 2) *
          Math.cos(lat1) *
          Math.cos(lat2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c;
      return d * 1000;
    },
    toRad(Value) {
      return (Value * Math.PI) / 180;
    },
  },
};
</script>

<style scoped src="../assets/css/views/home.css"></style>
