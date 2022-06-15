<template>
  <div class="chat-mensaje">
    <div class="chat-mensaje-audio">
      <label v-show="sender != null" class="chat-mensaje-sender">{{sender}}</label>
      <label class="chat-mensaje-audio-titulo">{{ mensaje.message.original_file }}</label>
      <label class="chat-mensaje-hora">{{ getHora() }}</label>
      <audio controls name="media">
        <source
          :src="'http://10.120.17.157:8081/storage/' + mensaje.message.file"
          type="audio/mpeg"
        >
      </audio>
      <a :href="'http://10.120.17.157:8081/storage/' + mensaje.message.file" download>Descargar</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "MensajeAudio",
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
