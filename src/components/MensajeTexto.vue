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
    <div class="chat-mensaje-texto">
      <label>{{ mensaje.message.text }}</label>
      <label class="chat-mensaje-hora">{{ getHora() }}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: "MensajeTexto",
  components: {},
  data() {
    return {};
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
