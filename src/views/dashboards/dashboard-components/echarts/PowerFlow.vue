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
                const firstParam = params[0];
                if (firstParam.seriesType === 'bar' && firstParam.data) {
                  return `
                    <div class="tooltip-set" style="text-align:left; padding:0; margin:0; background-color: black; border-radius: 8px;">
                      <div style="vertical-align: middle; color: white; padding-left: 10px;">
                        ${firstParam.seriesName}
                      </div>
                      <div style="padding-right:15px;padding-left:15px;padding-top:3px;padding-bottom:3px;margin-bottom:0;background-color: #272b34;border-bottom-left-radius: 8px;border-bottom-right-radius: 8px;">
                        <ul style="list-style-type: none; margin: 0; padding-left: 0;">
                          <li>
                            <div class="color-point" style="width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 5px; background-color: ${firstParam.color};"></div>
                            <span style="color: gray;">Power Flow: </span><span style="color: white;">${firstParam.data[1]}</span>
                          </li>
                          <li>
                            <span style="color: gray;">Time: </span><span style="color: white;">${firstParam.data[0].split(":00Z")[0]}</span>
                          </li>
                        </ul>
                      </div>
                    </div>`;
                }
              }
              return ''; 
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
            },
            axisLine: {
              show: true,
            },
            boundaryGap: true, // Allows some gap between bars and axis
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
              name: "Power Flow",
              type: 'bar', // Changed from 'line' to 'bar'
              itemStyle: {
                color: '#FFBC34'
              },
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
        // Same function as before, used to set the x-axis range
        // No change needed here
      },
  
      fetchData() {
        let url = `http://85.14.6.37:16543/api/state_of_charge/?date_range=today`
        if (url) {
          axios
            .get(url)
            .then((response) => response.data.forEach(el => {
              this.option.series[0].data.push([el.timestamp, el.flow_last_min])
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
  