<template>
  <form @submit="asign" class="admin">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :is-full-page="fullPage"
    ></loading>
    <RouterLink :to="`/admin-users`"
      ><img class="back" src="../assets/img/volver_atras.png" />
    </RouterLink>
    <h2>Actualizar Usuario {{ selected }}</h2>
    <div class="selection">
      <div class="options">
        <label for="">Organizacion</label>
        <v-select
          v-model="organizacionSeleccionada"
          placeholder="Seleccione organizacion del contacto"
          :options="organizaciones"
          label="name"
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
      :disabled="
        contactosSeleccionados.length == 0 && gruposSeleccionados.length == 0
      "
    >
      Asignar
    </button>
  </form>
</template>

<script>
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
export default {
  name: "updateUser",
  components: {
    Loading,
    vSelect,
  },
  data() {
    return {
      selected: this.$route.params.user,
      organizaciones: [],
      organizacionSeleccionada: "",
      contactos: [],
      contactosRec: [],
      contactosSeleccionados: [],
      gruposSeleccionados: [],
      grupos: [],
      lugar: "",
      isLoading: false,
      fullPage: true,
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
      const groups = [...this.grupos];
      if (this.selected != "") {
        console.log("seleccionado UPDATE: ", this.selected);
        this.contactos.splice(this.grupos.indexOf(this.selected), 1);
        console.log("gruposRecortados: ", groups);
      }
      return groups;
    },
  },
  created() {},
  mounted() {
    this.getContactos();
    this.getOrganizaciones();
    this.getGrupos();
  },
  methods: {
    asign(e) {
      e.preventDefault();

      console.log("usuario: ", this.selected);
      if (this.contactosSeleccionados != null)
        console.log(
          " contacto seleccionado: ",
          this.contactosSeleccionados.map(({ id }) => id)
        );
      if (this.gruposSeleccionados != null)
        console.log(" grupo seleccionado: ", this.gruposSeleccionados);

      /* 
       this.isLoading = true;
        var that = this;
        const body = {contacts:this.contactosSeleccionados, groups:this.gruposSeleccionados};
        this.$axios
        .put(this.$localurl + `/actualizarusuario/${this.selected}`, body)
        .then(function (response) {
            that.isLoading = false;

          console.log("response: ", response.data);
        })
        .catch(function (response) {
            that.isLoading = false;

          console.log("error", response);
        }); 
        */
    },
    getGrupos() {
      var that = this;
      // "/usuarios/lugar/this.lugar" // ocualquier otra ruta propuesta
      this.$axios
        .get(this.$localurl + "/usuarios", {
          headers: {
            Authorization: localStorage.getItem("$token"),
          },
        })
        .then(function (response) {
          that.contactos = response.data;
          console.log("contactos: ", that.contactos);
        })
        .catch(function (response) {
          console.log("error", response);
        });
    },
    getContactos() {
      var that = this;
      // "/usuarios/lugar/this.lugar" // ocualquier otra ruta propuesta
      this.$axios
        .get(this.$localurl + "/usuarios", {
          headers: {
            Authorization: localStorage.getItem("$token"),
          },
        })
        .then(function (response) {
          that.contactos = response.data;
          console.log("contactos: ", that.contactos);
        })
        .catch(function (response) {
          console.log("error", response);
        });
    },
    getOrganizaciones() {
      var that = this;
      // "/usuarios/lugar/this.lugar" // ocualquier otra ruta propuesta
      const query = `?id=${localStorage.getItem(
        "$userId"
      )}&name=${localStorage.getItem("$username")}`;
      this.$axios
        .get(this.$localurl + "/locations" + query, {
          headers: {
            Authorization: localStorage.getItem("$token"),
          },
        })
        .then(function (response) {
          that.organizaciones = response.data;
          console.log("organizaciones: ", that.organizaciones);
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
