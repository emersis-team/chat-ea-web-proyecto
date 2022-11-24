<template>
  <div class="chat-mensaje chat-mensaje-texto">
    <label v-show="sender != null" class="chat-mensaje-sender">{{sender}}</label>
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
