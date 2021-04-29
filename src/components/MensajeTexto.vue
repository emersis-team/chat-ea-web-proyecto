<template>
  <div class="chat-mensaje chat-mensaje-texto">
    <label>{{ mensaje.message.text }}</label>
    <label class="chat-mensaje-hora">{{ getHora() }}</label>
  </div>
</template>

<script>
export default {
  name: "MensajeTexto",
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
