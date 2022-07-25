<template>
  <div ref="alerta" class="alert alert-danger text-message">
    <p>{{ reason }}</p>
    <button class="btn btn-md btn-secondary" @click="close">Aceptar</button>
  </div>
</template>

<script>
export default {
  props: ["reason"],
  methods: {
    close() {
      this.$emit("clear-error", "");
    },
  },
};
</script>

<style>
.text-message {
  z-index: 9;
  position: absolute;
  top: 50%;
  left: 40%;
  transition: translate(-50%, -50%);
  width: 20vw;
}
</style>
