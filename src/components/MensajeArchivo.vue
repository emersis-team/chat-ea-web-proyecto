<template>
  <div class="chat-mensaje">
    <div class="chat-mensaje-archivo">
      <label v-show="sender != null" class="chat-mensaje-sender">{{sender}}</label>
      <label class="chat-mensaje-archivo-titulo">{{mensaje.message.original_file}}</label>
      <label class="chat-mensaje-hora">{{ getHora() }}</label>
      <a :href="'http://10.120.17.157:8081/storage/'+ mensaje.message.file" download>Descargar</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "MensajeArchivo",
  components: {},
  data() {
    return {};
  },
  props: { mensaje: [Object], sender: [String] },
  computed: {},
  mounted() {},
  created() {},
  methods: {
    getHora() {
      var hora = this.mensaje.created_at.split("T")[1].split(":");
      return hora[0] + ":" + hora[1];
    }
  }
};
</script>

<style scoped src="../assets/css/components/chat.css"></style>
