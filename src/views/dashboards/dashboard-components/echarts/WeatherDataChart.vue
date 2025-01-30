<template>    
    <b-card>
        <div ref="chart" style="width: 100%; height: 250px;"><span v-if="noDataMessage">There Are no Data for this Period</span></div>
    </b-card>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';
import { mapState } from 'vuex';
export default {
  name: 'MeasurementData',
  data() {
    return {
      chart: null,
      measurementData: [],
      timestampField: 'timestamp',
      valueFieldTemp: 'avg_temperature',
      valueFieldRadiation: 'direct_radiation',
      noDataMessage: false
    };
  },
    mounted() {
        this.fetchAllData();
        window.addEventListener('resize', this.handleResize);
    },
    computed: {
      ...mapState(['dateRange', 'selectedDev']),  
      chartHeight() {
        return window.innerHeight * 0.1; // Adjust this factor as needed
      }          
    },
    beforeDestroy() {
      window.removeEventListener('resize', this.handleResize);
      if (this.chart) {
        this.chart.dispose();
      }
    },
    watch: {      
      dateRange(newRange, oldRange) {
        if (newRange !== oldRange) {
            this.fetchAllData();           
        }
      },  
      selectedDev(newDev, oldDev) {
      if (newDev !== oldDev) {        
        this.fetchAllData();
      }
    },
    },
  methods: {
    handleResize() {
      if (this.chart) {
        this.chart.resize();
      }
    },
    lastRouteSegment() {
      const pathArray = this.$route.path.split('/');    
      return pathArray.pop() || pathArray[pathArray.length - 1]; // This handles non-trailing slash URLs
    },
    async fetchAllData() {
      let baseUrl = 'http://209.38.208.230:8000/api/pvmeasurementdata';
      this.timestampField = 'day';
      this.valueFieldRadiation = 'avg_direct_radiation'; 
      const dateRanges = {
        'start_date=2023-01-01': '&end_date=2024-01-01',
        'start_date=2024-01-01': '&end_date=2025-01-01',
        'start_date=2025-01-01': '&end_date=2026-01-01'
      };
      if (this.selectedDev && this.lastRouteSegment() !== 'entra') {  
        let extraParams = dateRanges[this.dateRange] || '';
        if (extraParams) {
          baseUrl += `/?all=all&${this.dateRange}${extraParams}&farm=${this.selectedDev}`;
          
        } else {          
          baseUrl = `${baseUrl}?farm=${this.selectedDev}&${this.dateRange}`;
          if(this.dateRange == 'day-ahead'){
            baseUrl += `=day-ahead`            
          }
          this.timestampField = 'timestamp';
          this.valueFieldRadiation = 'direct_radiation';          
        }     
       
      }      
      try {        
         
          const response = await axios.get(baseUrl);             
          this.measurementData = response.data;   
                
        if (this.measurementData.length > 0) {

          this.initChart();
        } else {
          console.error('No Weather Data Found');
          this.noDataMessage = true
          if(this.chart){
              this.chart.clear();
              this.option = {
                title: {
                  text: 'No Weather Data Available',
                  left: 'center',
                  top: 'middle',
                  textStyle: {
                    fontSize: 16,
                    color: '#b2b9bf',
                    fontFamily: 'Arial',
                    fontWeight: 'normal'
                  }
                }
              };
            this.chart.setOption(this.option);   
          } 
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    },
    initChart() {
      if (!this.chart) {
        this.chart = echarts.init(this.$refs.chart);        
      }
      else{
        this.chart.clear();
        this.option = {};           
      }
      
      const groupedData = this.groupDataByFarm(this.measurementData);      
      const timestamps = this.getAllTimestamps(this.measurementData);
      let totalSeries = [];    
 
      let seriesToday = this.createSeriesToday(groupedData, timestamps);      
      let dayAhead = this.createDayAheadSeries(groupedData, timestamps);
      let dayBefore = this.createDayBeforeSeries(groupedData, timestamps);
      //let totalSeries = dayBefore;
      totalSeries = dayBefore.concat(seriesToday).concat(dayAhead);
      if(this.dateRange !== 'day-ahead'){
        totalSeries = this.createSeries(groupedData, timestamps);
      }
      console.log(totalSeries)
      //series.push(...dayAhead); 
      const xAxis = this.getXAxisConfig(timestamps);
      this.option = {
        title: {
            text: 'Direct Radiation [W/m²]', 
            left: 'center',
            top: 'top',   
            textStyle: {
              fontSize: 16,
              color:'#b2b9bf',
              fontFamily: 'Arial',
              fontWeight: 'normal'
            },   
  
          },
          grid: {
            bottom: '25%',
            left:'10%',
            containLabel: false
            },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            label: {
              backgroundColor: '#6a7985',
            },
          },
          backgroundColor: '',
          borderWidth: 0,
          shadowBlur: 0,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowColor: 'transparent',
          formatter: (params) => {
            if (params && params.length) {
              const param = params[0]; // Only show the first series being pointed to
              let tooltipContent = `<div class="tooltip-set" style="text-align:left; padding:0; margin:0; background-color: black; border-radius: 8px;">`;
              const utcTime = new Date(param.data[0]);
              const hours = utcTime.getHours().toString().padStart(2, '0');
              const minutes = utcTime.getMinutes().toString().padStart(2, '0');
              const day = utcTime.getDate().toString().padStart(2, '0');
              const month = (utcTime.getMonth() + 1).toString().padStart(2, '0');
              const year = utcTime.getFullYear();
              const localTime = `${day}.${month}.${year} ${hours}:${minutes}`;
              const sumValue = param.data[1];
              tooltipContent += `
              <div style="padding-right:15px;padding-left:15px;padding-top:3px;padding-bottom:3px;margin-bottom:0;border-bottom-left-radius: 8px;border-bottom-right-radius: 8px;">
                <ul style="list-style-type: none; margin: 0; padding-left: 0;">
                  <li>
                    
                    <span style="color: white;">Direct Radiation</span>
                  </li>
                </ul>
              </div>`;
              let footer = `
              <div style="color: white; padding: 10px; background-color: #333; border-top: 1px solid #999;">
                <strong>Total ${sumValue}  </strong> at <span style="color: white;">${localTime}</span>
              </div>`;
              tooltipContent += footer;
              tooltipContent += `</div>`;
              return tooltipContent;
            }
            return '';
          },
        },
        xAxis: xAxis, 

        yAxis: {
          type: 'value',
          axisLine: { show: false },
          axisTick: { show: false },
          splitLine: { show: false },
        },
        dataZoom: [
          {
            type: 'slider',
            start: 0,
            end: 100,
            height: 20, // Adjust the height to make the slider tinier
            bottom: 10, // Adjust the bottom to lower the slider
            handleSize: '80%', // Adjust the handle size
            handleStyle: {
              color: '#fff',
              borderColor: '#ccc',
            },
            fillerColor: 'rgba(167,183,204,0.4)', // Adjust the filler color
            backgroundColor: 'rgba(47,69,84,0.25)', // Adjust the background color
            borderColor: '#ddd', // Adjust the border color
            textStyle: {
              color: '#fff',
            },
            borderWidth: {
              top: 1, // Adjust the width of the top border
              right: 1,
              bottom: 1,
              left: 1
            }
          },
        ],
        series: totalSeries,
      };      
      this.chart.setOption(this.option);
    },
    groupDataByFarm(data) {
      return data.reduce((acc, item) => {
        if (!acc[item.farm]) {
          acc[item.farm] = [];
        }
        acc[item.farm].push(item);
        return acc;
      }, {});
    },
    getXAxisConfig(timestamps) {
     
      return {
        type: 'time',
        min: timestamps[0],
        max: timestamps[timestamps.length - 1],
        boundaryGap: false
      };
    },
    getAllTimestamps(data) {
      const timestamps = new Set();
      data.forEach(item => {       
        timestamps.add(item[this.timestampField]);
      });
      return Array.from(timestamps).sort();
    },
    createSeries(groupedData, timestamps){
      return Object.keys(groupedData).map(farm => {
        const dataMap = new Map(groupedData[farm].map(item => [item[this.timestampField], item[this.valueFieldRadiation]]));        
        const data = timestamps.map(timestamp => [timestamp, dataMap.get(timestamp)]); // Use null for missing data
        return {
          name: farm,
          type: 'line',
          stack: 'total',
          connectNulls: false,
          lineStyle: {
            color: 'rgba(255,255,255,1)',            
          },
          showSymbol: false,
          data: data,
        };
      });

    },
    createSeriesToday(groupedData, timestamps) {
      //filter out the timestamps untill tomorrow at 00:00
      const yesterday = new Date();
      yesterday.setHours(0, 0, 0, 0);
      yesterday.setDate(yesterday.getDate());
      const tomorrow = new Date();
      tomorrow.setHours(0, 0, 0, 0);
      tomorrow.setDate(tomorrow.getDate() + 1);      
      const filteredTimestamps = timestamps.filter(timestamp => yesterday < new Date(timestamp) && new Date(timestamp) < tomorrow);
     
      return Object.keys(groupedData).map(farm => {
        
        const dataMap = new Map(groupedData[farm].map(item => [item[this.timestampField], item[this.valueFieldRadiation]]));        
        const data = filteredTimestamps.map(timestamp => [timestamp, dataMap.get(timestamp) ]); // Use null for missing data
        
        return {
          name: farm,
          type: 'line',
          stack: 'total',
          connectNulls: false,
          lineStyle: {
            color: 'rgba(255,255,255,0.6)',            
          },
          showSymbol: false,
    
          data: data,
        };
      });
    },

    createDayBeforeSeries(groupedData, timestamps) {
      
      // Filter out the timestamps untill tomorrow at 00:00
      const yesterday = new Date();
      yesterday.setHours(0, 0, 0, 0);
      yesterday.setDate(yesterday.getDate() - 1);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      today.setDate(today.getDate());

      const filteredTimestamps = timestamps.filter(timestamp => yesterday < new Date(timestamp) && new Date(timestamp) < today);      
      
      return Object.keys(groupedData).map(farm => {
        const dataMap = new Map(groupedData[farm].map(item => [item[this.timestampField], item[this.valueFieldRadiation]]));        
        const data = filteredTimestamps.map(timestamp => [timestamp, dataMap.get(timestamp)]); // Use null for missing data
        return {
          name: farm,
          type: 'line',
          stack: 'total',
          connectNulls: false,
          lineStyle: {
            color: 'rgba(255,255,255,1)',

          },
          showSymbol: false,
          data: data,
        };
      })
    },

    createDayAheadSeries(groupedData, timestamps) {
      
      // Filter out the timestamps starting from tomorrow at 00:00
      const tomorrow = new Date();
      tomorrow.setHours(0, 0, 0, 0);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const filteredTimestamps = timestamps.filter(timestamp => new Date(timestamp) >= tomorrow);
      return Object.keys(groupedData).map(farm => {
        const dataMap = new Map(groupedData[farm].map(item => [item[this.timestampField], item[this.valueFieldRadiation]]));   
        const data = filteredTimestamps.map(timestamp => [timestamp, dataMap.get(timestamp)]); // Use null for missing data
        return {
          name: farm,
          type: 'line',
          stack: 'total',
          connectNulls: false,
          lineStyle: {
            color: 'rgba(255,255,255,0.3)',

          },
          showSymbol: false,
          data: data,
        };
      })
    },
  },
};
</script>

<style scoped>
/* Add any necessary styles here */
</style>