<template>
  <div class="admin">
    <RouterLink :to="`/`">
      <img class="back" src="../assets/img/volver_atras.png" />
    </RouterLink>
    <h2>Panel de Administracion</h2>
    <form @submit="modify" class="user-container">
      <div class="user">
        <label for="">Usuario</label>
        <v-select
          v-model="selected"
          :options="contactos"
          label="email"
        ></v-select>
      </div>
      <button type="submit" class="modify" :disabled="selected == null">
        Asignar
      </button>
    </form>
    <div class="place-container">
      <div class="place">
        <label for="">Nueva Organizacion</label>
      </div>
      <button class="add-org" @click="addOrg()">Agregar</button>
    </div>
    <div class="new-admin-container">
      <div class="new-admin">
        <label for="">Nuevo Administrador</label>
      </div>
      <button class="new-admin-btn" @click="newAdmin()">Agregar</button>
    </div>
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
      selected: null,
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getContactos();
  },
  methods: {
    modify(e) {
      e.preventDefault();
      if (this.selected != {} && this.selected != null) {
        console.log("selected: ", this.selected);
        this.$router.push(`/admin/${this.selected.email}`);
      }
    },
    addOrg() {
      this.$router.push(`/admin/addOrganization`);
    },
    newAdmin() {
      this.$router.push(`/admin/newAdmin`);
    },
    getContactos() {
      var that = this;
      this.$axios
        .get(this.$localurl + "/usuarios")
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
