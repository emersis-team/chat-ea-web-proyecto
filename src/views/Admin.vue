<template>
  <div class="admin">
    <RouterLink :to="`/`"
      ><img class="back" src="../assets/img/icono-contacto.png" />
    </RouterLink>
    <h2>Panel de Administracion</h2>
    <div class="selection">
      <div class="user">
        <label for="">Usuario</label>
        <v-select
          v-model="selected"
          :options="contactos"
          label="email"
        ></v-select>
      </div>
    </div>
    <button
      v-if="selected != '' && selected != null"
      class="asign"
      @click="asign()"
    >
      Asignar
    </button>
  </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
export default {
  name: "admin",
  components: {
    vSelect,
  },
  data() {
    return {
      contactos: [],
      selected: "",
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getContactos();
  },
  methods: {
    asign() {
      console.log("selected: ", this.selected);
      this.$router.push(`/admin/${this.selected.email}`);
    },
    getContactos() {
      var that = this;
      this.$axios
        .get(this.$localurl + "/api/usuarios")
        .then(function (response) {
          that.contactos = response.data;
          console.log("contactos: ", that.contactos);
        })
        .catch(function (response) {
          console.log("error", response);
        });
    },
  },
};
</script>

<style>
@import "../assets/css/views/admin.css";
</style>
