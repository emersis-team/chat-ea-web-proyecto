<template>
  <div class="chat-mensaje">
    <div
      class="chat-mensaje-audio"
      v-for="file in mensaje.files"
      :key="file.id"
    >
      <label>{{ file.original_file }}</label>
      <audio controls name="media">
        <source
          :src="$localurl + '/public/storage/' + file.file"
          type="audio/mpeg"
        />
      </audio>
      <a :href="$localurl + '/public/storage/' + file.file" download
        >Descargar</a
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "MensajeAudio",
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
