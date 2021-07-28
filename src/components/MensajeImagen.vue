<template>
  <div class="chat-mensaje">
    <img
      v-show="mensajePropio && mensaje.read_at == null"
      class="chat-mensaje-estado"
      src="../assets/img/pendiente.png"
    />
    <img
      v-show="mensajePropio && mensaje.read_at != null"
      class="chat-mensaje-estado"
      src="../assets/img/entregado.png"
    />
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
      mostrarImagen: false,
    };
  },
  props: { mensaje: [Object], mensajePropio: [Boolean] },
  computed: {},
  mounted() {},
  created() {},
  methods: {
    getHora() {
      var offset = (new Date().getTimezoneOffset() / 60) * -1;
      var horaCompleta = this.mensaje.created_at.split("T")[1].split(":");
      var hora = parseFloat(horaCompleta[0]);

      hora = hora + offset;
      if (hora < 0) {
        hora = hora + 24;
      }
      hora = hora.toString();
      if (hora.length == 1) {
        hora = "0" + hora;
      }
      return hora + ":" + horaCompleta[1];
    },
  },
};
</script>

<style scoped src="../assets/css/components/chat.css"></style>
