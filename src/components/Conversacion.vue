<template>
  <div class="conversacion">
    <div class="conversacion-sinleer" v-show="conversacion.ammount_no_read > 0">
      <label>{{ conversacion.ammount_no_read }}</label>
    </div>
    <div class="conversacion-imagen">
      <!-- <img src="../assets/img/contacto-otro.png" /> -->
      <img
        v-if="conversacion.conversacionElegida === true"
        src="../assets/img/contacto-actual.png"
      />
      <img
        v-if="conversacion.conversacionElegida !== true"
        src="../assets/img/contacto-otro.png"
      />
    </div>
    <p class="conversacion-nombre">
      {{
        conversacion.conversation_name != null
          ? conversacion.conversation_name
          : conversacion.conversation_members[0].name
      }}
    </p>
    <p class="conversacion-email">
      {{
        conversacion.conversation_members.length > 1
          ? conversacion.conversation_members.length + " miembros"
          : ""
      }}
    </p>
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
  methods: {},
  setup(props) { },
};
</script>

<style src="../assets/css/components/conversacion.css"></style>
