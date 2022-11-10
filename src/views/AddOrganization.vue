<template>
  <form @submit="create" class="admin">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :is-full-page="fullPage"
    ></loading>
    <RouterLink :to="`/admin-organizations`"
      ><img class="back" src="../assets/img/volver_atras.png" />
    </RouterLink>
    <h2>Crear Organizacion</h2>
    <div class="selection">
      <div class="options">
        <label for="">Nombre</label>
        <input v-model="name" type="text" />
        <span class="error" v-if="errors.name != ''">{{ errors.name }}</span>
      </div>
      <div class="options">
        <label for="">Direccion</label>
        <input v-model="address" type="text" />
        <span class="error" v-if="errors.address != ''">{{
          errors.address
        }}</span>
      </div>
      <div class="options">
        <label for="">Contacto</label>
        <input v-model="contact" type="text" />
        <span class="error" v-if="errors.contact != ''">{{
          errors.contact
        }}</span>
      </div>
    </div>
    <button class="create" type="submit" :disabled="name == ''">Crear</button>
    <!-- || address == '' || contact == '' -->
  </form>
</template>

<script>
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
export default {
  name: "addOrganization",
  components: {
    vSelect,
    Loading,
  },
  data() {
    return {
      selected: this.$route.params.user,
      name: "",
      address: "",
      contact: "",
      contactos: [],
      errors: {
        name: "",
        address: "",
        contact: "",
      },
      isLoading: false,
      fullPage: true,
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getContactos();
  },
  methods: {
    create(e) {
      e.preventDefault();

      if (!(this.name.trim().length >= 3 && this.name.trim().length <= 30)) {
        this.errors.name = "Este campo debe tener entre 3 y 30 caracteres";
      } else {
        this.errors.name = "";
      }
      /*  if (
        !(this.address.trim().length >= 8 && this.address.trim().length <= 20)
      ) {
        this.errors.address = "Este campo debe tener entre 3 y 20 caracteres";
      } else {
        this.errors.address = "";
      }
      if (
        !(this.contact.trim().length >= 8 && this.contact.trim().length <= 20)
      ) {
        this.errors.contact = "Este campo debe tener entre 3 y 20 caracteres";
      } else {
        this.errors.contact = "";
      } */
      if (
        this.errors.name == "" &&
        this.errors.address == "" &&
        this.errors.contact == ""
      ) {
        console.log("PETICION HTTP");
        this.isLoading = true;
        var that = this;
        const body = {
          user: {
            id: parseInt(localStorage.getItem("$userId")),
            name: localStorage.getItem("$username"),
          },
          location: { name: this.name },
        };

        this.$axios
          .post(this.$localurl + "/locations", body, {
            headers: {
              Authorization: localStorage.getItem("$token"),
            },
          })
          .then(function (response) {
            that.isLoading = false;

            console.log("response: ", response.data);
            that.$router.push("/admin");
          })
          .catch(function (response) {
            that.isLoading = false;

            console.log("error", response);
          });
      } else {
        console.log("HAY ERRORES");
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
