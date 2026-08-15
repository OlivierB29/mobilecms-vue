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
    </l-map>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import L from "leaflet";
import "leaflet.markercluster";
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
      markerClusterGroup: null,
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
      const activityColor = activity?.rgbcolor || activity?.color || "#4f46e5";

      const iconUrl = fileName && activityId ? this.buildMediaUrl("activities", activityId, fileName) : "";

      const innerHtml = iconUrl
        ? `<img src="${iconUrl}" alt="" style="width: 18px; height: 18px; object-fit: contain; display: block; filter: drop-shadow(0 1px 1px rgba(0,0,0,0.2));" />`
        : `<span style="width: 14px; height: 14px; border-radius: 50%; background: transparent; display: block;"></span>`;

      return L.divIcon({
        className: "club-activity-marker",
        html: `
          <div style="
            position: relative;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background: ${activityColor};
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 8px rgba(0,0,0,0.28);
            border: 2px solid rgba(255,255,255,0.9);
          ">
            ${innerHtml}
          </div>
        `,
        iconSize: [42, 42],
        iconAnchor: [21, 21],
        popupAnchor: [0, -20],
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
    initializeMarkerCluster() {
      if (!this.map) return;

      // Remove existing cluster group if present
      if (this.markerClusterGroup) {
        this.map.removeLayer(this.markerClusterGroup);
      }

      // Create new marker cluster group
      this.markerClusterGroup = L.markerClusterGroup({
        maxClusterRadius: 80,
        showCoverageOnHover: true,
      });

      // Add markers to cluster group
      this.clubs.forEach((club) => {
        if (this.hasCoordinates(club.coordinates)) {
          const marker = L.marker(this.getCoordinates(club.coordinates), {
            icon: this.getMarkerIcon(club),
          });

          // Add popup with club information
          const popupContent = `
            <div>
              <strong>
                ${club.title || club.name || 'Club'}
                ${club.activity ? `- ${club.activity}` : ''}
              </strong>
              ${club.city ? `<div>${club.city}</div>` : ''}
              ${club.id ? `<div><a href="#/club/${encodeURIComponent(String(club.id))}">Voir le club</a></div>` : ''}
            </div>
          `;

          marker.bindPopup(popupContent);
          this.markerClusterGroup.addLayer(marker);
        }
      });

      // Add cluster group to map
      this.map.addLayer(this.markerClusterGroup);
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
            this.initializeMarkerCluster();
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