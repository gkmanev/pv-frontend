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
    this.createAllDevs()    
  },
  

  mounted(){
           
  },
  methods:{
    ...mapActions(['allDevsCreation']),
    
    createAllDevs() {        
        // Map device IDs to device objects, incorporating coords data
        this.all = pvAssets.map(id => {          
            return {
            id: id.PPE,
            online: 'offline', // Default state
            farm: id.farm,
            latitude: id.latitude,
            longitude: id.longitude,
            production: 0
            };           
        });
        this.allDevsCreation(this.all);

    },

    },

}
</script>

<style>

</style>
