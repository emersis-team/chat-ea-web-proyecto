<template>
  <div class="chat-mensaje">
    <div class="chat-mensaje-texto">
      <label>LATITUD: {{ mensaje.message.lat }}</label>
      <label>LONGITUD: {{ mensaje.message.lon }}</label>
      <label>ALTITUD: {{ mensaje.message.alt }}</label>
      <label class="chat-mensaje-hora">{{ getHora() }}</label>
    </div>
  </div>
</template>

<script>
export default {
  name: "MensajePosicion",
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
      var hora = parseFloat(horaCompleta[0]);

      hora = hora + offset;
      if(hora < 0){
        hora = hora + 24;
      }
      hora = hora.toString();
      if(hora.length == 1){
        hora = "0" + hora;
      }
      return hora + ":" + horaCompleta[1];
    }
  }
};
</script>

<style scoped src="../assets/css/components/chat.css"></style>
