<template>
    <div class="widget card" ref="widgetRef">
      <div class="card-content">
        <div id="map-canvas" class="heatmap" style="height: 450px;"></div>
      </div>
    </div>
  </template>
  
  <script>
  import * as L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  import 'leaflet.heat'; // Import Leaflet.heat plugin

  import { mapState } from 'vuex';
  
  export default {
    data() {
      return {
        polling: null,
        initialCenter: [43.2456, 27.9292], // Initial map center
        addressPoints: [],
        heatLayerOptions: {
          radius: 25,
          blur: 25,
          maxZoom: 11,
          scaleRadius: true,
          opacity: 0.8,
        },
        heatLayer: null, // Reference to the heat layer instance
      };
    },
  
    computed: {
      ...mapState(['all_devs']),
    },
  
    mounted() {
      this.initializeMap();
      this.addData();
      this.pollData();
    },
  
    methods: {
      async pollData() {
        this.addressPoints = [];
        this.polling = setInterval(async () => {
          try {
            await this.addData();
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        }, 15000);
      },
  
      normalizeValues(val) {
        return val / 100; // Adjust normalization as needed
      },
  
      addData() {
        this.addressPoints = [];
        this.all_devs.forEach((el) => {
          const power = parseFloat(el.power);
          if (!isNaN(power) && power >= 0 && el.lat) {
            const intensity = this.normalizeValues(power);
            this.addressPoints.push([el.lat, el.long, intensity]);
          }
        });
  
        if (this.heatLayer) {
          this.map.removeLayer(this.heatLayer);
        }
  
        const heatPoints = this.addressPoints.map((p) => [p[0], p[1], p[2]]);
        this.heatLayer = L.heatLayer(heatPoints, this.heatLayerOptions).addTo(this.map);
      },
  
      initializeMap() {
        this.map = L.map('map-canvas').setView(this.initialCenter, 9);
        L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png').addTo(this.map);
        this.addData(); // Initialize with initial data
      },
  
      beforeDestroy() {
        clearInterval(this.polling);
      },
    },
  };
  </script>
  
  <style scoped>

  /* Add your component-specific styles here */
  </style>
  