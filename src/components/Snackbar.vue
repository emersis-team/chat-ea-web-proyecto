<template>
  <transition name="fade-fast">
    <div class="snackbar" v-show="mostrarSnackbar == true">
      <p class="snackbar-texto">
        {{ texto }}
      </p>
    </div>
  </transition>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      mostrarSnackbar: false,
      texto: "",
      myTimeout: null
    };
  },
  created() {
    this.$eventHub.$on("snackbar", texto => this.abrirSnackbar(texto));
  },
  mounted() {},
  methods: {
    abrirSnackbar(texto) {
      clearTimeout(this.myTimeout);
      this.texto = texto;
      this.mostrarSnackbar = true;
      var that = this;
      this.myTimeout = setTimeout(function() {
        that.mostrarSnackbar = false;
      }, 2000);
    }
  }
};
</script>

<style>
.snackbar {
  position: absolute;
  bottom: 1.65vw;
  right: 1.5vw;
  background-color: #333;
  z-index: 10000;
  width: 19.3vw;
  height: 4.35vw;
  border-radius: 0.5vw;
  box-shadow: 0 0.25vw 0.27vw 0 rgba(0, 0, 0, 0.21);
}
.snackbar-texto {
  font-family: Poppins-Regular;
  font-size: 1.1vw;
  color: #ffffff;
  margin: 0;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  text-align: center;
}
.snackbar-texto > img {
  position: relative;
  top: 0.6vw;
  width: 2.05vw;
  margin-left: 0.75vw;
}
</style>
