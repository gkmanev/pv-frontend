<template>
    <b-row class="justify-content-start">  
      <b-col v-if="isDevSelected" cols="12">        
            <AwesomeCards />
      </b-col>      
        <b-col cols="4">            
            <SelectComponent />
        </b-col>
        <b-col cols="3">            
            <RangeComponent class="mb-4" />          
        </b-col>
        <b-col cols="12">
            <LineChart />
        </b-col>  
        <b-col cols="12">
            <PriceChart />
        </b-col>  
    </b-row>
  </template>
  <script>
  // -----------------------------------------
  // Import Components Here
  // -----------------------------------------
  
  import SelectComponent from "../dashboard-components/select-component/SelectComponent";
  import RangeComponent from "../dashboard-components/range-component/RangeComponent";
  import LineChart from "../dashboard-components/echarts/LineChart";
  import PriceChart from "../dashboard-components/echarts/PriceChart"; 
  import AwesomeCards from "../dashboard-components/awesome-cards/AwesomeCards";  
  import { mapState } from 'vuex';
  
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
   
    LineChart,
    SelectComponent,    
    RangeComponent,
    PriceChart,
    AwesomeCards
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