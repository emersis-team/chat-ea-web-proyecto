<template>
  <div class="chat-mensaje">
    <div
      class="chat-mensaje-imagen"
      v-for="file in mensaje.message.files"
      :key="file.id"
    >
      <label>{{ file.original_file }}</label>
      <label class="chat-mensaje-hora">{{ getHora() }}</label>
      <img :src="$localurl + '/public/storage/' + file.file" />
      <a :href="$localurl + '/public/storage/' + file.file" download
        >Descargar</a
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "MensajeImagen",
  components: {},
  data() {
    return {
      mostrarImagen: false
    };
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
