<template>
  <div class="admin">
    <RouterLink :to="`/`">
      <img class="back" src="../assets/img/volver_atras.png" />
    </RouterLink>
    <h2>Administracion de Organizaciones</h2>
    <RouterLink class="new" :to="`/admin/addOrganization`">
      Nueva Organizacion
    </RouterLink>

    <table>
      <tr>
        <th>Nombre</th>
        <th>Contacto</th>
      </tr>
      <tr v-for="(org, index) in organizaciones" :key="index">
        <td>
          <RouterLink :to="`/admin/${org.name}`">
            {{ org.name }}
          </RouterLink>
        </td>
        <td>
          {{ org.contacto }}
        </td>
      </tr>
    </table>
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
      selected: null,
      orgSelected: null,
      organizaciones: [],
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getOrganizaciones();
  },
  methods: {
    getOrganizaciones() {
      var that = this;
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
