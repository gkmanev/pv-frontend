<template>
    <div class="widget card" ref="widgetRef">
      <div class="card-content">
        <div id="map-canvas" class="heatmap" style="height: 400px;"></div>
      </div>
    </div>
  </template>
  
  <script>
  import * as L from 'leaflet';
//   import { coords } from './coords.js';
  import 'leaflet/dist/leaflet.css';
  import 'leaflet.heat'; // Import Leaflet.heat plugin
  import { mapState } from 'vuex';
  
  export default {
    data() {
      return {
        polling:null,
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
            this.addressPoints = []
            this.polling = setInterval(async () => {
                await this.addData();        
           
            }, 15000);
        },

        normalizeValues(val){
            
            return val/100
        },
        
  
        addData(){        
        this.addressPoints = []
        this.all_devs.forEach(el=>{
            let pow = parseFloat(el.power)
            if(!isNaN(pow)){
                if(el.power >= 0 && el.lat){
                    const singlePoint = [el.lat,el.long,this.normalizeValues(el.power)]
                    this.addressPoints.push(singlePoint);
                }
            }
        })  
        // Clear existing heat layer
        if (this.heatLayer) {
            this.map.removeLayer(this.heatLayer);
        }
        // Create new heat layer with updated points
        const heatPoints = this.addressPoints.map(function(p) {
            return [p[0], p[1], p[2]];
        });
        this.heatLayer = L.heatLayer(heatPoints, {
            radius: 25, // Adjust the radius (default: 25)
            blur: 25,
            maxZoom: 11,
            scaleRadius: true,
            opacity: 0.8    // Adjust the blur (default: 15)
        }).addTo(this.map);      
        },
  
  
  
 
    initializeMap() {
    
        this.map = L.map('map-canvas').setView([43.2456, 27.929292], 9);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(this.map);
        this.addData(); // Initialize with initial data
      },
  
  
      // Add other methods as needed
    },
    beforeDestroy () {
         clearInterval(this.polling)
    },
  
  };
  </script>
  
  <style scoped>
  /* Add your component-specific styles here */
  </style>
  