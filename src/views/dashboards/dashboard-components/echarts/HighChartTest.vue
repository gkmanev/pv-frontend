<template>
  <div class="chart" ref="plotlyChart"></div>
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
    };
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    ...mapState(['dateRange','selectedDev']),
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
    fetchData() {
      let url = '';
      let urlForecast = '';
      
      if (this.$route.path.endsWith('entra')) {
        url = `http://85.14.6.37:16455/api/posts/?date_range=${this.dateRange}`;
      } else {
        if (this.selectedDev) {
          url = `http://85.14.6.37:16455/api/posts/?date_range=${this.dateRange}&dev=${this.selectedDev}`;
          urlForecast = `http://85.14.6.37:16455/api/post_forecast?date_range=${this.dateRange}&dev=${this.selectedDev}F`;
        }
      }

      try {
        let requestOne = [];
        if (url) {
          requestOne = axios.get(url);
        }
        let requestTwo = [];
        if (urlForecast) {
          requestTwo = axios.get(urlForecast);
        }

        axios.all([requestOne, requestTwo]).then(axios.spread((...responses) => {
          let devData = responses[0].data;
          let forecastData = responses[1].data;

          this.createPlotlyChart(devData, forecastData);
        }));
      } catch(error) {
        console.log(error);
      }    
    },
    createPlotlyChart(devData, forecastData) {
      const traces = [];

      if (devData && devData.length > 0) {
        const devIds = [...new Set(devData.map(item => item.devId))];
        const uniqueDates = [...new Set(devData.map(item => item[this.created_date_or_created]))];

        // Initialize trace for each device
        devIds.forEach(devId => {
          const trace = {
            x: uniqueDates,
            y: Array(uniqueDates.length).fill(0), // Initialize y data array with zeros
            type: 'scatter',
            mode: 'lines',
            stackgroup: 'one', // Enable stacking for this trace
            name: devId,
            line: {
            width: 1, // Ensure this is set for each trace to make the line width 1
          },
          };
          traces.push(trace);
        });

        // Populate y data array for each trace
        devData.forEach(item => {
          const index = uniqueDates.indexOf(item[this.created_date_or_created]);
          traces[devIds.indexOf(item.devId)].y[index] = item.value;
        });
      }

      if (forecastData && forecastData.length > 0) {
        // Add trace for forecast data
        const forecastTrace = {
          x: forecastData.map(item => item[this.created_date_or_created]),
          y: forecastData.map(item => item.value),
          type: 'scatter',
          mode: 'lines',
          stackgroup: 'one', // Enable stacking for forecast trace
          name: 'Forecast',
        };
        traces.push(forecastTrace);
      }

      const layout = {
        title: 'Stacked Area Chart with Timestamp on X-axis',
        xaxis: {
          title: 'Timestamp',
          type: 'date',
          tickformat: '%H:%M:%S',
        },
        yaxis: {
          title: 'Value',
          
        },
        plot_bgcolor: '#272b34', // Set background color
        showlegend:false,
        paper_bgcolor: '#272b34'
      };

      const config = {
        responsive: true,
      };



    



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
    },
  },
};
</script>

<style scoped>
.chart {
  height: 450px;
  background-color: black;
}
</style>
