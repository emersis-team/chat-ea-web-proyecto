<template>
  <div class="admin">
    <RouterLink :to="`/`">
      <img class="back" src="../assets/img/volver_atras.png" />
    </RouterLink>
    <h2>Administracion de Grupos</h2>
    <RouterLink class="new" :to="`/admin/addGroup`"> Nuevo Grupo </RouterLink>

    <table>
      <tr>
        <th>Nombre</th>
      </tr>
      <tr v-for="(group, index) in grupos" :key="index">
        <td>
          <RouterLink :to="`/admin/${group.email}`">
            {{ group.email }}
          </RouterLink>
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
      grupos: [],
      selected: null,
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getGrupos();
  },
  methods: {
    search(e) {
      e.preventDefault();
      if (this.orgSelected != {} && this.orgSelected != null) {
        console.log("orgSelected: ", this.orgSelected);
        /*  var that = this;
      this.$axios
        .get(this.$localurl + "/usuarios/organizacion")
        .then(function (response) {
          that.contactos = response.data;
          console.log("contactos: ", that.contactos);
        })
        .catch(function (response) {
          console.log("error", response);
        });   */
      }
    },

    getGrupos() {
      var that = this;
      this.$axios
        .get(this.$localurl + "/usuarios", {
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
  },
};
</script>

<style>
@import "../assets/css/views/admin.css";
</style>
