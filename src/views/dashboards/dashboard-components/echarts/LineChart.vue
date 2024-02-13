<template>
  <b-card class="mb-4">
    <div class="mt-4">
      <v-chart class="chart" height="250" :option="option" />
    </div>
  </b-card>
</template>

<script>

import VChart from "vue-echarts";
import axios from 'axios';
import { mapState } from 'vuex';
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
  LineChart,
  CanvasRenderer
])

var timeLineSet = function(value) {
  // Create a Date object from the UTC date string
  let date = new Date(value);

  // Get UTC hours and minutes
  let hours = date.getUTCHours();
  let minutes = date.getUTCMinutes();

  // Format hours and minutes to ensure two digits
  hours = ("0" + hours).slice(-2);
  minutes = ("0" + minutes).slice(-2);

  return `${hours}:${minutes}`;
}



export default {
  name: "HelloWorld",
  components: {
    VChart
  },

  data() {
    return {
      created_date_or_created: 'created_date',      
      option: {
  title: {
    text: 'Smartmeters Accumulated Power',
    textStyle: {
      fontSize: 16,
      color:'#b2b9bf',
      fontFamily: 'Arial',
      fontWeight: 'normal'
    },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  // legend: {
  //   data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine']
  // },

  grid: {
    left: '3%',
    right: '1%',
    bottom: '13%',
    containLabel: false
  },
  xAxis: 
    {
      type: 'time',
      axisLabel: {
        rotate:40,
        margin:20,
        textStyle: {
            color: '#9a9a9a'
        },
    },
    axisLine: {
      show: true,
    },

      boundaryGap: false,    
      
    },
  
  yAxis: [
    {
      type: 'value',
      splitLine: {
        show: false // Set this property to false to hide horizontal grid lines
      }
    },
    
  ],
  series:[]
}
      //end option
    };
  },

  mounted() {
    this.fetchData();

  },

  computed: {
    ...mapState(['dateRange','selectedDev']),

    lastRouteSegment() {
    const pathArray = this.$route.path.split('/');    
    return pathArray.pop() || pathArray[pathArray.length - 1]; // This handles non-trailing slash URLs
  }
  },
  watch: {
    
    dateRange(newRange, oldRange) {
      if (newRange !== oldRange) {
        this.fetchData();
      }
    },
    selectedDev(newDev, oldDev) {
      if (newDev !== oldDev) {
        this.fetchData();
      }
    },

  },

  methods: {

    setHourlyAxisLabels() {
      // Update xAxis axisLabel formatter and interval
      this.option.xAxis.axisLabel = {
        ...this.option.xAxis.axisLabel, // Preserve existing axisLabel properties
        formatter: function(value) {
          const date = new Date(value);
          return `${date.getHours()}:00`;
        }
      };

      this.option.xAxis.interval = 3600 * 1000; // One hour in milliseconds

    },  

    setAxisTimeRange() {
        const todayUTC = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate()));
        let start = new Date(todayUTC); // Initialized with todayUTC
        let end = new Date(todayUTC); // Initialized with todayUTC

        if (this.dateRange === 'today') {
          end.setUTCHours(23, 0, 0);
          this.option.xAxis.axisLabel.formatter = timeLineSet//'{HH}:{mm}'
          this.option.xAxis.splitNumber = 23
        } else if (this.dateRange === 'month') {
          start.setUTCDate(1); // Start of the month
          end.setUTCMonth(end.getUTCMonth() + 1, 0); // Last day of the month
          end.setUTCHours(23, 0, 0);
          this.option.xAxis.axisLabel.formatter = []//'{HH}:{mm}'
          this.option.xAxis.splitNumber = 30
        } else if (this.dateRange === 'year') {
          start.setUTCMonth(0, 1); // Start of the year
          end.setUTCFullYear(end.getUTCFullYear() + 1, 0, 0); // Last day of the year
          end.setUTCHours(23, 0, 0);
          this.option.xAxis.axisLabel.formatter = []//'{HH}:{mm}'
          this.option.xAxis.splitNumber = 12
        }

        // Update xAxis min and max properties
        this.option.xAxis.min = start.getTime();
        this.option.xAxis.max = end.getTime();
        // Additional logic to update the chart as necessary
    },


    fetchData() {
      if(this.dateRange == 'today')
      {
        this.created_date_or_created = 'created_date'
      }
      else{
        this.created_date_or_created = 'created'
      }
      let url = ''
      let urlForecast = ''
      
      if (this.lastRouteSegment == 'entra')
      {
        url = `http://85.14.6.37:16455/api/posts/?date_range=${this.dateRange}`    
        //config chart

      }
      else{
        if(this.selectedDev)
        {
          url = `http://85.14.6.37:16455/api/posts/?date_range=${this.dateRange}&dev=${this.selectedDev}`
          urlForecast = `http://209.38.208.230:8000/api/post_forecast?date_range=${this.dateRange}&dev=${this.selectedDev}F`
        }
      }
      try{
        
        let requestOne = []
        if(url){
          requestOne = axios.get(url);     
        }
        let requestTwo = [] 
        if (urlForecast)
        {
          requestTwo = axios.get(urlForecast); 
        }
        
        axios.all([requestOne, requestTwo]).then(axios.spread((...responses) => {
          
          let devData = responses[0].data
          let forecastData = responses[1].data
          console.log(devData,forecastData)
          if(devData){
            const devIds = Array.from(new Set(devData.map((item) => item.devId)));  
            const seriesData = devIds.map((devId) => {
              const baseSeriesConfig = {
                name: devId,
                type: "line",
                sampling: "lttb",
                showSymbol: false,
                connectNulls: false,
                lineStyle: { width: 1 },
                data: devData
                    .filter((item) => item.devId === devId)
                    .map((item) => [item[this.created_date_or_created], item.value]),
            };
            if (this.lastRouteSegment == 'entra') {
                return {
                    ...baseSeriesConfig,
                    emphasis: { focus: 'series' },
                    stack: "Total",
                    areaStyle: {},
                };
            } else {
                return baseSeriesConfig;
            }
            });
            // Check if lastRouteSegment is not 'entra' and forecastData is not empty
            if (this.lastRouteSegment !== 'entra' && forecastData && forecastData.length > 0) {
                // Add another series for forecastData
                seriesData.push({
                    name: 'Forecast',
                    type: "line",
                    sampling: "lttb",
                    showSymbol: false,
                    connectNulls: false,
                    lineStyle: { width: 1 },
                    data: forecastData.map((item) => [item[this.created_date_or_created], item.value]),
                });
            }

            this.setAxisTimeRange()          
            this.option.series = seriesData
          }


        })) 

      }catch(error){
        console.log(error)
      }
      
      // // Make an API call to fetch data    
      // if(url){  
      //   axios.get(url)
      //     .then(response => {
      //       const apiData = response.data;          
      //       // Extract devIds and created_date
      //       const devIds = Array.from(new Set(apiData.map((item) => item.devId)));    

      //       const seriesData = devIds.map((devId) => {
      //         if(this.lastRouteSegment == 'entra')
      //         {
      //           return {
      //             name: devId,
      //             type: "line",
      //             "sampling": "lttb",
      //             "showSymbol": false,
      //             "connectNulls": false,
      //             "lineStyle": {
      //               "width": 1
      //             },
      //             emphasis: { focus: 'series' },
      //             "stack": "Total",
      //             "areaStyle": {},
      //             data: apiData
      //               .filter((item) => item.devId === devId)                
      //               .map((item) => {                        
      //                 return [item[this.created_date_or_created], item.value];
      //               }),
      //           };
      //         }
      //         //client chart config
      //         else{
      //           return {
      //             name: devId,
      //             type: "line",
      //             "sampling": "lttb",
      //             "showSymbol": false,
      //             "connectNulls": false,
      //             "lineStyle": {
      //               "width": 1
      //             },
                  
      //             data: apiData
      //               .filter((item) => item.devId === devId)                
      //               .map((item) => {                        
      //                 return [item[this.created_date_or_created], item.value];
      //               }),
      //           };
      //         }
      //       });
      //       this.setAxisTimeRange()          
      //       this.option.series = seriesData
              
          

      //     })
      //     .catch(error => {
      //       console.error('Error fetching data:', error);
      //     });
      //   }
    }
  }

};


</script>

<style scoped>
.chart {
  height: 450px;
}
</style>