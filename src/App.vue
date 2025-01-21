<template>
  <div id="main-wrapper">
    <router-view />
  </div>
</template>

<script>

// import { mapActions } from 'vuex';
import { pvAssets } from './ProjectMaping';
import { mapActions } from 'vuex';
export default {  
  name: 'App',
  data() {
    return {
      all: [],        
    }
  },
  components: {
    
  },
  created (){      
    this.fetchApi()
  },
  

  mounted(){
           
  },
  methods:{
    ...mapActions(['allDevsCreation']),

    fetchApi(){
      fetch('http://209.38.208.230:8000/api/last-n-unique/')
        .then(response => response.json())
        .then(data => {
          this.createAllDevs(data);
          // Process the data as needed
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    
    createAllDevs(data) {        
   
      const mergedData = pvAssets.map(item => {
      const matchedData = data.find(c => c.installation_name === item.farm);
        return {
        ...item,
        power: matchedData ? matchedData.signal_value : null, // Handle undefined matchedData
        online: matchedData ? "online" : "offline" 
        };
        });    
    this.all = mergedData;
    this.allDevsCreation(this.all);

    },

    },

}
</script>

<style>

</style>
