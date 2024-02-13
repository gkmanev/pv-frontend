<template>
    <b-card class="mb-4">
      <div class="mt-2">        
        <vue-google-heatmap :points="points"
                        :height="350"
                        :initial-zoom="8"
                        :mapTypeControl="false"
                        :lat="43.2456"
                        :lng="27.929292"   
                        :mapTypeId="'roadmap'"                                        
                        :options="mapOptions" />
      </div>
    </b-card>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {     
      points:[],
      mapOptions: {
        maxIntensity: 1,
        radius: 15,
        saturation: -300,
        styles: [
          // Paste the Silver style array here
          {
            elementType: "geometry",
            stylers: [{ color: "#f5f5f5" }]
          },
          // More style objects...
        ]
      },
    }
  },

  computed: {
    ...mapState(['all_devs'])
  },

  watch: {
    'all_devs': {
      handler(newValue) {
        this.points = newValue.map(el => ({
          lat: el.lat,
          lng: el.long,
          weight: parseFloat(el.power)
        }));
      },
      immediate: true,
    }
  },
}
</script>
