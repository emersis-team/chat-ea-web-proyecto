<template>
  <div class="chat-mensaje">
    <div class="chat-mensaje-archivo" v-for="file in mensaje.message.files" :key="file.id">
      <label class="chat-mensaje-archivo-titulo">{{file.original_file}}</label>
      <label class="chat-mensaje-hora">{{ getHora() }}</label>
      <a :href="$localurl +'/public/storage/'+ file.file" download>Descargar</a>
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
  props: { mensaje: [Object] },
  computed: {},
  mounted() {},
  created() {},
  methods: {
    getHora(){
      var hora = this.mensaje.created_at.split("T")[1].split(":");
      return hora[0] + ":" + hora[1];
    }
  }
};
</script>

<style scoped src="../assets/css/components/chat.css"></style>
