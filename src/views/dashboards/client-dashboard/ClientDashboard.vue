<template>
    <b-row class="justify-content-start">        
        <b-col cols="4">            
            <SelectComponent />
        </b-col>
        <b-col cols="3">            
            <RangeComponent class="mb-4"  @filter="handleFilter" />          
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
  
  // -----------------------------------------
  // Export Here
  // -----------------------------------------
  export default {
    name: "ClientDashboard",
    data: () => ({
      title: "ClientDashboard",
      
      
    }),
    components: {
   
    LineChart,
    SelectComponent,    
    RangeComponent,
    PriceChart
},
    methods: {

  },
    created() {
      this.handleFilter('today')
       
    },
    };
  </script>