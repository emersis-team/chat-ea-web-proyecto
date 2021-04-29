<template>
  <div class="chat-mensaje">
    <label class="chat-mensaje-hora">{{ getHora() }}</label>
    <div
      class="chat-mensaje-video"
      v-for="file in mensaje.message.files"
      :key="file.id"
    >
      <label>{{ file.original_file }}</label>
      <video controls name="media">
        <source
          :src="$localurl + '/public/storage/' + file.file"
          type="video/mp4"
        />
      </video>
      <a :href="$localurl + '/public/storage/' + file.file" download
        >Descargar</a
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "MensajeVideo",
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
            var offset = new Date().getTimezoneOffset() / 60 * -1;
      var horaCompleta = this.mensaje.created_at.split("T")[1].split(":");
      var hora = horaCompleta[0];

      hora = hora + offset;
      if(hora < 0){
        hora = (hora + 24).toString();
      }
      if(hora.length == 1){
        hora = "0" + hora;
      }
      return hora[0] + ":" + horaCompleta[1];
    }
  }
};
</script>

<style scoped src="../assets/css/components/chat.css"></style>
