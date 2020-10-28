<template>
  <div class="chat-mensaje">
    <label>{{ mensaje.text }}</label>
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
  methods: {}
};
</script>

<style scoped src="../assets/css/components/chat.css"></style>
