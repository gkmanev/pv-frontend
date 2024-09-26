<template>
    <b-card class="mb-4 line-chart">
      <div class="mt-4">
        <div v-if="loading"> <b-spinner label="Loading..."></b-spinner></div>
        <div v-else>
        <v-chart class="chart" height="450" width="100%" :option="option" autoresize/>
        </div>
      </div>
    </b-card>
  </template>
  
  <script>
  // import * as echarts from 'echarts';

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
  
//   var timeLineSet = function(value) {
//     // Create a Date object from the UTC date string
//     let date = new Date(value);

//     // Convert UTC date to local time
//     let hours = date.getHours();
//     let minutes = date.getMinutes();

//     // Format hours and minutes to ensure two digits
//     hours = ("0" + hours).slice(-2);
//     minutes = ("0" + minutes).slice(-2);

//     return `${hours}:${minutes}`;
// };
  

  
  export default {
    name: "StateOfCharge",
    components: {
      VChart
    },
  
    data() {
      
      return {
        loading: false,
        
        option: {
          title: {
            text: 'State of Charge', 
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
                    if (params && params.length) {
                    let tooltipContent = `<div class="tooltip-set" style="text-align:left; padding:0; margin:0; background-color: black; border-radius: 8px;">`;
                    //let cumulativeValue = 0;
                    let localTime;
                    // Loop over each series data point
                    params.forEach(param => {
                        //const socValue = param.data[1];
                        //cumulativeValue += socValue; // Add current SoC value to cumulative total
                        const utcTime = new Date(param.data[0]);
                        const options = {
                            day: '2-digit', 
                            month: '2-digit', 
                            year: '2-digit', 
                            hour: '2-digit', 
                            minute: '2-digit', 
                            hour12: false
                        };
                        localTime = utcTime.toLocaleString([], options).replace(',', ''); // Removing the comma   
                        tooltipContent += `
                        <div style="padding-right:15px;padding-left:15px;padding-top:3px;padding-bottom:3px;margin-bottom:0;border-bottom-left-radius: 8px;border-bottom-right-radius: 8px;">
                            <ul style="list-style-type: none; margin: 0; padding-left: 0;">
                            <li>
                                <div class="color-point" style="width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 5px; background-color: ${param.color};"></div>
                                <span style="color: gray;">${param.seriesName}: </span><span style="color: white;">${param.data[1]}</span>
                            </li>
                            </ul>
                        </div>`;
                    });
                    // Append cumulative SoC value at the end of the tooltip
                    // Add the total cumulative SoC to the tooltip content at the end
                    tooltipContent += `
                    <div style="color: white; padding: 10px; background-color: #333; border-top: 1px solid #999;">                                              
                        <strong>Time: </strong> <span style="color: white;">${localTime}</span>
                    </div>`;
                    tooltipContent += `</div>`;
                    return tooltipContent;
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
          margin:25,
          textStyle: {
              color: '#9a9a9a'
          },
      },
      axisLine: {
        show: true,
        onZero: true
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
              name: "Batt1",
              smooth: true,            
              stack: 'Total',
              lineStyle:{
                width:0
              },
              itemStyle: {
                  color: '#009BCB'
              },
              
              data: [],
              type: 'line',
              showSymbol: false,   
              areaStyle: {                
              },
              emphasis: {
                focus: 'series'
              },        
              
    },
    {
              name: "Batt2",
              smooth: true,            
              stack: 'Total',
              lineStyle:{
                width:0
              },
              itemStyle: {
                color: '#FFBC34'
              },
              
              data: [],
              type: 'line',
              showSymbol: false,   
              areaStyle: {},        
              
    },
    {
              name: "Batt1 Day Ahead",
              smooth: true,            
              stack: 'Dam',
              lineStyle:{
                width:1,
                type: 'dashed'
              },
              itemStyle: {
                  color: '#009BCB'
              },              
              sampling: 'average',
              data: [],
              type: 'line',
              showSymbol: false,   
              areaStyle: {opacity: 0.1},            
             
              
    },
    {
              name: "Batt2 Day Ahead",
              smooth: true,            
              stack: 'Dam',
              lineStyle:{
                width:1,
                type: 'dashed'
              },
              itemStyle: {
                  color: '#FFBC34'
              },
              sampling: "",
              data: [],
              type: 'line',
              
              showSymbol: false,   
              areaStyle: {
                opacity: 0.1

              }
              
                        
              },
    {
              name: "Stacked",
              smooth: true,             
              lineStyle:{
                width:2,               
              },
              itemStyle: {
                  color: 'yellow'
              },
              sampling: 'average',
              data: [],
              type: 'line',
              
              showSymbol: false,                        
                        
    },
    {
              name: "Batt1 Day Ahead Before",
              smooth: true,            
              //stack: 'Dam',
              lineStyle:{
                width:0,                
              },             
              sampling: 'average',
              data: [],
              type: 'line',
              showSymbol: false,  
             
              
    },
    {
              name: "Batt2 Day Ahead Before",
              smooth: true,            
             // stack: 'Dam',
              lineStyle:{
                width:0,               
              },                     
              sampling: 'average',
              data: [],
              type: 'line',
              showSymbol: false,             
              
    },



    ],

  }
        //end option
      };
    },
  
    mounted() { 
        
        this.displayData();

    //  const foundObject = this.all_devs.find(obj => obj.id === this.selectedDev);      
    //   if (foundObject)
    //   {
       
    //   }    
      //this.fetchData();
    },
  
    computed: {
      ...mapState(['dateRange','selectedDev', 'all_devs']),    
  
    },
    watch: {
   
      
      dateRange(newRange, oldRange) {
        if (newRange !== oldRange) {
         // this.option.series[0].data = []
         
          this.displayData();
          
        }
      },
      selectedDev(newDev, oldDev) {
        if (newDev !== oldDev) {
         // this.option.series[0].data = []
          const foundObject = this.all_devs.find(obj => obj.id === newDev);        
          this.lat = parseInt(foundObject.lat)        
          this.long = parseInt(foundObject.long)        
          this.displayData();
        }
      },   
  
    },
  
    methods: {

      lastRouteSegment() {
            const pathArray = this.$route.path.split('/');    
            return pathArray.pop() || pathArray[pathArray.length - 1]; // This handles non-trailing slash URLs
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
            // Create a new Date object for today's date (in local time)
            const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
            let start = new Date(today); // Initialized with today's date            
            let end = new Date(today);   // Initialized with today's date

            if (this.dateRange === 'today') {
                end.setHours(23, 59, 59); // Set end time to the end of the day                
                this.option.xAxis.splitNumber = 24; // 24 hours in a day

            } 
            else if (this.dateRange === 'dam') {
              start.setHours(0, 0, 0); // Start of today at 00:00
              end.setDate(end.getDate() + 2); // Move to the day after tomorrow
              end.setHours(1, 0, 0); // Set end time to 01:00 of the day after tomorrow             
              this.option.xAxis.splitNumber = 48; // 48 half-hour intervals in 24 hours

            } else if (this.dateRange === 'month') {
                start.setDate(1); // Start of the month
                end.setMonth(end.getMonth() + 1, 0); // Last day of the current month
                end.setHours(23, 59, 59); // Set end time to the end of the day
                this.option.xAxis.splitNumber = 12
               
                this.option.xAxis.splitNumber = end.getDate(); // Number of days in the month
            } else if (this.dateRange === 'year') {
                start.setMonth(0, 1); // Start of the year (January 1st)
                end.setFullYear(end.getFullYear(), 11, 31); // Last day of the year (December 31st)
                end.setHours(23, 59, 59); // Set end time to the end of the day
               
                this.option.xAxis.splitNumber = 12; // 12 months in a year
            }

            // Update xAxis min and max properties
            this.option.xAxis.min = start.getTime();
            
            this.option.xAxis.max = end.getTime();

            // If needed, force an update to the chart to apply these changes
            this.$refs.chart && this.$refs.chart.refresh(); 
    },

    async displayData() {
    // Clear the existing data
          this.option.series[0].data = [];
          this.option.series[1].data = [];
          this.option.series[2].data = [];
          this.option.series[3].data = [];
          this.option.series[4].data = [];
          this.option.series[5].data = [];
          this.option.series[6].data = [];

          let url_schedule = `http://85.14.6.37:16543/api/schedule/?date_range=dam`;
          let url = `http://85.14.6.37:16543/api/state_of_charge/?date_range=${this.dateRange}`;
          let url_cumulative = `http://85.14.6.37:16543/api/state_of_charge/?date_range=${this.dateRange}&cumulative=true`

          try {
              if (this.dateRange === "today") {
                  
                
                  const [response, cumulativeResponse] = await Promise.all([
                      axios.get(url, {
                          headers: {
                              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                          }
                      }),
                      axios.get(url_cumulative, {
                          headers: {
                              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                          }
                      })
                  ]);
                  this.processData(response.data);
                  this.processCumulative(cumulativeResponse.data)

              }
              else if (this.dateRange === "month"){

                const [response, cumulativeResponse] = await Promise.all([
                      axios.get(url, {
                          headers: {
                              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                          }
                      }),
                      
                      // axios.get(url_cumulative, {
                      //     headers: {
                      //         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                      //     }
                      // })
                  ]);
                  this.processData(response.data);
                  this.processCumulative(cumulativeResponse.data)

              } 
              else if (this.dateRange == 'year'){
                
                const [response, cumulativeResponse] = await Promise.all([
                      axios.get(url, {
                          headers: {
                              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                          }
                      }),
                      // axios.get(url_cumulative, {
                      //     headers: {
                      //         'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                      //     }
                      // })
                  ]);
                  this.processData(response.data);
                  this.processCumulative(cumulativeResponse.data)


              }
              
              
              else if (this.dateRange === "dam") {
                  // Fetch both url and url_schedule
                  url = `http://85.14.6.37:16543/api/state_of_charge/?date_range=today`;
                  const [response, scheduleResponse] = await Promise.all([
                      axios.get(url, {
                          headers: {
                              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                          }
                      }),
                      axios.get(url_schedule, {
                          headers: {
                              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                          }
                      })
                  ]);
                  this.processData(response.data);
                  this.processScheduleData(scheduleResponse.data);
              }
          } catch (error) {
              console.error('Error fetching data:', error);
          } finally {
              this.loading = false;
          }
    },
    //Today, Month, Year
    processData(data) {
        data.forEach(el => {
            let date = new Date(el.timestamp);
            // Convert UTC time to local time (UTC+3 adjustment)
            date = new Date(date.getTime() - (3 * 60 * 60 * 1000));
            
            if (el.devId === "batt-0001") {
                this.option.series[0].data.push([date.toISOString(), el.state_of_charge]);
            }
            if (el.devId === "batt-0002") {
                this.option.series[1].data.push([date.toISOString(), el.state_of_charge]);
            }
        });
        this.setAxisTimeRange();
    },

    processCumulative(stackData){    
      if (stackData){ 
        stackData.forEach(el => {
              let date = new Date(el.timestamp);
              // Convert UTC time to local time (UTC+3 adjustment)
              date = new Date(date.getTime() - (3 * 60 * 60 * 1000));          
                  this.option.series[4].data.push([date.toISOString(), el.cumulative_soc]);
            
          });
      }

    },

    processScheduleData(scheduleData) {
      let currentDate = new Date();
      scheduleData.forEach(el => {

                let date = new Date(el.timestamp);                         
                date = new Date(date.getTime() - (3 * 60 * 60 * 1000));
                
                if (el.devId === "batt1") {  
                    if (date <= currentDate){
                      this.option.series[5].data.push([date.toISOString(), el.soc]); 
                    }
                    else{
                      this.option.series[2].data.push([date.toISOString(), el.soc]); 
                    }
                                   
                                                
              
                    
                }             
                if (el.devId === "batt2") {
                  if (date <= currentDate){
                      this.option.series[6].data.push([date.toISOString(), el.soc]); 
                    }
                    else{
                      this.option.series[3].data.push([date.toISOString(), el.soc]); 
                    }
                   
               }
              this.setAxisTimeRange()
              
      })
    
  },    

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