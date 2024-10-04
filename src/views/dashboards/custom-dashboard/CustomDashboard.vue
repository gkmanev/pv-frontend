<template>
  <div>
    <b-card class="mb-4">
      <b-row class="justify-content-start"> 
        <b-col cols="4">
          <div class="battery-container d-flex justify-content-between"> <!-- Use d-flex to arrange items horizontally -->
            <BatteryChart class="battery-chart" style="flex: 1;" />
            <BatteryGauge class="battery-gauge" style="flex: 1;" />
          </div>  
        </b-col> 
        <b-col cols="4">
        </b-col>
        <b-col cols="4">
          <DigiClock />
        </b-col>
      </b-row>
  </b-card>
    <b-row class="mb-4"> 
      <b-col cols="3">            
        <RangeComponent @filter="handleFilter" />          
      </b-col>
    </b-row>
    <b-row>
        <b-col cols="12">
            <StateOfCharge />
        </b-col>
        <b-col cols="12">
            <InvertorPower />
        </b-col>
        <b-col cols="12">
            <PowerFlow />
        </b-col>
        <b-col cols="12">
            <PriceChart />
        </b-col>
    </b-row>    
  </div>  
  
  </template>
  <script>
  // -----------------------------------------
  // Import Components Here
  // -----------------------------------------
  // import AwesomeCards from "../dashboard-components/awesome-cards/AwesomeCards";  
  import RangeComponent from "../dashboard-components/range-component/RangeComponent";
  import InvertorPower from "../dashboard-components/echarts/InvertorPower.vue";
  import PriceChart from "../dashboard-components/echarts/PriceChart";
  // import TableChart from "../dashboard-components/echarts/TableChart";

  // import GridNodes from "../dashboard-components/echarts/GridNodes";
  // import MapCard from '../dashboard-components/echarts/MapCard.vue';
  import StateOfCharge from '../dashboard-components/echarts/StateOfCharge.vue';
  import PowerFlow from '../dashboard-components/echarts/PowerFlow.vue';

import BatteryChart from "../dashboard-components/echarts/BatteryChart.vue";
import BatteryGauge from "../dashboard-components/echarts/BatteryGauge.vue";
import DigiClock from "../dashboard-components/echarts/DigiClock.vue";

  //import HighChartTest from '../dashboard-components/echarts/HighChartTest.vue';

  


  
  // -----------------------------------------
  // Export Here
  // -----------------------------------------
  export default {
    name: "ModernDashboard",
    data: () => ({
      title: "ModernDashboard",
      show:false,
      // Month Table
      month1: 0,
      monthoptions1: [
        { text: "Monthly", value: 0 },
        { text: "Daily", value: 1 },
        { text: "Weekly", value: 2 },
        { text: "Yearly", value: 3 },
      ],
      // top selling
      selling1: 0,
      sellingoptions1: [
        { text: "Monthly", value: 0 },
        { text: "Daily", value: 1 },
        { text: "Weekly", value: 2 },
        { text: "Yearly", value: 3 },
      ],
      // weather report
      weather1: 0,
      weatheroptions1: [
        { text: "Today", value: 0 },
        { text: "Weekly", value: 1 },
      ],
    }),
    components: {
    // AwesomeCards,    
    RangeComponent,
    InvertorPower,
    //HighChartTest,
    PriceChart,
    //TableChart,   
    //MapCard,
    //GridNodes,
    StateOfCharge,
    PowerFlow,
    BatteryChart,
    BatteryGauge,
    DigiClock
    //LineChart
    
},
    methods: {
        handleFilter(period) {
        // Perform API request based on the selected period (today, week, month)
        // Update your content based on the API response
        console.log(`Filtering content for ${period}`);
        // Make API request here and update content
        },
  },
    created() {
        // Trigger "today" filter when the component is created
        this.handleFilter('today');
    },
    };
  </script>

<style scoped>
.battery-container {
  display: flex;
  justify-content: space-between; /* Align items next to each other */
  max-height: 220px;
}
.battery-chart{
  max-width: 120px;

}
</style>