<template>
    <div class="widget card" ref="widgetRef">
      <div class="card-content">
        <div id="map-canvas" class="heatmap" style="height: 400px;"></div>
      </div>
    </div>
  </template>
  
  <script>
  import * as L from 'leaflet';
  import { coords } from './coords.js';
  import 'leaflet/dist/leaflet.css';
  import 'leaflet.heat'; // Import Leaflet.heat plugin
  
  export default {
    data() {
      return {
        addressPoints: [
       // [43.2526, 27.9093],  // Example coordinate 1
        // [43.2265, 27.9504], // Slightly different latitude
        // [43.2456, 27.9292], // Slightly different latitude and longitude
        // [43.2470, 27.9291],  // Example coordinate 1
        // [-37.851, 175.476], // Slightly different latitude
        // [-37.852, 175.477], // Slightly different latitude and longitude
        // [-37.853, 175.478], // Slightly different latitude and longitude
        // [-37.854, 175.479], // Slightly different latitude and longitude
        ]
      };
    },
    mounted() {
      this.addData();
      this.makeDraggable();
      this.initializeMap();
      
    },
    methods: {
  
      addData(){
        
        const dataPoints = coords.map(coord => [coord[Object.keys(coord)]['lat'], coord[Object.keys(coord)]['long']]);
        
        dataPoints.forEach(element => {
          this.addressPoints.push(element)        
        });
        
      },
  
  
  
  
    makeDraggable() {
        // Implement drag-and-drop functionality using native JavaScript or other libraries
        // Example:
        // this.$refs.widgetRef.addEventListener('mousedown', this.handleMouseDown);
      },
    initializeMap() {
    
      const map = L.map('map-canvas').setView([43.2456, 27.929292], 9);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
       
        //radius: 200, // Adjust the radius (default: 25)
        blur: 60,
        maxZoom: 11,
        scaleRadius: true,
        opacity: 0.8    // Adjust the blur (default: 15)
      }).addTo(map);
      
    
      console.log(this.addressPoints[0])
      const heatPoints = this.addressPoints.map(function(p) {
        return [p[0], p[1]];
      });
      L.heatLayer(heatPoints).addTo(map); // Use heatLayer method from Leaflet.heat plugin
      },
  
  
      // Add other methods as needed
    },
  
  };
  </script>
  
  <style scoped>
  /* Add your component-specific styles here */
  </style>
  