<template>
  <form @submit="create" class="admin">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :is-full-page="fullPage"
    ></loading>
    <RouterLink :to="`/admin`"
      ><img class="back" src="../assets/img/volver_atras.png" />
    </RouterLink>
    <h2>Nuevo Administrador</h2>
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
        <label for="">Usuarios</label>
        <v-select
          v-model="contactoSeleccionado"
          :options="contactos"
          label="email"
        ></v-select>
      </div>
    </div>
    <button class="create" type="submit" :disabled="contactoSeleccionado == ''">
      Asignar
    </button>
  </form>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";

export default {
  name: "newAdmin",
  components: {
    vSelect,
    Loading,
  },
  data() {
    return {
      contactos: [],
      contactoSeleccionado: {},
      organizaciones: [],
      organizacionSeleccionada: "",
      isLoading: false,
      fullPage: true,
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getContactos();
    this.getOrganizaciones();
  },
  methods: {
    create(e) {
      e.preventDefault();

      if (this.contactoSeleccionado != "") {
        this.isLoading = true;
        var that = this;
        this.$axios
          .post(
            this.$localurl + `/new-admin/${this.contactoSeleccionado.id}`,
            {
              id: localStorage.getItem("$userId"),
              email: localStorage.getItem("$email"),
            },
            {
              headers: {
                Authorization: localStorage.getItem("$token"),
              },
            }
          )
          .then(function (response) {
            that.isLoading = false;
            that.$router.push("/admin");
          })
          .catch(function (response) {
            that.isLoading = false;
            console.log("error", response);
          });
      } else {
        console.log("los campos son obligatorios");
      }
    },
    getContactos() {
      var that = this;

      // "/api/usuarios/lugar/this.lugar" // ocualquier otra ruta propuesta
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
      // "/api/usuarios/lugar/this.lugar" // ocualquier otra ruta propuesta
      const query = `?id=${localStorage.getItem(
        "$userId"
      )}&name=${localStorage.getItem("$username")}`;
      this.$axios
        .get(this.$localurl + "/api/admin/locations" + query, {
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
