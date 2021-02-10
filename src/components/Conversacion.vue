<template>
  <div class="conversacion">
    <div class="conversacion-sinleer" v-show="conversacion.ammount_no_read > 0">
      <label>{{conversacion.ammount_no_read}}</label>
    </div>
    <div class="conversacion-imagen">
      <img src="../assets/img/contacto.png" />
    </div>
    <p class="conversacion-nombre">{{ conversacion.user_dest.name }}</p>
    <p class="conversacion-email">{{ conversacion.user_dest.email }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: { conversacion: [Object] },
  computed: {},
  mounted() {},
  created() {},
  methods: {}
};
</script>

<style scoped src="../assets/css/components/conversacion.css"></style>
