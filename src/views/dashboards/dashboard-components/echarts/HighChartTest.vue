<template>
  <b-card class="mb-4">
    <div class="chart" ref="plotlyChart"></div>
  </b-card>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import Plotly from 'plotly.js-dist';

export default {
  name: "HelloWorld",
  data() {
    return {
      created_date_or_created: 'created_date',
      traceVisibility: {
       
        // Add more devIds as needed
      }
    };
  },
  mounted() {
    this.fetchData();
    this.populateTraceVisibility();
  },
  computed: {
    ...mapState(['dateRange','selectedDev', 'selectBoxDevs']),
  },
  watch: {
    selectBoxDevs: {
      handler(newBox, oldBox) {
        if (newBox !== oldBox) {       
          
          this.traceVisibility = newBox
          this.fetchData();
        }
      },
      deep: true // If selectBoxDevs is an array or object, use deep: true
    },
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
    populateTraceVisibility() {
      for (let i = 1; i <= 2; i++) {
        const devId = 'batt-' + ('000' + i).slice(-4); // Generate devId with leading zeros
        this.$set(this.traceVisibility, devId, true); // Set visibility for each devId
      }
    },
    fetchData() {
      let url = '';
      
      
      if (this.$route.path.endsWith('entra')) {
        
        if (this.dateRange == "today"){
          url = `http://127.0.0.1:8000/api/state_of_charge/?date_range=today`          
        }
        else{
          url =  `http://85.14.6.37:16455/api/posts/?date_range=${this.dateRange}`       
        }
       
        
      } else {
        if (this.selectedDev) {
          url = `http://85.14.6.37:16455/api/posts/?date_range=${this.dateRange}&dev=${this.selectedDev}`;          
        }
      }

      try {
        let requestOne = [];
        if (url) {
          requestOne = axios.get(url);          
        }
        let requestTwo = [];       

        axios.all([requestOne, requestTwo]).then(axios.spread((...responses) => {
          let devData = responses[0].data;
          let sampleData = [
          {
        "id": 246,
        "timestamp": "2024-08-22 14:42",
        "devId": "batt-0001",
        "state_of_charge": 15.12,
        "flow_last_min": 0.16,
        "invertor_power": 9.7
    },
    {
        "id": 247,
        "timestamp": "2024-08-22 14:43",
        "devId": "batt-0001",
        "state_of_charge": 15.28,
        "flow_last_min": 0.16,
        "invertor_power": 9.7
    },
    {
        "id": 248,
        "timestamp": "2024-08-22 14:44",
        "devId": "batt-0001",
        "state_of_charge": 15.44,
        "flow_last_min": 0.16,
        "invertor_power": 9.7
    },
    {
        "id": 249,
        "timestamp": "2024-08-22 14:45",
        "devId": "batt-0001",
        "state_of_charge": 15.6,
        "flow_last_min": 0.16,
        "invertor_power": 9.7
    },
    {
        "id": 250,
        "timestamp": "2024-08-22 14:46",
        "devId": "batt-0001",
        "state_of_charge": 15.76,
        "flow_last_min": 0.16,
        "invertor_power": 9.7
    },
    {
        "id": 251,
        "timestamp": "2024-08-22 14:47",
        "devId": "batt-0001",
        "state_of_charge": 15.92,
        "flow_last_min": 0.16,
        "invertor_power": 9.7
    },
    {
        "id": 252,
        "timestamp": "2024-08-22 14:48",
        "devId": "batt-0001",
        "state_of_charge": 16.09,
        "flow_last_min": 0.16,
        "invertor_power": 9.7
    },
    {
        "id": 253,
        "timestamp": "2024-08-22 14:49",
        "devId": "batt-0001",
        "state_of_charge": 16.25,
        "flow_last_min": 0.16,
        "invertor_power": 9.7
    },
    {
        "id": 254,
        "timestamp": "2024-08-22 14:50",
        "devId": "batt-0001",
        "state_of_charge": 16.41,
        "flow_last_min": 0.16,
        "invertor_power": 9.7
    },
    {
        "id": 255,
        "timestamp": "2024-08-22 14:51",
        "devId": "batt-0001",
        "state_of_charge": 16.57,
        "flow_last_min": 0.16,
        "invertor_power": 9.7
    },
    {
        "id": 256,
        "timestamp": "2024-08-22 14:52",
        "devId": "batt-0001",
        "state_of_charge": 16.73,
        "flow_last_min": 0.16,
        "invertor_power": 9.7
    },
    {
        "id": 257,
        "timestamp": "2024-08-22 14:53",
        "devId": "batt-0001",
        "state_of_charge": 16.89,
        "flow_last_min": 0.16,
        "invertor_power": 9.7
    },
    {
        "id": 258,
        "timestamp": "2024-08-22 14:54",
        "devId": "batt-0001",
        "state_of_charge": 17.06,
        "flow_last_min": 0.16,
        "invertor_power": 9.7
    },
    {
        "id": 259,
        "timestamp": "2024-08-22 14:55",
        "devId": "batt-0001",
        "state_of_charge": 17.22,
        "flow_last_min": 0.16,
        "invertor_power": 9.7
    },
    {
        "id": 260,
        "timestamp": "2024-08-22 14:56",
        "devId": "batt-0001",
        "state_of_charge": 17.38,
        "flow_last_min": 0.16,
        "invertor_power": 9.7
    },
    {
        "id": 261,
        "timestamp": "2024-08-22 14:57",
        "devId": "batt-0001",
        "state_of_charge": 17.54,
        "flow_last_min": 0.16,
        "invertor_power": 9.7
    },
    {
        "id": 262,
        "timestamp": "2024-08-22 14:58",
        "devId": "batt-0001",
        "state_of_charge": 17.7,
        "flow_last_min": 0.16,
        "invertor_power": 9.7
    },
    {
        "id": 263,
        "timestamp": "2024-08-22 14:59",
        "devId": "batt-0001",
        "state_of_charge": 17.86,
        "flow_last_min": 0.16,
        "invertor_power": 9.7
    },
    {
        "id": 264,
        "timestamp": "2024-08-22 15:00",
        "devId": "batt-0001",
        "state_of_charge": 18.03,
        "flow_last_min": 0.16,
        "invertor_power": 9.7
    },
    {
        "id": 265,
        "timestamp": "2024-08-22 15:01",
        "devId": "batt-0001",
        "state_of_charge": 18.19,
        "flow_last_min": 0.16,
        "invertor_power": -12.12
    },
    {
        "id": 266,
        "timestamp": "2024-08-22 15:02",
        "devId": "batt-0001",
        "state_of_charge": 17.99,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 267,
        "timestamp": "2024-08-22 15:03",
        "devId": "batt-0001",
        "state_of_charge": 17.78,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 268,
        "timestamp": "2024-08-22 15:04",
        "devId": "batt-0001",
        "state_of_charge": 17.58,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 269,
        "timestamp": "2024-08-22 15:05",
        "devId": "batt-0001",
        "state_of_charge": 17.38,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 270,
        "timestamp": "2024-08-22 15:06",
        "devId": "batt-0001",
        "state_of_charge": 17.18,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 271,
        "timestamp": "2024-08-22 15:07",
        "devId": "batt-0001",
        "state_of_charge": 16.98,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 272,
        "timestamp": "2024-08-22 15:08",
        "devId": "batt-0001",
        "state_of_charge": 16.77,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 273,
        "timestamp": "2024-08-22 15:09",
        "devId": "batt-0001",
        "state_of_charge": 16.57,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 274,
        "timestamp": "2024-08-22 15:10",
        "devId": "batt-0001",
        "state_of_charge": 16.37,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 275,
        "timestamp": "2024-08-22 15:11",
        "devId": "batt-0001",
        "state_of_charge": 16.17,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 276,
        "timestamp": "2024-08-22 15:12",
        "devId": "batt-0001",
        "state_of_charge": 15.96,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 277,
        "timestamp": "2024-08-22 15:13",
        "devId": "batt-0001",
        "state_of_charge": 15.76,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 278,
        "timestamp": "2024-08-22 15:14",
        "devId": "batt-0001",
        "state_of_charge": 15.56,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 279,
        "timestamp": "2024-08-22 15:15",
        "devId": "batt-0001",
        "state_of_charge": 15.36,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 280,
        "timestamp": "2024-08-22 15:16",
        "devId": "batt-0001",
        "state_of_charge": 15.16,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 281,
        "timestamp": "2024-08-22 15:17",
        "devId": "batt-0001",
        "state_of_charge": 14.95,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 282,
        "timestamp": "2024-08-22 15:18",
        "devId": "batt-0001",
        "state_of_charge": 14.75,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 283,
        "timestamp": "2024-08-22 15:19",
        "devId": "batt-0001",
        "state_of_charge": 14.55,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 284,
        "timestamp": "2024-08-22 15:20",
        "devId": "batt-0001",
        "state_of_charge": 14.35,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 285,
        "timestamp": "2024-08-22 15:21",
        "devId": "batt-0001",
        "state_of_charge": 14.15,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 286,
        "timestamp": "2024-08-22 15:22",
        "devId": "batt-0001",
        "state_of_charge": 13.94,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 287,
        "timestamp": "2024-08-22 15:23",
        "devId": "batt-0001",
        "state_of_charge": 13.74,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 288,
        "timestamp": "2024-08-22 15:24",
        "devId": "batt-0001",
        "state_of_charge": 13.54,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 289,
        "timestamp": "2024-08-22 15:25",
        "devId": "batt-0001",
        "state_of_charge": 13.34,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 290,
        "timestamp": "2024-08-22 15:26",
        "devId": "batt-0001",
        "state_of_charge": 13.14,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 291,
        "timestamp": "2024-08-22 15:27",
        "devId": "batt-0001",
        "state_of_charge": 12.93,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 292,
        "timestamp": "2024-08-22 15:28",
        "devId": "batt-0001",
        "state_of_charge": 12.73,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 293,
        "timestamp": "2024-08-22 15:29",
        "devId": "batt-0001",
        "state_of_charge": 12.53,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 294,
        "timestamp": "2024-08-22 15:30",
        "devId": "batt-0001",
        "state_of_charge": 12.33,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    },
    {
        "id": 295,
        "timestamp": "2024-08-22 15:31",
        "devId": "batt-0001",
        "state_of_charge": 12.13,
        "flow_last_min": -0.2,
        "invertor_power": -12.12
    }
   
          ]    

          const randomAdjustment = (Math.random() * 10 - 5) * 2;
          sampleData = sampleData.map((item, index) => {
              return {
                ...item,
                id: 300 + index, // Adjust id to start from 300
                devId: "batt-0002", // Set devId to "batt-0002"
                invertor_power: item.invertor_power - randomAdjustment
              };
            });
            // Add the modified sample data to the fetched devData
            devData = devData.concat(sampleData);
                
                

              console.log(devData)
              this.createPlotlyChart(devData);
              }));
            } catch(error) {
              console.log(error);
            }    
    },
    
    createPlotlyChart(devData) {
      const traces = [];

if (Array.isArray(devData) && devData.length > 0) {
  const devIds = [...new Set(devData.map(item => item.devId))];
  const uniqueDates = [...new Set(devData.map(item => item.timestamp))].sort();

  const traceMap = {};

  devIds.forEach(devId => {
    if (this.traceVisibility[devId]) {
      const traceColor = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
      const trace = {
        x: uniqueDates,
        y: Array(uniqueDates.length).fill(0),
        type: 'scatter',
        mode: 'lines',
        stackgroup: 'one', // Comment this line out if stacking causes issues with negatives
        name: devId,
        line: { width: 0.5 },
        hoverinfo: 'text',
        marker: { color: traceColor },
        hovertemplate: 
          `<b style="display: inline-block; margin-right: 5px; color: ${traceColor};">&#x25CF;</b>` +
          `<b style="display: inline-block; margin-right: 5px;">%{fullData.name}</b><br>` +
          `<i>Time: %{x}</i><br>` +
          `<span style="color: gray;">Power: </span><span>%{y}</span><br><extra></extra>`,
      };
      traceMap[devId] = traces.length;
      traces.push(trace);
    }
  });

  devData.forEach(item => {
    console.log(item)
    const dateIndex = uniqueDates.indexOf(item.timestamp);
    const traceIndex = traceMap[item.devId];
    if (traceIndex !== undefined && dateIndex !== -1) {
      traces[traceIndex].y[dateIndex] = item.invertor_power;
    }
  });

  console.log(traces);

  if (traces.length > 0) {
    let layout = {
      title: 'State Of Charge',
      font: {
      color: '#20C997' // Set the desired color here
      },
      xaxis: {
        showspikes: true,
        spikemode: 'across',
        spikethickness: 1,
        spikedash: 'dot',
        spikecolor: '#858687',
        tickfont: { color: '#00a3cf' },
      },
      yaxis: {
        tickfont: { color: '#858687' },
        range: 'auto',  // This ensures that the y-axis accommodates both positive and negative values
      },
      hoverlabel: { bgcolor: "#272b34", bordercolor: "black", font: { color: "white" } },
      plot_bgcolor: '#272b34',
      showlegend: false,
      paper_bgcolor: '#272b34',
    };

    if (this.dateRange === 'today') {
      Object.assign(layout.xaxis, {
        tick0: new Date().setHours(0, 0, 0, 0),
        tickangle: -45,
        dtick: 3600000,
        range: [new Date().setHours(0, 0, 0, 0), new Date().setHours(23, 59, 59, 999)],
        type: 'date',
        tickformat: '%H:%M',
        rangeslider: {
          tickformat: '%H:%M',
          tickmode: 'linear',
          tick0: new Date().setHours(0, 0, 0, 0),
          dtick: 3600000,
          bordercolor: '#858687',
          borderwidth: 2,
          thickness: 0.05,
        }
      });
    } else if (this.dateRange === 'month') {
      const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const lastDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

      Object.assign(layout.xaxis, {
        type: 'date',
        tickformat: '%d',
        tickmode: 'linear',
        tick0: firstDayOfMonth.getTime(),
        dtick: 24 * 60 * 60 * 1000,
        range: [firstDayOfMonth.getTime(), lastDayOfMonth.getTime()],
        tickangle: -45,
        rangeslider: {
          tickformat: '%d',
          tickmode: 'linear',
          tick0: firstDayOfMonth.getTime(),
          dtick: 24 * 60 * 60 * 1000,
          bordercolor: '#858687',
          borderwidth: 2,
          thickness: 0.05,
        }
      });
    } else {
      const firstDayOfYear = new Date(new Date().getFullYear(), 0, 1);
      const lastDayOfYear = new Date(new Date().getFullYear(), 11, 31);

      Object.assign(layout.xaxis, {
        type: 'date',
        tickformat: '%b',
        tickmode: 'linear',
        tick0: firstDayOfYear.getTime(),
        dtick: 30 * 24 * 60 * 60 * 1000,
        range: [firstDayOfYear.getTime(), lastDayOfYear.getTime()],
        tickangle: -45,
        rangeslider: {
          tickformat: '%d',
          tickmode: 'linear',
          tick0: firstDayOfYear.getTime(),
          dtick: 24 * 60 * 60 * 1000,
          bordercolor: '#858687',
          borderwidth: 2,
          thickness: 0.05,
        }
      });
    }

    const config = { responsive: true };

    Plotly.newPlot(this.$refs.plotlyChart, traces, layout, config).then(() => {
      this.$refs.plotlyChart.on('plotly_hover', data => {
        let update = { 'line': { width: 3 } };
        Plotly.restyle(this.$refs.plotlyChart, update, [data.points[0].curveNumber]);
      });

      this.$refs.plotlyChart.on('plotly_unhover', data => {
        let update = { 'line': { width: 1 } };
        Plotly.restyle(this.$refs.plotlyChart, update, [data.points[0].curveNumber]);
      });
    });
  } else {
    console.log('No traces to display.');
  }
}

  },
}
}
</script>

<style scoped>
.chart {
  height: 650px;
  background-color: black;
}
</style>
