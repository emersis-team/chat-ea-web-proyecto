<template>
  <div class="chat">
    <div id="chatScroll" class="chat-scroll" ref="chatScroll" @scroll="onScroll">
      <div
        v-for="mensaje in mensajes"
        :key="mensaje.id"
        :id="mensaje.id"
        class="chat-container"
        v-bind:class="{ 'chat-mensaje-propio': mensaje.sender_id == userId }"
      >
        <div class="chat-mensaje">
          <label v-show="message_type.substr(11,100) == 'TextMessage'">{{ mensaje.message.text }}</label>
          <div
            v-show="message_type.substr(11,100) == 'FileMessage'"
            v-for="file in mensaje.message.files"
            :key="file.id"
          >
            <label>{{file.original_file}}</label>
            <p>Descargar</p>
          </div>
        </div>
      </div>
    </div>

    <div class="chat-bottom">
      <input
        type="text"
        placeholder="Escribe un mensaje aquí"
        ref="inputTexto"
        v-on:keyup.enter="enviar()"
      />
      <button class="chat-enviar" @click="enviar()">Enviar</button>
    </div>
  </div>
</template>

<script>
export default {
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
  props: { conversacion: [Object] },
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
    getChat(id) {
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
            that.scrollToBottom();
          }
        })
        .catch(function(response) {
          if (response.response.status == 401) {
            that.$router.push("/login");
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
        .get(this.$localurl + "/api/v1/messages/" + this.conversacion.id + pag)
        .then(function(response) {
          response.data.messages.data.reverse();
          that.mensajes = response.data.messages.data.concat(that.mensajes);
          that.scrollToBottom();
        })
        .catch(function(response) {
          if (response.response.status == 401) {
            that.$router.push("/login");
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
        document.getElementById(
          "chatScroll"
        ).scrollTop = document.getElementById(that.mensajeOffset.id).offsetTop;
        // var elem = document.getElementById("chatScroll");
        // velocity(elem, "scroll", {
        //   container: document.getElementById("chatScroll"),
        //   duration: 10,
        //   offset: that.mensajeOffset.offsetTop,
        // });
      });
    },
    enviar() {
      this.scrollToBottom();
      var texto = this.$refs.inputTexto.value;
      if (texto != "") {
        // this.mensajes.push({
        //   id: 0,
        //   sender_id: this.userId,
        //   message: texto
        // });
        this.$refs.inputTexto.value = "";
        var data = new FormData();
        data.append("message", texto);
        data.append("receiver_id", this.conversacion.user_dest.id);
        var that = this;
        this.$axios
          .post(this.$localurl + "/api/v1/messages", data)
          .then(function() {
            that.getChat();
          })
          .catch(function(response) {
            if (response.response.status == 401) {
              that.$router.push("/login");
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
    }
  }
};
</script>

<style scoped src="../assets/css/components/chat.css"></style>
