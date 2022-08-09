<template>
  <div ref="alerta" class="text-message">
    <p>{{ reason }}</p>
    <button class="btn" @click="close">Aceptar</button>
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
  left: 50%;
  transform: translate(-50%, 50%);
  width: 20vw;
  background-color: rgb(171, 48, 48);
  color: whitesmoke;
  padding: 0 10px 10px 10px;
  border-radius: 20px;
  font-family: OpenSans-SemiBold;
}

.btn {
  background-color: rgb(239, 10, 10);
  color: whitesmoke;
  border: 2px solid whitesmoke;
  border-radius: 20px;
  padding: 5px;
}
</style>
