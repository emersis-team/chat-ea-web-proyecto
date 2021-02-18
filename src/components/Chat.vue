<template>
  <div class="chat">
    <div class="chat-top">
      <p>
        {{
          $conversacionElegida != null
            ? $conversacionElegida.user_dest.name
            : ""
        }}
      </p>
    </div>
    <div
      id="chatScroll"
      class="chat-scroll"
      ref="chatScroll"
      @scroll="onScroll"
    >
      <div
        v-for="mensaje in mensajes"
        :key="mensaje.id"
        :id="mensaje.id"
        class="chat-container"
        v-bind:class="{ 'chat-mensaje-propio': mensaje.sender_id == userId }"
      >
      <div v-if="mensaje.fecha != null" class="chat-separador">
        <label>{{mensaje.fecha}}</label>
      </div>
      <div v-if="mensaje.fecha == null">
          <span class="chat-tail" v-if="mensaje.sender_id != userId">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 8 13"
              width="8"
              height="13"
              style="display: block;"
            >
              <path
                opacity=".13"
                fill="#0000000"
                d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z"
              />
              <path
                fill="currentColor"
                d="M1.533 2.568L8 11.193V0H2.812C1.042 0 .474 1.156 1.533 2.568z"
              />
            </svg>
          </span>
          <span class="chat-tail-out" v-if="mensaje.sender_id == userId">
            <svg
              class="chat-tail-svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 8 13"
              width="8"
              height="13"
              style="display: block;"
            >
              <path
                opacity=".13"
                d="M5.188 1H0v11.193l6.467-8.625C7.526 2.156 6.958 1 5.188 1z"
              />
              <path
                fill="currentColor"
                d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"
              />
            </svg>
          </span>
          <MensajeTexto
            v-if="
              mensaje.message_type != null &&
                mensaje.message_type.substr(11, 100) == 'TextMessage'
            "
            :mensaje="mensaje"
          ></MensajeTexto>
          <MensajeArchivo
            v-if="
              mensaje.message_type != null &&
                mensaje.message_type.substr(11, 100) == 'FileMessage' &&
                esArchivo(mensaje)
            "
            :mensaje="mensaje"
          ></MensajeArchivo>
          <MensajeImagen
            v-if="
              mensaje.message_type != null &&
                mensaje.message_type.substr(11, 100) == 'FileMessage' &&
                esImagen(mensaje)
            "
            :mensaje="mensaje"
          ></MensajeImagen>
          <MensajeVideo
            v-if="
              mensaje.message_type != null &&
                mensaje.message_type.substr(11, 100) == 'FileMessage' &&
                esVideo(mensaje)
            "
            :mensaje="mensaje"
          ></MensajeVideo>
          <MensajeAudio
            v-if="
              mensaje.message_type != null &&
                mensaje.message_type.substr(11, 100) == 'FileMessage' &&
                esAudio(mensaje)
            "
            :mensaje="mensaje"
          ></MensajeAudio>
      </div>
      </div>
    </div>
    <div class="chat-bottom">
      <div class="chat-adjuntar" title="Adjuntar" @click="adjuntar()">
        <input
          type="file"
          class="app-hide"
          @change="changeAdjunto()"
          ref="adjuntoFiles"
          multiple
        />
        <img src="../assets/img/adjuntar.png"/>
      </div>
      <input
        type="text"
        placeholder="Escribe un mensaje aquí"
        ref="inputTexto"
        v-on:keyup.enter="enviar()"
        maxlength="140"
      />
      <img class="chat-enviar" src="../assets/img/enviar.png" @click="enviar()"/>
    </div>
  </div>
</template>

<script>
import MensajeTexto from "@/components/MensajeTexto.vue";
import MensajeArchivo from "@/components/MensajeArchivo.vue";
import MensajeImagen from "@/components/MensajeImagen.vue";
import MensajeVideo from "@/components/MensajeVideo.vue";
import MensajeAudio from "@/components/MensajeAudio.vue";

