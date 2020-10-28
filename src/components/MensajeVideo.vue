<template>
  <div class="chat-mensaje">
    <div
      class="chat-mensaje-video"
      v-for="file in mensaje.files"
      :key="file.id"
    >
      <label>{{ file.original_file }}</label>
      <video controls name="media">
        <source
          :src="$localurl + '/public/storage/' + file.file"
          type="video/mp4"
        />
      </video>
      <a :href="$localurl + '/public/storage/' + file.file" download
        >Descargar</a
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "MensajeVideo",
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
