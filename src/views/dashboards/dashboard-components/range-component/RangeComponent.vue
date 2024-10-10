<template>
    <div class="ml-auto">
            <b-button-group>
              <b-button @click="filterContent('dam')" :class="{ 'active': selectedPeriod === 'dam' }">Day Ahead</b-button>
              <b-button @click="filterContent('today')" :class="{ 'active': selectedPeriod === 'today' }">Today</b-button>
              <b-button @click="filterContent('month')" :class="{ 'active': selectedPeriod === 'month' }">Month</b-button>
              <!-- <b-button @click="filterContent('year')"  :class="{ 'active': selectedPeriod === 'year' }">Year</b-button> -->
              <b-button @click="populateBatterySchedule"  :class="{'default-state':'default-state', 'active': selectedPeriod === 'forecast' }">Create forecast</b-button>
            </b-button-group>
          </div>
  </template>
  
  <script>
  import { mapActions } from 'vuex';
  import { mapState } from 'vuex';
  import axios from 'axios';
  export default {
    data() {
      return {
        selectedPeriod: 'today',
      };
    },

    computed: {
      ...mapState(['dateRange']),    
  
    },
    mounted() { 

      this.selectedPeriod = this.dateRange

    },
  
    methods: {

      ...mapActions(['updateDateRange']),
      

      filterContent(period) {
        
        this.selectedPeriod = period
        // console.log(period)
        this.updateDateRange(period)
       
        //this.$emit('filter', period);          
      },

      async populateBatterySchedule() {
      try {
          const response = await axios.post('http://85.14.6.37:16543/api/populate-schedule/');
          if (response.status === 202) {
            console.log('Task started:', response.data.task_id);
            //this.$notify({ type: 'success', message: 'Battery schedule population started' });
          }
        } catch (error) {
          console.error('Error starting task:', error);
          //this.$notify({ type: 'error', message: 'Failed to start battery schedule population' });
        }
      }

    },
  };
  </script>
  
  <style scoped>
  .default-state {
    margin-left: 24px;
    border-left: 1px solid;
    background: #8d5cf5;
    color: #ffffff;
}
  </style>