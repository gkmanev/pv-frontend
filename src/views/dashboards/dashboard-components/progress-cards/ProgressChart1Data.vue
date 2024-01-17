<script>
export default {
  ProgressAChart: {
    series: [14, 15],
    chartOptions: {
      labels: ["Search Traffic", "Free"],
      dataLabels: {
        enabled: false,
      },
      grid: {
        padding: {
          left: 0,
          right: 0,
        },
      },
      chart: {},
      plotOptions: {
        pie: {
          donut: {
            size: "85px",
          },
        },
      },
      stroke: {
        width: 0,
      },
      legend: {
        show: false,
      },
      colors: ["rgb(41, 98, 255)", "rgb(250, 250, 250)"],
      tooltip: {
        enabled: false,
        theme: "dark",
      },
    },
  },
};
</script>
