<template>
    <b-row class="justify-content-start">        
        <b-col cols="12">        
            <AwesomeCards />
            <SelectComponent />
            <LineChart />
        </b-col>
  
    </b-row>
  </template>
  <script>
  // -----------------------------------------
  // Import Components Here
  // -----------------------------------------
  import AwesomeCards from "../dashboard-components/awesome-cards/AwesomeCards";  
  import SelectComponent from "../dashboard-components/select-component/SelectComponent";
  // import RangeComponent from "../dashboard-components/range-component/RangeComponent";
  import LineChart from "../dashboard-components/echarts/LineChart";

  // import PriceChart from "../dashboard-components/echarts/PriceChart"; 

  


  
  // -----------------------------------------
  // Export Here
  // -----------------------------------------
  export default {
    name: "ClientDashboard",
    data: () => ({
      title: "ClientDashboard",
      
      
    }),
    components: {
    AwesomeCards,
    LineChart,
    SelectComponent,    
},
    methods: {

  },
    created() {
       
    },
    };
  </script>