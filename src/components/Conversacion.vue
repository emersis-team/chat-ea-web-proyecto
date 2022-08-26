<template>
  <div class="conversacion">
    <div class="conversacion-sinleer" v-show="conversacion.ammount_no_read > 0">
      <label>{{ conversacion.ammount_no_read }}</label>
    </div>
    <div class="conversacion-imagen">
      <img v-if="conversacionElegida" src="../assets/img/contacto-actual.png" />
      <img v-if="!conversacionElegida" src="../assets/img/contacto-otro.png" />
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
    return {
      isSelected: "../assets/img/contacto-otro.png",
    };
  },
  props: { conversacion: [Object], conversacionElegida: [Boolean] },
  computed: {},
  mounted() {},
  created() {},
  methods: {},
  setup(props) {
    console.log("conversacion desde conversacion", props.conversacion);
  },
};
</script>

<style scoped src="../assets/css/components/conversacion.css"></style>
