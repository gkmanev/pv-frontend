<template>
  <div>
    <div class="card-body">
      <!-- Header -->
      <div class="d-md-flex align-items-center">
        <div>
          <h4 class="card-title">Revenue Statistics</h4>
          <h5 class="card-subtitle text-muted font-weight-light">
            January 2021
          </h5>
        </div>
        <div class="ml-auto d-flex no-block align-items-center m-2 mt-md-0">
          <ul class="list-group list-group-horizontal font-12 mr-3 mb-0">
            <li
              class="list-group-item border-0 p-0 d-flex align-items-center mr-2"
            >
              <h6 class="text-muted">
                <i class="mdi mdi-checkbox-blank-circle mr-1 text-success"></i>
                Product A
              </h6>
            </li>
            <li class="list-group-item border-0 p-0 d-flex align-items-center">
              <h6 class="text-muted">
                <i class="mdi mdi-checkbox-blank-circle mr-1 text-info"></i>
                Product B
              </h6>
            </li>
          </ul>
        </div>
      </div>
      <!-- Chart and Data Section -->
      <div class="d-flex flex-column w-100">
        <vue-apex-charts
          type="area"
          height="250"
          :options="apexChartData.lineAreaChartSpline.chartOptions"
          :series="apexChartData.lineAreaChartSpline.series"
        ></vue-apex-charts>
      </div>
    </div>
    <!-- Footer -->
    <MonthlyProfitList :totalincomes="totalincomes"></MonthlyProfitList>
  </div>
</template>
<script>
import VueApexCharts from "vue-apexcharts";
import apexChartData from "../../../charts/apexcharts/ApexChartsData";
import MonthlyProfitList from "../monthly-profit-list/MonthlyProfitList";
export default {
  name: "RevenueStatistics",
  data: () => ({
    title: "Revenue Statistics",
    sales1: 0,
    apexChartData: apexChartData,
    // Data for TotalIncome
    totalincomes: [
      {
        gridlg: "col-lg-3",
        gridsm: "col-md-6",
        text: "Total Revenue",
        money: "$54578",
      },
      {
        gridlg: "col-lg-3",
        gridsm: "col-md-6",
        text: "Online Revenue",
        money: "$43451",
      },
      {
        gridlg: "col-lg-3",
        gridsm: "col-md-6",
        text: "Product A",
        money: "$44578",
      },
      {
        gridlg: "col-lg-3",
        gridsm: "col-md-6",
        text: "Product B",
        money: "$12578",
      },
    ],
  }),
  components: {
    VueApexCharts,
    MonthlyProfitList,
  },
};
</script>