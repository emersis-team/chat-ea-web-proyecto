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
          label="formattedName"
        ></v-select>
      </div>
      <div class="options">
        <label for="">Grupos</label>
        <v-select
          v-if="selected != ''"
          v-model="gruposSeleccionados"
          multiple
          :options="gruposRecortados"
          label="name"
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
      id: this.$route.params.id,
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
		getActualInfo() {
		},
    contactosRecortados() {
      const contacts = [...this.contactos];

      if (this.selected != "") {
        const index = this.contactos.findIndex(
          ({ email }) => email === this.selected
        );
      }

      return contacts.map((c) => ({
        ...c,
        formattedName:
          c.name !== "null" ? `${c.name} - ` : "" + c.email !== "null" ? c.email : "",
      }));
    },
    gruposRecortados() {
      const groups = [...this.grupos];
      if (this.selected != "") {
        this.contactos.splice(this.grupos.indexOf(this.selected), 1);
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
			let contacts, groups;
      e.preventDefault();
      if (this.contactosSeleccionados != null)
          contacts = this.contactosSeleccionados.map(({ id }) => id);
      if (this.gruposSeleccionados != null)
        groups = this.gruposSeleccionados.map(({ id }) => id);

      this.isLoading = true;
      var that = this;
      const body = {
        contacts,
        groups
      };
      this.$axios
        .put(this.$localurl + `/nuevosContactos/${this.id}`, body)
        .then(function (response) {
          that.isLoading = false;

          console.log("response: ", response.data);
        })
        .catch(function (response) {
          that.isLoading = false;

          console.log("error", response);
        });
    },
    getGrupos() {
      var that = this;
      // "/usuarios/lugar/this.lugar" // ocualquier otra ruta propuesta
      this.$axios
        .get(this.$localurl + "/groups", {
          headers: {
            Authorization: localStorage.getItem("$token"),
          },
        })
        .then(function (response) {
          that.grupos = response.data;
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
        })
        .catch(function (response) {
          console.log("error", response);
        });
    },
    getOrganizaciones() {
      var that = this;
      // "/usuarios/lugar/this.lugar" // ocualquier otra ruta propuesta
      this.$axios
        .get(this.$localurl + "/locations", {
          headers: {
            Authorization: localStorage.getItem("$token"),
          },
        })
        .then(function (response) {
          that.organizaciones = response.data;
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
