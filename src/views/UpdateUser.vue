<template>
  <div class="admin">
    <RouterLink :to="`/admin`"
      ><img class="back" src="../assets/img/volver_atras.png" />
    </RouterLink>
    <h2>Actualizar Usuario {{ selected }}</h2>
    <div class="selection">
      <div class="options">
        <label for="">Organizacion</label>
        <v-select
          v-if="selected != ''"
          v-model="contactosSeleccionados"
          placeholder="Seleccione organizacion del contacto"
          :options="contactosRecortados"
          label="email"
        ></v-select>
      </div>
      <div class="options">
        <label for="">Contactos</label>
        <v-select
          v-if="selected != ''"
          v-model="contactosSeleccionados"
          multiple
          :options="contactosRecortados"
          label="email"
        ></v-select>
      </div>
      <div class="options">
        <label for="">Grupos</label>
        <v-select
          v-if="selected != ''"
          v-model="gruposSeleccionados"
          multiple
          :options="gruposRecortados"
          label="email"
        ></v-select>
      </div>
    </div>
    <button
      v-if="
        selected != '' &&
        selected != null &&
        ((contactosSeleccionados != [] && contactosSeleccionados != null) ||
          (gruposSeleccionados != [] && gruposSeleccionados != null))
      "
      class="asign"
      @click="asign()"
      :disabled="
        contactosSeleccionados.length == 0 && gruposSeleccionados.length == 0
      "
    >
      Asignar
    </button>
  </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
export default {
  name: "updateUser",
  components: {
    vSelect,
  },
  data() {
    return {
      selected: this.$route.params.user,
      contactos: [],
      contactosRec: [],
      contactosSeleccionados: [],
      gruposSeleccionados: [],
      lugar: "",
    };
  },
  computed: {
    contactosRecortados() {
      const contacts = [...this.contactos];
      console.log("RUTA", this.$route.params.user);

      if (this.selected != "") {
        const index = this.contactos.findIndex(
          ({ email }) => email === this.selected
        );
        console.log("seleccionado UPDATE: ", this.selected);
        console.log("index: ", index);
        contacts.splice(index, 1);
        console.log("contactosRecortados: ", contacts);
      }
      return contacts;
    },
    gruposRecortados() {
      const contacts = [...this.contactos];
      if (this.selected != "") {
        console.log("seleccionado UPDATE: ", this.selected);
        contacts.splice(this.contactos.indexOf(this.selected), 1);
        console.log("gruposRecortados: ", contacts);
      }
      return contacts;
    },
  },
  created() {},
  mounted() {
    this.getContactos();
  },
  methods: {
    asign() {
      console.log("usuario: ", this.selected.email);
      if (this.contactosSeleccionados != null)
        console.log(" contacto seleccionado: ", this.contactosSeleccionados);
      if (this.gruposSeleccionados != null)
        console.log(" grupo seleccionado: ", this.gruposSeleccionados);
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
