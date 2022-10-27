<template>
  <div class="admin">
    <RouterLink :to="`/admin`"
      ><img class="back" src="../assets/img/volver_atras.png" />
    </RouterLink>
    <h2>Nuevo Administrador</h2>
    <div class="selection">
      <div class="options">
        <label for="">Organizacion</label>
        <v-select
          v-model="contactosSeleccionados"
          placeholder="Seleccione organizacion del contacto"
          :options="contactos"
          label="email"
        ></v-select>
      </div>
      <div class="options">
        <label for="">Usuarios</label>
        <v-select
          v-model="contactosSeleccionados"
          multiple
          :options="contactos"
          label="email"
        ></v-select>
      </div>
    </div>
    <button
      class="create"
      @click="create()"
      :disabled="contactosSeleccionados.length == 0"
    >
      Asignar
    </button>
  </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
export default {
  name: "newAdmin",
  components: {
    vSelect,
  },
  data() {
    return {
      selected: this.$route.params.user,
      contactos: [],
      contactosSeleccionados: [],
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getContactos();
  },
  methods: {
    create() {
      if (this.contactosSeleccionados != []) {
        console.log(
          "los campos seleccionados son:",
          this.contactosSeleccionados
        );
      } else {
        console.log("los campos son obligatorios");
      }
    },
    getContactos() {
      var that = this;
      // "/api/usuarios/lugar/this.lugar" // ocualquier otra ruta propuesta
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
