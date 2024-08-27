<template>
    <b-card class="mb-4 line-chart">
      <div class="mt-4">
        <v-chart class="chart" height="450" width="100%" :option="option" autoresize/>
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

    // Convert UTC date to local time
    let hours = date.getHours();
    let minutes = date.getMinutes();

    // Format hours and minutes to ensure two digits
    hours = ("0" + hours).slice(-2);
    minutes = ("0" + minutes).slice(-2);

    return `${hours}:${minutes}`;
};
  
    
  export default {
    name: "StateOfCharge",
    components: {
      VChart
    },
  
    data() {
      return {
        lat: null,
        long: null,
        option: {
          title: {
            text: 'Invertor Power', 
            left: 'center',   
            textStyle: {
              fontSize: 16,
              color:'#b2b9bf',
              fontFamily: 'Arial',
              fontWeight: 'normal'
            },   
  
          },
          legend: {
            orient: 'horizontal',
            padding:[-500,100,0,0],
            //selected:{'sm-0002':false,'sm-0004':false,'sm-00024':false,'sm-0020':false,'sm-0010':false,'sm-0011':false,'sm-0015':false,'sm-0030':false,'sm-0016:':false,'sm-0025':false,'sm-0017':false,'sm-0018':false,'sm-0008':false,'sm-0009':false}
          },
          tooltip: {
                trigger: 'axis', // Tooltip triggered by axis, not just data points
                axisPointer: {
                    type: 'line', // Shows a line to indicate the axis position
                    label: {
                    backgroundColor: '#6a7985' // Optional: Customize the label background color
                    }
                },
                backgroundColor: '', // Your custom background color
                borderWidth: 0, // Set border width to 0 to remove the border
                shadowBlur: 0, // Set shadow blur to 0 to remove the shadow
                shadowOffsetX: 0, // Set shadow offset X to 0
                shadowOffsetY: 0, // Set shadow offset Y to 0
                shadowColor: 'transparent', // Set shadow color to transparent
                formatter: (params) => {
                    // Assuming params is an array of series data because trigger is 'axis'
                    if (params && params.length) {
                    const firstParam = params[0];
                    if (firstParam.seriesType === 'line' && firstParam.data) {
                        return `
                        <div class="tooltip-set" style="text-align:left; padding:0; margin:0; background-color: black; border-radius: 8px;">
                            <div style="vertical-align: middle; color: white; padding-left: 10px;">
                            ${firstParam.seriesName}
                            </div>
                            <div style="padding-right:15px;padding-left:15px;padding-top:3px;padding-bottom:3px;margin-bottom:0;background-color: #272b34;border-bottom-left-radius: 8px;border-bottom-right-radius: 8px;">
                            <ul style="list-style-type: none; margin: 0; padding-left: 0;">
                                <li>
                                <div class="color-point" style="width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 5px; background-color: ${firstParam.color};"></div>
                                <span style="color: gray;">Invertor Power: </span><span style="color: white;">${firstParam.data[1]}</span>
                                </li>
                                <li>
                                <span style="color: gray;">Time: </span><span style="color: white;">${firstParam.data[0].split(":00Z")[0]}</span>
                                </li>
                            </ul>
                            </div>
                        </div>`;
                    }
                    }
                    return ''; // Return an empty string if there's no data to show
                }
    },
   
  
    grid: {
      bottom: '25%',
      left:'10%',
      containLabel: false
    },
    xAxis: 
      {
        type: 'time',
        axisLabel: {
          rotate:40,
          margin:5,
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
        height: 20,      
        handleSize: "75%",
        show: true,
        dataBackground: {
          areaStyle: {
            color: "#9a9a9a"
          }
        },
        start: 0,
        end: 100
        },
       ],
    
    series:[
    {
              name: "Invertor Power",
              smooth: true,            
              
              lineStyle:{
                width:1
              },
              itemStyle: {
                  color: '#39c449'
              },
              sampling: 'average',
              data: [],
              type: 'line',
              showSymbol: false,           
              
          },
    ]
  }
        //end option
      };
    },
  
    mounted() {    
      const foundObject = this.all_devs.find(obj => obj.id === this.selectedDev); 
      if (foundObject)
      {
        this.lat = foundObject.lat
        this.long = foundObject.long
      }    
      this.fetchData();
    },
  
    computed: {
      ...mapState(['dateRange','selectedDev', 'all_devs']),    
  
    },
    watch: {
   
      
      dateRange(newRange, oldRange) {
        if (newRange !== oldRange) {
          this.option.series[0].data = []
          this.fetchData();
        }
      },
      selectedDev(newDev, oldDev) {
        if (newDev !== oldDev) {
          this.option.series[0].data = []
          const foundObject = this.all_devs.find(obj => obj.id === newDev);        
          this.lat = parseInt(foundObject.lat)        
          this.long = parseInt(foundObject.long)        
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
            // Create a new Date object for today's date (in local time)
            const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
            let start = new Date(today); // Initialized with today's date
            let end = new Date(today);   // Initialized with today's date

            if (this.dateRange === 'today') {
                end.setHours(23, 59, 59); // Set end time to the end of the day
                this.option.xAxis.axisLabel.formatter = timeLineSet; // Assuming timeLineSet converts to local time
                this.option.xAxis.splitNumber = 24; // 24 hours in a day
            } else if (this.dateRange === 'month') {
                start.setDate(1); // Start of the month
                end.setMonth(end.getMonth() + 1, 0); // Last day of the current month
                end.setHours(23, 59, 59); // Set end time to the end of the day
                this.option.xAxis.axisLabel.formatter = (value) => {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}`; // Format as "Day/Month"
                };
                this.option.xAxis.splitNumber = end.getDate(); // Number of days in the month
            } else if (this.dateRange === 'year') {
                start.setMonth(0, 1); // Start of the year (January 1st)
                end.setFullYear(end.getFullYear(), 11, 31); // Last day of the year (December 31st)
                end.setHours(23, 59, 59); // Set end time to the end of the day
                this.option.xAxis.axisLabel.formatter = (value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getFullYear()}`; // Format as "Month/Year"
                };
                this.option.xAxis.splitNumber = 12; // 12 months in a year
            }

            // Update xAxis min and max properties
            this.option.xAxis.min = start.getTime();
            this.option.xAxis.max = end.getTime();

            // If needed, force an update to the chart to apply these changes
            this.$refs.chart && this.$refs.chart.refresh(); 
    },

  
      fetchData() {  
       
        let url = `http://85.14.6.37:16543/api/state_of_charge/?date_range=today`
        
        if(url){
          
          axios
          .get(url)
          .then((response) => response.data.forEach(el => {
            
            this.option.series[0].data.push([el.timestamp, el.invertor_power])
            this.setAxisTimeRange()
          })
          
          
          
          )      
          .catch((error) => console.log(error))      
        }
       
    }
    }
  
  };
  
  
  </script>
  
  <style scoped>
  
  
  
  .line-chart {
    height: 480px;
  }
  .chart {
    height: 400px;
  }
  </style>