<template>
  <div id="main-wrapper">
    <router-view />
  </div>
</template>

<script>

import axios from 'axios';
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
    this.all = pvAssets;
    this.allDevsCreation(this.all); 

    this.fetchApi()
  },
  

  mounted(){
           
  },
  methods:{
    ...mapActions(['allDevsCreation']),

    fetchApi() {
      let responseData = [];
      axios.get('http://209.38.208.230:8000/api/last-n-unique/')
      .then(response => {     
        responseData = response.data;       
      })
      .catch(error => {
      console.error('Error fetching data:', error);
      })
      .finally(() => {
        this.createAllDevs(responseData);
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
