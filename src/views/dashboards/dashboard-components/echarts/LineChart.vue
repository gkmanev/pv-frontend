<template>
  <b-card class="mb-4">
    <div class="mt-4">
      <v-chart class="chart" height="450" :option="option" @mouseover="getDataSubset" autoresize/>
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
  GridComponent,
  DataZoomComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'


use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  ToolboxComponent,
  GridComponent,
  LineChart,
  CanvasRenderer,
  DataZoomComponent,
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

var tooltipDisplay = ''

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
          text: 'Customer Power',    
          left:80,
          top:50,    
          textStyle: {
            fontSize: 16,
            color:'#b2b9bf',
            fontFamily: 'Arial',
            fontWeight: 'normal'
          },
        },
        legend: {
          orient: 'vertical',
          padding:[-500,100,0,0],
          //selected:{'sm-0002':false,'sm-0004':false,'sm-00024':false,'sm-0020':false,'sm-0010':false,'sm-0011':false,'sm-0015':false,'sm-0030':false,'sm-0016:':false,'sm-0025':false,'sm-0017':false,'sm-0018':false,'sm-0008':false,'sm-0009':false}
        },
        tooltip: {
          backgroundColor: '', // Set your desired background color
          trigger: 'axis',
          borderWidth: 0, // Set border width to 0 to remove the border
          shadowBlur: 0, // Set shadow blur to 0 to remove the shadow
          shadowOffsetX: 0, // Set shadow offset X to 0
          shadowOffsetY: 0, // Set shadow offset Y to 0
          shadowColor: 'transparent', // Set shadow color to transparent
          formatter: () => {
              return tooltipDisplay;
          },
         
        
        },
 

  grid: {
    left: '5%',
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
  dataZoom: [{

      top: 0,
      height: 30,
      handleIcon: "pin",
      handleSize: "75%",
      // handleStyle: {
      //          color: "#9a9a9a",
      //          borderColor: "rgba(255, 255, 255, 1)",
      //          opacity: 0.5
      //  },

      show: true,

      // backgroundColor:'#9a9a9a',
        //  fillerColor: "rgba(255, 255, 255, 0.1)",
          dataBackground: {
              areaStyle: {
                  color: "#9a9a9a"
                      }
                  },
      start: 0,
      end: 100
      },

     ],
  seriesData: [],
  series:[]
}
      //end option
    };
  },

  mounted() {
    this.fetchData();

  },

  computed: {
    ...mapState(['dateRange','selectedDev','checkedDevs']),

    lastRouteSegment() {
    const pathArray = this.$route.path.split('/');    
    return pathArray.pop() || pathArray[pathArray.length - 1]; // This handles non-trailing slash URLs
  },
  filteredSeriesData() {
      return this.seriesData.filter(series => {
        return this.checkedDevs[series.name]; // Assuming checkedDevs is an object with device names as keys
      });
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
    checkedDevs(newRow, oldRow) {
       if (newRow !== oldRow) {
       // this.option.legend.selected = {'sm-0002':false,'sm-0004':false,'sm-00024':false,'sm-0020':false,'sm-0010':false,'sm-0011':false,'sm-0015':false,'sm-0030':false,'sm-0016:':false,'sm-0025':false,'sm-0017':false,'sm-0018':false,'sm-0008':false,'sm-0009':false}
        
              
        let objArr = this.checkedDevs.reduce((acc, curr) => {
          // Extract the key and value from each object in arr1
          let key = Object.keys(curr)[0];
          let value = curr[key];
          // Add the key-value pair to the accumulator object
          acc[key] = value;
          return acc;
        }, {});
        
        this.option.legend.selected = objArr
        this.fetchData();
       }
    
     },

  },

  methods: {

   
    getDataSubset(params) {

      if(params.seriesType == 'line'){
        if (params.data){
          tooltipDisplay = '<div class="tooltip-set" style="text-align:left; padding:0; margin:0; background-color: black; border-radius: 8px;">' +
                    '<div style="vertical-align: middle; color: white; padding-left: 10px;">' + params.seriesName + '</div>' +
                    '<div style="padding-right:15px;padding-left:15px;padding-top:3px;padding-bottom:3px;margin-bottom:0;background-color: #272b34;border-bottom-left-radius: 8px;border-bottom-right-radius: 8px;">' +
                      '<ul style="list-style-type: none; margin: 0; padding-left: 0;">' +
                        '<li>' +
                          '<div class="color-point" style="width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 5px; background-color: ' + params.color + ';"></div>' +
                          '<span style="color: gray;">Power: </span><span style="color: white;">' + params.data[1] + '</span>'  +
                        '</li>' +
                      '</ul>' +
                    '</div>' +
                  '</div>';
        }
      }   

    },

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
          console.log(urlForecast)
        }
      }
      try {
        
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
                return {
                  ...baseSeriesConfig,
                  itemStyle: {color:'#009efb'},
                }
            }
            });
            // Check if lastRouteSegment is not 'entra' and forecastData is not empty
            if (this.lastRouteSegment !== 'entra' && forecastData && forecastData.length > 0) {
                // Add another series for forecastData
                this.option.title.text = "Power kW"
                seriesData.push({
                    name: 'Forecast',
                    type: "line",
                    sampling: "lttb",
                    showSymbol: false,
                    
                    connectNulls: false,
                    lineStyle: { width: 1,type: 'dotted', },
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
                    
   
    }
  }

};


</script>

<style scoped>



.chart {
  height: 450px;
}
</style>