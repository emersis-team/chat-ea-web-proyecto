<template>
  <div class="welcome">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :is-full-page="fullPage"
    ></loading>
    <RouterLink :to="`/`">
      <img class="back" src="../assets/img/volver_atras.png" />
    </RouterLink>
    <RouterLink v-if="edit" :to="`/`">
      ><img class="back" src="../assets/img/icono-contacto.png" />
    </RouterLink>
    <div class="row">
      <h2>Mi Perfil</h2>
    </div>
    <div class="row">
      <label class="label">Nombre</label>
      <input
        class="input"
        type="text"
        placeholder="Escribe tu nombre"
        ref="name"
        v-bind:class="{ 'error-input': errorName }"
      />
    </div>

    <div class="row">
      <label class="label">Apellido</label>
      <input
        class="input"
        type="text"
        ref="lastname"
        placeholder="Escribe tu apellido"
        v-on:keyup.enter="update()"
        v-bind:class="{ 'error-input': errorLastname }"
      />
    </div>

    <div class="row">
      <label class="label">DNI</label>
      <input
        class="input"
        type="text"
        ref="dni"
        placeholder="Escriba su DNI sin puntos ni comas"
        v-on:keyup.enter="update()"
        v-bind:class="{ 'error-input': errorDni }"
      />
    </div>

    <div class="row">
      <label class="label">Grado</label>
      <input
        class="input"
        type="text"
        ref="range"
        placeholder="Escriba su grado militar"
        v-on:keyup.enter="update()"
      />
    </div>

    <div class="row">
      <label class="label">Seleccione Lugar</label>
      <v-select
        v-model="orgSelected"
        :options="organizaciones"
        label="name"
        placeholder="Seleccione su lugar de trabajo"
      ></v-select>
      <!--  <input
        class="input"
        type="text"
        ref="organization"
        placeholder="Seleccione su lugar de trabajo"
        v-on:keyup.enter="update()"
      /> -->
    </div>
    <button class="btn" @click="update()">Editar</button>
  </div>
</template>

<script>
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
export default {
  components: {
    Loading,
    vSelect,
  },
  props: ["email"],
  data() {
    return {
      errorName: false,
      errorLastname: false,
      errorDni: false,
      edit: false,
      isLoading: false,
      fullPage: true,
      orgSelected: null,
      organizaciones: [],
    };
  },
  created() {},
  mounted() {
    this.getData();
    this.getOrganizaciones();
  },
  methods: {
    getData() {
      this.$refs.name.value =
        localStorage.getItem("$username") != "null"
          ? localStorage.getItem("$username")
          : "";
      this.$refs.lastname.value =
        localStorage.getItem("$lastname") != "null"
          ? localStorage.getItem("$lastname")
          : "";
      this.$refs.dni.value =
        localStorage.getItem("$dni") != "null"
          ? localStorage.getItem("$dni")
          : "";
      this.$refs.range.value =
        localStorage.getItem("$range") != "null"
          ? localStorage.getItem("$range")
          : "";
      this.$refs.organization.value =
        localStorage.getItem("$organization") != "null"
          ? localStorage.getItem("$organization")
          : "";

      this.errorNa;
      console.log("org: ", localStorage.getItem("$organization"));
    },
    update() {
      const name = this.$refs.name.value.trim();
      const lastname = this.$refs.lastname.value.trim();
      const dni = this.$refs.dni.value.trim();
      const grade = this.$refs.range.value.trim();
      const organization = this.$refs.organization.value.trim();
      const email = this.email || "";

      this.errorName = name === "";
      this.errorLastname = lastname === "";
      this.errorDni = dni === "" || !dni.match(/^[0-9]+$/);

      this.isLoading = true;
    },
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
@import "../assets/css/views/forms.css";
</style>