export default {
  name: "Chat",
  components: {
    MensajeTexto,
    MensajeArchivo,
    MensajeImagen,
    MensajeVideo,
    MensajeAudio
  },
  data() {
    return {
      mensajes: [],
      userId: null,
      primeraPagina: true,
      currentPage: 0,
      lastPage: 0,
      mensajeOffset: null,
      actualizarTimer: null
    };
  },
  props: { conversacion: [Object] },
  computed: {},
  mounted() {
    this.userId = localStorage.getItem("$userId");
    this.getChat(null, true);
    this.actualizar();
    this.mensajes = [];
    this.$refs.chatScroll.addEventListener("touchmove", this.onScroll);
  },
  created() {
    this.$eventHub.$on("chat-get", id => this.getChat(id, true));
  },
  methods: {
    actualizar() {
      var that = this;
      clearTimeout(this.actualizarTimer);
      this.actualizarTimer = setTimeout(function() {
        that.getChat(null, false);
        that.actualizar();
      }, 3000);
    },
    esImagen(mensaje) {
      var extension = mensaje.message.files[0].file.split(".")[mensaje.message.files[0].file.split(".").length-1].toLowerCase();
      if (
        extension == "png" ||
        extension == "jpg" ||
        extension == "svg" ||
        extension == "jpeg"
      ) {
        return true;
      } else {
        return false;
      }
    },
    esVideo(mensaje) {
      var extension = mensaje.message.files[0].file.split(".")[mensaje.message.files[0].file.split(".").length-1].toLowerCase();
      if (
        extension == "webm" ||
        extension == "mkv" ||
        extension == "flv" ||
        extension == "mp4" ||
        extension == "mov" ||
        extension == "avi"
      ) {
        return true;
      } else {
        return false;
      }
    },
    esAudio(mensaje) {
      var extension = mensaje.message.files[0].file.split(".")[mensaje.message.files[0].file.split(".").length-1].toLowerCase();
      if (extension == "m4a" || extension == "qt" || extension == "4mb") {
        return true;
      } else {
        return false;
      }
    },
    esArchivo(mensaje) {
      if (
        this.esImagen(mensaje) == false &&
        this.esVideo(mensaje) == false &&
        this.esAudio(mensaje) == false
      ) {
        return true;
      } else {
        return false;
      }
    },
    getChat(id, scroll) {
      if (id == null) {
        id = this.conversacion.id;
      } else {
        this.mensajes = [];
        this.primeraPagina = true;
      }
      var that = this;
      this.$axios
        .get(this.$localurl + "/api/v1/messages/" + id)
        .then(function(response) {
          if (
            that.primeraPagina == true &&
            !that.isOverflown(document.getElementById("chatScroll"))
          ) {
            that.primeraPagina = false;
            that.getChatPage(2);
          }
          var scrollear = false;
          that.lastPage = response.data.messages.last_page;
          response.data.messages.data.reverse();
          response.data.messages.data.forEach(m => {
            if (
              !that.mensajes.some(mensaje => mensaje.id == m.id) &&
              m.conversation_id == that.conversacion.id
            ) {
              that.mensajes.push(m);
              scrollear = true;
            }
          });
          if (scrollear == true) {
            that.mensajeOffset = that.mensajes[that.mensajes.length - 1];
          }
          that.getSeparadores(scroll);
        })
        .catch(function(response) {
          clearTimeout(that.actualizarTimer);
          if (response != null && response.response.status == 401) {
            localStorage.removeItem("$expire");
            if(window.location.pathname.split("/").reverse()[0] != "login"){
              that.$router.push("/login");
            }
          }
        });
    },
    getChatPage(pagina) {
      this.mensajeOffset = this.mensajes[0];
      if(this.mensajeOffset != null && this.mensajeOffset.id == null){
        this.mensajeOffset = this.mensajes[1];
      }
      this.currentPage = pagina;
      var pag = "";
      if (pagina != null) {
        pag = "?page=" + pagina;
      }
      var that = this;
      this.$axios
        .get(this.$localurl + "/api/v1/messages/" + this.conversacion.id + pag)
        .then(function(response) {
          response.data.messages.data.reverse();
          that.mensajes = response.data.messages.data.concat(that.mensajes);
          that.getSeparadores(true);
        })
        .catch(function(response) {
          if (response != null && response.response.status == 401) {
            localStorage.removeItem("$expire");
            if(window.location.pathname.split("/").reverse()[0] != "login"){
              that.$router.push("/login");
            }
          }
        });
    },
    getSeparadores(scrollear){
      var fechas = [];
      this.mensajes = this.mensajes.filter(m => m.fecha == null);
      var cantidad = this.mensajes.length;
      for (var i = 0; i < cantidad; i++) {
        var m = this.mensajes[i];
        if(m.created_at != null){
          var d = new Date(m.created_at);
          d.setHours(d.getHours()+3);
          let day = d.getDate();
          let month = d.getMonth()+1;
          let year = d.getFullYear();
          let fecha = day+"/"+month+"/"+year;
          var today = new Date();
          let todayday = today.getDate();
          let todaymonth = today.getMonth()+1;
          let todayyear = today.getFullYear();
          if(day != todayday || month != todaymonth || year != todayyear){
            if(fechas.includes(fecha) == false){
              var days = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
              fecha = days[d.getDay()] + " " + fecha;
              if(!this.mensajes.some(m => m.fecha == fecha)){
                this.mensajes.splice(i, 0, {fecha: fecha});
                cantidad++;
                }
            }
          }else{
            if(!this.mensajes.some(m => m.fecha == "HOY")){
              this.mensajes.splice(i, 0, {fecha: "HOY"});
              cantidad++;
            }
          }
        }
      }
      if(scrollear == true){
        var that = this;
        this.$nextTick(() => {
          that.scrollToBottom();
        });
      }
    },
    onScroll() {
      var target = this.$refs.chatScroll;
      if (target.scrollTop < target.clientHeight * 0.1) {
        if (this.currentPage < this.lastPage) {
          this.offset = this.offset + this.limit;
          this.currentPage++;
          this.getChatPage(this.currentPage);
        }
      }
    },
    scrollToBottom() {
      var that = this;
      this.$nextTick(() => {
        if (that.mensajeOffset != null) {
          if(document.getElementById(that.mensajeOffset.id) != null){
            document.getElementById(
              "chatScroll"
            ).scrollTop = document.getElementById(
              that.mensajeOffset.id
            ).offsetTop;
          }else{
             setTimeout(function(){
              that.scrollToBottom();
            }, 200);
          }
        }
      });
    },
    enviar() {
      this.scrollToBottom();
      var texto = this.$refs.inputTexto.value;
      if (texto != "") {
        this.$refs.inputTexto.value = "";
        var data = new FormData();
        data.append("message", texto);
        data.append("receiver_id", this.conversacion.user_dest.id);
        var that = this;
        this.$axios
          .post(this.$localurl + "/api/v1/messages/textMessage", data)
          .then(function() {
            that.getChat(null, true);
          })
          .catch(function(response) {
            if (response != null && response.response.status == 401) {
              localStorage.removeItem("$expire");
              if(window.location.pathname.split("/").reverse()[0] != "login"){
              that.$router.push("/login");
            }
            }
            alert("Se produjo un error, reintente");
          });
      }
    },
    isOverflown(element) {
      return (
        element.scrollHeight > element.clientHeight ||
        element.scrollWidth > element.clientWidth
      );
    },
    adjuntar() {
      this.$refs.adjuntoFiles.click();
    },
    changeAdjunto() {
      if (this.$refs.adjuntoFiles.files.length > 0) {
        var data = new FormData();
        data.append("message", "archivos");
        data.append("receiver_id", this.conversacion.user_dest.id);

        this.$refs.adjuntoFiles.files.forEach(function(value, i) {
          data.append("file[" + i + "]", value);
        });

        var that = this;
        this.$axios
          .post(this.$localurl + "/api/v1/messages/fileMessage", data)
          .then(function() {
            that.getChat(null, true);
          })
          .catch(function(response) {
            if (response != null && response.response.status == 401) {
              localStorage.removeItem("$expire");
              if(window.location.pathname.split("/").reverse()[0] != "login"){
              that.$router.push("/login");
            }
            }
            var string = "";
            response.response.data.errors["file.0"].forEach(
              e => (string = string + e + ", ")
            );
            string = string.substr(0, string.length - 3);
            console.log(string);
            alert(string);
          });
      }
    }
  }
};
</script>

<style scoped src="../assets/css/components/chat.css"></style>
