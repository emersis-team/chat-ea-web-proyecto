<template>
  <div class="chat-mensaje">
    <div class="chat-mensaje-archivo" v-for="file in mensaje.files" :key="file.id">
      <label>{{file.original_file}}</label>
      <a :href="$localurl +'/public/storage/'+ file.file" download>Descargar</a>
    </div>
  </div>
</template>

<script>
export default {
  name: "MensajeArchivo",
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
