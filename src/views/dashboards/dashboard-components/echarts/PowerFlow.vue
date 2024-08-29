<template>
    <b-card class="mb-4 bar-chart">
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
  import { BarChart } from 'echarts/charts'
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
    BarChart,
    CanvasRenderer,
    DataZoomComponent,
  ]);

  // Copy this function into your second component or a utility file
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
    name: "PowerFlow",
    components: {
      VChart
    },
    data() {
      return {
        lat: null,
        long: null,
        option: {
          title: {
            text: 'Power Flow',
            left: 'center',
            textStyle: {
              fontSize: 16,
              color: '#b2b9bf',
              fontFamily: 'Arial',
              fontWeight: 'normal'
            },
          },
          legend: {
            orient: 'horizontal',
            padding: [-500, 100, 0, 0],
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow', // 'shadow' pointer is commonly used for bar charts
              label: {
                backgroundColor: '#6a7985'
              }
            },
            backgroundColor: '',
            borderWidth: 0,
            shadowBlur: 0,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: 'transparent',
            formatter: (params) => {
                    if (params && params.length) {
                    let tooltipContent = `<div class="tooltip-set" style="text-align:left; padding:0; margin:0; background-color: black; border-radius: 8px;">`;
                    
                    // Loop over each series data point
                    params.forEach(param => {
                        tooltipContent += `
                        <div style="vertical-align: middle; color: white; padding-left: 10px;">
                            ${param.seriesName}
                        </div>
                        <div style="padding-right:15px;padding-left:15px;padding-top:3px;padding-bottom:3px;margin-bottom:0;background-color: #272b34;border-bottom-left-radius: 8px;border-bottom-right-radius: 8px;">
                            <ul style="list-style-type: none; margin: 0; padding-left: 0;">
                            <li>
                                <div class="color-point" style="width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 5px; background-color: ${param.color};"></div>
                                <span style="color: gray;">SoC: </span><span style="color: white;">${param.data[1]}</span>
                            </li>
                            <li>
                                <span style="color: gray;">Time: </span><span style="color: white;">${param.data[0].split(":00Z")[0]}</span>
                            </li>
                            </ul>
                        </div>`;
                    });

                    tooltipContent += `</div>`;
                    return tooltipContent;
                    }
                    return ''; // Return an empty string if there's no data to show
            }
          },
          grid: {
            bottom: '25%',
            left: '10%',
            containLabel: false
          },
          xAxis: {
            type: 'time',
            axisLabel: {
                rotate: 40,
                margin: 5,
                textStyle: {
                color: '#9a9a9a'
                },
                formatter: timeLineSet,
            },
            axisLine: {
                show: true,
            },
            boundaryGap: false,  // Ensure this matches the `StateOfCharge` component
            splitNumber: 24
            },
          yAxis: [
            {
              type: 'value',
              splitLine: {
                show: false
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
          }],
          series: [
            {
              name: "Battery 1",
              type: 'bar', // Changed from 'line' to 'bar'
              itemStyle: {
                color: '#FFBC34'
              },
              stack: 'Ad',
              data: [], // Initialize with empty data
              barWidth: '60%', // Customize bar width (optional)
            },
            {
              name: "Battery 2",
              type: 'bar', // Changed from 'line' to 'bar'
              itemStyle: {
                color: '#321dd1'
              },
              stack: 'Ad',
              data: [], // Initialize with empty data
              barWidth: '60%', // Customize bar width (optional)
            },
          ]
        }
      };
    },
  
    mounted() {
      const foundObject = this.all_devs.find(obj => obj.id === this.selectedDev);
      if (foundObject) {
        this.lat = foundObject.lat
        this.long = foundObject.long
      }
      this.fetchData();
    },
  
    computed: {
      ...mapState(['dateRange', 'selectedDev', 'all_devs']),
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

        setAxisTimeRange() {
            const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
            let start = new Date(today);
            let end = new Date(today);

            if (this.dateRange === 'today') {
                end.setHours(22, 59, 59); // Ensure the end time covers the whole day
                this.option.xAxis.axisLabel.formatter = timeLineSet;
                this.option.xAxis.splitNumber = 24;
            } else if (this.dateRange === 'month') {
                start.setDate(1);
                end.setMonth(end.getMonth() + 1, 0);
                end.setHours(23, 59, 59);
                this.option.xAxis.axisLabel.formatter = (value) => {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}`;
                };
                this.option.xAxis.splitNumber = end.getDate();
            } else if (this.dateRange === 'year') {
                start.setMonth(0, 1);
                end.setFullYear(end.getFullYear(), 11, 31);
                end.setHours(23, 59, 59);
                this.option.xAxis.axisLabel.formatter = (value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getFullYear()}`;
                };
                this.option.xAxis.splitNumber = 12;
            }

            this.option.xAxis.min = start.getTime();
            this.option.xAxis.max = end.getTime();

            // Update the chart
            this.$refs.chart && this.$refs.chart.refresh(); 
            },


  
      fetchData() {
        let url = `http://85.14.6.37:16543/api/state_of_charge/?date_range=today`
        if (url) {
          axios
            .get(url)
            .then((response) => response.data.forEach(el => {
              if(el.devId == "batt-0001"){
                this.option.series[0].data.push([el.timestamp, el.flow_last_min])
              }
              if(el.devId == "batt-0002"){
                this.option.series[1].data.push([el.timestamp, el.flow_last_min])
              }
              this.setAxisTimeRange()
            }))
            .catch((error) => console.log(error))
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .bar-chart {
    height: 480px;
  }
  .chart {
    height: 400px;
  }
  </style>
  