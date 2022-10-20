<template>
  <div class="admin">
    <RouterLink :to="`/admin`"
      ><img class="back" src="../assets/img/volver_atras.png" />
    </RouterLink>
    <h2>Crear Organizacion</h2>
    <div class="selection">
      <div class="options">
        <label for="">Nombre</label>
        <input v-model="name" type="text" />
      </div>
      <div class="options">
        <label for="">Direccion</label>
        <input v-model="address" type="text" />
      </div>
      <div class="options">
        <label for="">Contacto</label>
        <input v-model="contact" type="text" />
      </div>
    </div>
    <button
      class="create"
      @click="create()"
      :disabled="name == '' || address == '' || contact == ''"
    >
      Crear
    </button>
  </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
export default {
  name: "addOrganization",
  components: {
    vSelect,
  },
  data() {
    return {
      selected: this.$route.params.user,
      name: "",
      address: "",
      contact: "",
      contactos: [],
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getContactos();
  },
  methods: {
    create() {
      if (
        this.name.trim() != "" &&
        this.address.trim() != "" &&
        this.contact.trim() != ""
      ) {
        console.log(
          "se enviaran los valores: ",
          this.name,
          this.address,
          this.contact
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
