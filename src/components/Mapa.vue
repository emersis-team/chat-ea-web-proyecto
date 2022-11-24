<template>
  <div style="height: 100%; width: 100%">
    <l-map
      :zoom="zoom"
      :center="center"
      :options="mapOptions"
      @update:center="centerUpdate"
      @update:zoom="zoomUpdate"
      ref="map"
    >
      <l-tile-layer :url="url" :attribution="attribution"/>
      <l-marker :lat-lng="posicionPropia" :icon="icon">
        <l-tooltip :options="{ permanent: true, interactive: true }">
          <div>Yo</div>
        </l-tooltip>
      </l-marker>
      <l-marker
        v-for="(posicion, index) in posiciones"
        :key="index"
        :lat-lng="getPosicion(posicion[0])"
        :icon="iconContacto"
      >
        <l-tooltip :options="{ permanent: true, interactive: true }">
          <div>{{getName(posicion[0])}}</div>
        </l-tooltip>
      </l-marker>
    </l-map>
  </div>
</template>

<script>
import { latLng, icon } from "leaflet";
import { LMap, LTileLayer, LMarker, LTooltip } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";

export default {
  name: "Example",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LTooltip
  },
  props: { posiciones: [Array], contactos: [Array] },
  data() {
    return {
      zoom: 13,
      center: latLng(47.41322, -1.219482),
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      posicionPropia: latLng(47.41322, -1.219482),
      currentZoom: 11.5,
      currentCenter: latLng(47.41322, -1.219482),
      mapOptions: {
        zoomSnap: 0.5
      },
      icon: icon({
        iconUrl: require("../assets/img/mapa/ubicacion_propia.png"),
        iconSize: [24, 36],
        iconAnchor: [12, 36]
      }),
      iconContacto: icon({
        iconUrl: require("../assets/img/mapa/ubicacion_contacto.png"),
        iconSize: [24, 36],
        iconAnchor: [12, 36]
      })
    };
  },
  computed: {
    dynamicSize() {
      return [this.iconSize, this.iconSize * 1.15];
    },
    dynamicAnchor() {
      return [this.iconSize / 2, this.iconSize * 1.15];
    }
  },
  // watch: {
  //   conversaciones: function(newVal) { // watch it
  //     this.conversacionesFiltradas = newVal.filter(c => c.user_dest.last_position != null);
  //   }
  // },
  mounted() {
    this.$eventHub.$on("map-center", posicion => this.changeCenter(posicion));
    this.$eventHub.$on("map-center-propia", () =>
      this.centrarPropia(this.posicionPropia)
    );

    // this.conversacionesFiltradas = this.conversaciones.filter(c => c.user_dest.last_position != null);

    var that = this;
    navigator.geolocation.getCurrentPosition(function(position) {
      that.center = [position.coords.latitude, position.coords.longitude];
      that.posicionPropia = [
        position.coords.latitude,
        position.coords.longitude
      ];
      console.log(that.posicionPropia);
    });
  },
  methods: {
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
    },
    centrarPropia(posicionPropia) {
      this.changeCenter(posicionPropia);
    },
    changeCenter(center) {
      this.center = center;
      setTimeout(() => {
        this.$refs.map.mapObject.invalidateSize(true);
      }, 500);
    },
    getPosicion(posicion) {
      if (posicion != null) {
        return [parseFloat(posicion.lat), parseFloat(posicion.lon)];
      } else {
        return null;
      }
    },
    getName(posicion) {
      return posicion != null
        ? this.contactos.filter(c => c.id == posicion.user_id)[0].email
        : null;
    }
  }
};
</script>