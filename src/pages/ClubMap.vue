<template>
  <div id="map">
    <div v-if="loading" class="map-status">Loading clubs...</div>
    <div v-else-if="error" class="map-status error">{{ error }}</div>

    <l-map ref="map" v-model:zoom="zoom" :center="defaultCenter">
      <l-tile-layer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>

      <template v-for="club in clubs" :key="club.id ?? `club-${club.city ?? club.title ?? club.name ?? Math.random()}`">
        <l-marker
          v-if="hasCoordinates(club.coordinates)"
          :lat-lng="getCoordinates(club.coordinates)"
          :icon="getMarkerIcon(club)"
        >
          <l-popup>
            <div>
              <strong>
                {{ club.title || club.name || 'Club' }}
                <span v-if="club.activity">- {{ club.activity }}</span>
              </strong>
              <div v-if="club.city">{{ club.city }}</div>
            </div>
          </l-popup>
        </l-marker>
      </template>
    </l-map>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import { getContentList } from "../services/apiService";

const mediaBaseUrl = import.meta.env.VITE_MEDIA_BASE_URL || "/media";

export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
  },
  data() {
    return {
      zoom: 9,
      clubs: [],
      activities: [],
      loading: true,
      error: null,
      defaultCenter: [48.233, -3.014],
    };
  },
  computed: {
    map() {
      return this.$refs.map?.leafletObject;
    },
  },
  mounted() {
    this.loadActivities().then(() => this.loadClubs());
  },
  methods: {
    buildMediaUrl(type, id, filename) {
      if (!filename) return "";
      if (filename.startsWith("http") || filename.startsWith("//")) {
        return filename;
      }
      return `${mediaBaseUrl}/${type}/${encodeURIComponent(id)}/${encodeURIComponent(filename)}`;
    },
    getActivityForClub(club) {
      const activityName = String(club?.activity || "").trim().toLowerCase();
      if (!activityName) return null;

      return this.activities.find((activity) => {
        const ids = [activity?.id, activity?.name]
          .filter(Boolean)
          .map((value) => String(value).trim().toLowerCase());
        return ids.includes(activityName);
      }) || null;
    },
    getMarkerIcon(club) {
      const activity = this.getActivityForClub(club);
      const fileName = activity?.mapicon || activity?.logo || "";
      const activityId = activity?.id || String(club?.activity || "").trim();

      if (!fileName || !activityId) {
        return undefined;
      }

      const iconUrl = this.buildMediaUrl("activities", activityId, fileName);

      return L.icon({
        iconUrl,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16],
      });
    },
    hasCoordinates(value) {
      if (!value) return false;
      const [lat, lng] = String(value)
        .split(",")
        .map((part) => Number.parseFloat(String(part).trim()));
      return Number.isFinite(lat) && Number.isFinite(lng);
    },
    getCoordinates(value) {
      const [lat, lng] = String(value)
        .split(",")
        .map((part) => Number.parseFloat(String(part).trim()));
      return [lat, lng];
    },
    async loadActivities() {
      try {
        const data = await getContentList("activities");
        this.activities = Array.isArray(data) ? data : [];
      } catch (err) {
        console.warn("Unable to load activities for map icons:", err);
        this.activities = [];
      }
    },
    async loadClubs() {
      try {
        const data = await getContentList("clubs");
        this.clubs = Array.isArray(data) ? data : [];

        const points = this.clubs
          .map((club) => club?.coordinates)
          .filter((value) => this.hasCoordinates(value))
          .map((coordinates) => this.getCoordinates(coordinates));

        if (points.length > 0 && this.map) {
          this.$nextTick(() => {
            this.map.fitBounds(points, { padding: [30, 30] });
          });
        }
      } catch (err) {
        this.error = err?.message || "Failed to load clubs.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style>
#map {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}

.map-status {
  position: absolute;
  z-index: 500;
  left: 12px;
  top: 12px;
  padding: 6px 12px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.9);
}

.map-status.error {
  color: #b00020;
}
</style>