<template>
  <div class="admin">
    <RouterLink :to="`/`">
      <img class="back" src="../assets/img/volver_atras.png" />
    </RouterLink>
    <h2>Administracion de Usuarios</h2>
    <form @submit="search" class="search-container">
      <div class="user">
        <label for="">Organizacion</label>
        <v-select
          v-model="orgSelected"
          :options="organizaciones"
          label="name"
          placeholder="Todas"
        ></v-select>
      </div>
      <button type="submit" class="modify" :disabled="orgSelected == null">
        Buscar
      </button>
    </form>
    <table>
      <tr>
        <th>Nombre</th>
        <th>Organizacion</th>
        <th>N° de contactos</th>
        <th>Fecha de creacion</th>
      </tr>
      <tr v-for="(contacto, index) in contactos" :key="index">
        <td>
          <RouterLink :to="`/admin/${contacto.email}/${contacto.id}`">
            {{ contacto.name }} - {{ contacto.email }}
          </RouterLink>
        </td>
        <td>
          <RouterLink
            :to="`/admin/${
              contacto.organization
                ? contacto.organization
                : 'alguna organizacion'
            }`"
          >
            {{
              contacto.organization
                ? contacto.organization
                : "alguna organizacion"
            }}
          </RouterLink>
        </td>
        <td class="numeros">3</td>
        <td class="numeros">1/1/2020</td>
      </tr>
    </table>
  </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
export default {
  name: "admin-users",
  components: {
    vSelect,
  },
  data() {
    return {
      contactos: [],
      selected: null,
      orgSelected: null,
      organizaciones: [],
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getContactos();
    this.getOrganizaciones();
  },
  methods: {
    search(e) {
      e.preventDefault();
      console.log("orgSelected", this.orgSelected.id);
      var that = this;
      this.$axios
        .get(
          this.$localurl + "/api/admin/users/" + this.orgSelected.id
            ? this.orgSelected.id
            : ""
        )
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
      /* const query = `?id=${localStorage.getItem(
        "$userId"
      )}&name=${localStorage.getItem("$username")}`; */
      this.$axios
        .get(this.$localurl + "/locations", {
          headers: {
            Authorization: localStorage.getItem("$token"),
          },
        })
        .then(function (response) {
          that.organizaciones = response.data;
          console.log("getorganizaciones: ", response.data);
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
