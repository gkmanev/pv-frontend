<template>
    <div>
      <b-row>
        <b-col cols="4" md="4">
          <b-card class="mb-4">
            <div class="modern-battery-indicator">
              <div class="glossy-overlay"></div>
              <div class="modern-battery-level" :style="{ width: batteryLevel + '%' }">
                <div class="battery-percentage-text">{{ batteryLevel }}%</div>
                <div class="pulse"></div>
              </div>
              <div class="modern-battery-terminal"></div>
            </div>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </template>
  
  <script>
  import { mapState } from "vuex";
  export default {
    name: "ModernBatteryChart",
    data() {
      return {
        batteryLevel: 85, // Example charge level
      };
    },
    computed: {
      ...mapState(["dateRange", "selectedDev"]),
    },
    watch: {
      dateRange(newRange, oldRange) {
        if (newRange !== oldRange) {
          this.fetchData();
        }
      },
    },
    methods: {
      fetchData() {
        // let url = `http://85.14.6.37:16455/api/missing/?date_range=${this.dateRange}&devId=${this.selectedDev}`;
  
        // if (url) {
        //   axios
        //     .get(url)
        //     .then((response) => {
        //       this.batteryLevel = 100 - response.data.missing;
        //     })
        //     .catch((error) => console.log(error));
        // }
      },
    },
  };
  </script>
  
  <style scoped>
  .modern-battery-indicator {
    width: 150px; /* 50% of the original width */
    height: 60px; /* 50% of the original height */
    background: linear-gradient(135deg, #1e1e1e, #3e3e3e); /* Dark metallic gradient */
    border: 2px solid #111; /* Reduced border size */
    border-radius: 7.5px; /* Scaled down border-radius */
    position: relative;
    display: inline-block;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.6), inset 0 1px 4px rgba(255, 255, 255, 0.1);
    overflow: hidden;
  }
  
  .modern-battery-level {
    height: 100%;
    background: linear-gradient(to right, #00ff85, #1ed760); /* Neon green gradient */
    border-radius: 7.5px 0 0 7.5px;
    box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.4); /* Inner shadow for depth */
    position: relative;
    transition: width 0.4s ease;
  }
  
  .battery-percentage-text {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    font-weight: bold;
    color: white; /* White text inside the green area */
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.6); /* Shadow effect */
    z-index: 2; /* Ensure the text stays above other elements */
  }
  
  .glossy-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1); /* Glossy overlay */
    border-radius: 7.5px;
    z-index: 1;
    pointer-events: none;
  }
  
  .pulse {
    position: absolute;
    right: 0;
    top: 50%;
    width: 7.5px; /* 50% of the original width */
    height: 7.5px; /* 50% of the original height */
    background: #00ff85;
    border-radius: 50%;
    box-shadow: 0 0 10px 5px rgba(0, 255, 133, 0.6); /* Reduced neon pulse effect */
    transform: translateY(-50%);
    animation: pulse 1.5s infinite ease-in-out;
  }
  
  @keyframes pulse {
    0% { box-shadow: 0 0 5px 2.5px rgba(0, 255, 133, 0.6); }
    50% { box-shadow: 0 0 10px 5px rgba(0, 255, 133, 0.9); }
    100% { box-shadow: 0 0 5px 2.5px rgba(0, 255, 133, 0.6); }
  }
  
  .modern-battery-terminal {
    position: absolute;
    right: -10px; /* Adjusted for smaller size */
    top: 12.5px; /* Adjusted for smaller size */
    width: 15px; /* Slightly narrower terminal */
    height: 30px; /* Slightly shorter terminal */
    background: #666; /* Light gray color */
    border-radius: 4px; /* Rounded corners */
    border: 2px solid #444; /* Dark border */
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5); /* Deeper shadow for dimension */
  }
  

  </style>
  