<template>
  <div>
    <b-row>
      <b-col
        lg="4"
        cols="12"
        md="4"
        v-for="awesome in awesomes"
        :key="awesome.number"
      >
        <b-card no-body :class="'p-2 mb-4 text-center bg-' + awesome.cardbg">
          <h1 class="font-weight-light text-white">
            {{ awesome.number }}
          </h1>
          <h6 class="text-white mb-0">{{ awesome.subtitle }}</h6>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  name: "AwesomeCards",
  props: {
    review: Object,
  },
  data: () => ({
    title: "Awesome Card",
    awesomes: [
      {
        cardbg: "info",
        number: "2,064",
        subtitle: "Min Power",
      },
      {
        cardbg: "primary",
        number: "1,738",
        subtitle: "Max Power",
      },
      {
        cardbg: "success",
        number: "5963",
        subtitle: "Avarage Power",
      },
      // {
      //   cardbg: "warning",
      //   number: "10%",
      //   subtitle: "Bounce Rate",
      // },
    ],
  }),
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      axios.get('http://85.14.6.37:16455/api/aggregate/today/')
        .then(response => {
          const data = response.data.today_overview;
          this.awesomes[0].number = data.min.toFixed(2) + " kW"; // Format to 2 decimal places
          this.awesomes[1].number = data.max.toFixed(2) + " kW";
          this.awesomes[2].number = data.avg.toFixed(2) + " kW"
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
  },
};
</script>