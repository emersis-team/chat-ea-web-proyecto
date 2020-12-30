<template>
  <div class="home">
    <div class="home-body">
      <div class="home-right">
        <div class="chat">
          <div class="chat-top">
            <img @click="$router.back()" src="../assets/img/left_black.png" />
            <p @click="$router.back()">
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
              v-bind:class="{
                'chat-mensaje-propio': mensaje.sender_id == userId
              }"
            >
              <MensajeTexto
                v-if="
                  mensaje.message_type != null &&
                    mensaje.message_type.substr(11, 100) == 'TextMessage'
                "
                :mensaje="mensaje.message"
              ></MensajeTexto>
              <MensajeArchivo
                v-if="
                  mensaje.message_type != null &&
                    mensaje.message_type.substr(11, 100) == 'FileMessage' &&
                    esArchivo(mensaje)
                "
                :mensaje="mensaje.message"
              ></MensajeArchivo>
              <MensajeImagen
                v-if="
                  mensaje.message_type != null &&
                    mensaje.message_type.substr(11, 100) == 'FileMessage' &&
                    esImagen(mensaje)
                "
                :mensaje="mensaje.message"
              ></MensajeImagen>
              <MensajeVideo
                v-if="
                  mensaje.message_type != null &&
                    mensaje.message_type.substr(11, 100) == 'FileMessage' &&
                    esVideo(mensaje)
                "
                :mensaje="mensaje.message"
              ></MensajeVideo>
              <MensajeAudio
                v-if="
                  mensaje.message_type != null &&
                    mensaje.message_type.substr(11, 100) == 'FileMessage' &&
                    esAudio(mensaje)
                "
                :mensaje="mensaje.message"
              ></MensajeAudio>
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
            />
            <img class="chat-enviar" src="../assets/img/enviar.png" @click="enviar()"/>
          </div>
        </div>
      </div>
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
      mensajeOffset: null
    };
  },
  props: {},
  computed: {},
  mounted() {
    this.userId = localStorage.getItem("$userId");
    this.getChat();
    this.actualizar();
    this.mensajes = [];
    this.$refs.chatScroll.addEventListener("touchmove", this.onScroll);
  },
  created() {
    this.$eventHub.$on("chat-get", id => this.getChat(id));
  },
  methods: {
    actualizar() {
      var that = this;
      setTimeout(function() {
        that.getChat();
        that.actualizar();
      }, 3000);
    },
    esImagen(mensaje) {
      var extension = mensaje.message.files[0].file.split(".")[1].toLowerCase();
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
      var extension = mensaje.message.files[0].file.split(".")[1].toLowerCase();
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
      var extension = mensaje.message.files[0].file.split(".")[1].toLowerCase();
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
    getChat(id) {
      if (id == null) {
        id = this.$route.params.id;
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
              m.conversation_id == that.$route.params.id
            ) {
              that.mensajes.push(m);
              scrollear = true;
            }
          });
          if (scrollear == true) {
            that.mensajeOffset = that.mensajes[that.mensajes.length - 1];
            that.scrollToBottom();
          }
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
    getChatPage(pagina) {
      this.mensajeOffset = this.mensajes[0];
      this.currentPage = pagina;
      var pag = "";
      if (pagina != null) {
        pag = "?page=" + pagina;
      }
      var that = this;
      this.$axios
        .get(this.$localurl + "/api/v1/messages/" + this.$route.params.id + pag)
        .then(function(response) {
          response.data.messages.data.reverse();
          that.mensajes = response.data.messages.data.concat(that.mensajes);
          that.scrollToBottom();
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
          document.getElementById(
            "chatScroll"
          ).scrollTop = document.getElementById(
            that.mensajeOffset.id
          ).offsetTop;
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
        data.append("receiver_id", this.$route.params.user_dest_id);
        var that = this;
        this.$axios
          .post(this.$localurl + "/api/v1/messages/textMessage", data)
          .then(function() {
            that.getChat();
          })
          .catch(function(response) {
            if (response.response.status == 401) {
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
        data.append("receiver_id", this.$route.params.user_dest_id);

        this.$refs.adjuntoFiles.files.forEach(function(value, i) {
          data.append("file[" + i + "]", value);
        });

        var that = this;
        this.$axios
          .post(this.$localurl + "/api/v1/messages/fileMessage", data)
          .then(function() {
            that.getChat();
          })
          .catch(function(response) {
            if (response.response.status == 401) {
              localStorage.removeItem("$expire");
              if(window.location.pathname.split("/").reverse()[0] != "login"){
              that.$router.push("/login");
            }
            }
            alert("Se produjo un error, reintente");
          });
      }
    }
  }
};
</script>

<style scoped src="../assets/css/components/chat.css"></style>
<style scoped src="../assets/css/views/home.css"></style>
