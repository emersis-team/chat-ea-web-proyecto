<template>
  <div class="welcome">
    <RouterLink :to="`/`"
      ><img class="back" src="../assets/img/icono-contacto.png" />
    </RouterLink>
    <div class="row">
		<p class="welcome-message">
			Bienvenido a ChatEaWeb.<br>
			Complete sus datos para continuar.
		</p>
		</div>
    <div class="row">
      <label class="label">Nombre</label>
      <input
        class="input"
        type="text"
        placeholder="Escribe tu nombre"
        ref="name"
        v-bind:class="{ 'error-input': errorName }"
      >
    </div>

    <div class="row">
      <label class="label">Apellido</label>
      <input
        class="input"
        type="text"
        ref="lastname"
        placeholder="Escribe tu apellido"
        v-on:keyup.enter="complete()"
        v-bind:class="{ 'error-input': errorLastname }"
      >
    </div>

    <div class="row">
      <label class="label">DNI</label>
      <input
        class="input"
        type="text"
        ref="dni"
        placeholder="Escriba su DNI sin puntos ni comas"
        v-on:keyup.enter="complete()"
        v-bind:class="{ 'error-input': errorDni }"
      >
    </div>

    <div class="row">
      <label class="label">Rango</label>
      <input
        class="input"
        type="text"
        ref="range"
        placeholder="Escriba su rango militar"
        v-on:keyup.enter="complete()"
      >
    </div>

    <div class="row">
      <label class="label">select Lugar</label>
      <input
        class="input"
        type="text"
        ref="organization"
        placeholder="Seleccione su lugar de trabajo"
        v-on:keyup.enter="complete()"
      >
    </div>
    <button class="btn" @click="complete()">Continuar</button>
  </div>
</template>

<script>

export default {
  components: {},
  data() {
		return {
			errorName: false,
			errorLastname: false,
			errorDni: false
		}
	},
  created() {},
	mounted() {
		//this.axios
		//.get(`${this.$localurl}/api/lugares`)
		//.then(response => {
			//this.lugares = response.data.lugares;
		//})
		//.catch(response => {
			//console.log(response);
		//});
	},
  methods: {
		complete() {
      const name = this.$refs.name.value.trim();
      const lastname = this.$refs.lastname.value.trim();
      const dni = this.$refs.dni.value.trim();
      const grade = this.$refs.range.value.trim();
      const organization = this.$refs.organization.value.trim();

			this.errorName = name === "";
			this.errorLastname = lastname === "";
			this.errorDni = dni === "" || !dni.match(/^[0-9]+$/);

			this.axios
			.post(`${this.$localurl}/api/completion`, { name, lastname, dni, range, organization })
			.then(response => {
				localStorage.setItem("$userId", response.data.id);
				localStorage.setItem("$username", name);
				that.$router.push("/");
			})
			.catch(response => {
				console.log(response);
			});
		},
	}
}
</script>
<style>
@import "../assets/css/views/forms.css";
</style>

