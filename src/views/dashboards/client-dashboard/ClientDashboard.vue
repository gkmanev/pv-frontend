<template>
    <b-row class="justify-content-start">  
      
        <b-col cols="4">            
            <SelectComponent />
        </b-col>
        <b-col cols="3">            
            <RangeComponent class="mb-4" />          
        </b-col>  
        <b-col class="mt-3" v-if="isDevSelected" cols="12">          
            <StateOfCharge />
        </b-col>     
        <b-col class="mt-3" v-if="isDevSelected" cols="12">          
          <InvertorPower />
        </b-col> 
        <b-col class="mt-3" v-if="isDevSelected" cols="12">          
          <PowerFlow />
        </b-col>    
        <b-col cols="12" v-if="isDevSelected" class="mt-3">
            <PriceChart />
        </b-col>    
        <!--
         <b-col cols="8">
            <LineChart />
        </b-col>
        <b-col cols="4">
          <CustomProgress />
          <CorelationsHeat />
        </b-col>
        
        <b-col cols="12">
            <WeatherChart />
        </b-col>   
        <b-col cols="12">
            <WeatherChartClouds />
        </b-col>    -->
    </b-row>
  </template>
  <script>
  // -----------------------------------------
  // Import Components Here
  // -----------------------------------------
  
  import SelectComponent from "../dashboard-components/select-component/SelectComponent";
  import RangeComponent from "../dashboard-components/range-component/RangeComponent";
  import StateOfCharge from "../dashboard-components/echarts/StateOfCharge";  
  import PriceChart from "../dashboard-components/echarts/PriceChart"; 
  import InvertorPower from "../dashboard-components/echarts/InvertorPower.vue";
  import PowerFlow from '../dashboard-components/echarts/PowerFlow.vue';
  // // import AwesomeCards from "../dashboard-components/awesome-cards/AwesomeCards";  
  // import CustomProgress from "../dashboard-components/progress-cards/CustomProgress.vue";
  import { mapState } from 'vuex';
//   import SalesCard from "../dashboard-components/sales-card/SalesCard.vue";
//   import WeatherChartClouds from "../dashboard-components/echarts/WeatherChartClouds.vue";
// import CorelationsHeat from "../dashboard-components/echarts/CorelationsHeat.vue";



  
  // -----------------------------------------
  // Export Here
  // -----------------------------------------
  export default {
    name: "ClientDashboard",
    data: () => ({
      title: "ClientDashboard",
      isDevSelected: false      
      
    }),
    components: {
   
    // LineChart,
    SelectComponent,    
    StateOfCharge,
    InvertorPower,
    PowerFlow,
    RangeComponent,
    PriceChart,
   // AwesomeCards,
   // WeatherChart,
   // CustomProgress,
   // SalesCard,
    // WeatherChartClouds,
    // CorelationsHeat
    
},

  created(){
    this.checkSelectedDev()
  },

  computed: {
      ...mapState(['selectedDev']),
    },


  methods: {
    checkSelectedDev(){
      if(this.selectedDev){
        this.isDevSelected = true
      }
      else{
        this.isDevSelected = false
      }
    } 
  },
  watch: {
    selectedDev(newDev, oldDev) {
      if (newDev !== oldDev) {
        this.isDevSelected = true;
      }
    },

  },

    };
  </script>

<style scoped>

/* Add your component-specific styles here */
</style>