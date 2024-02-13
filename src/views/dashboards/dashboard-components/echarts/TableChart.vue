<template>
   <b-row>
    <b-col cols="12">
      <b-card class="mb-4">
        <h5 class="card-title mb-3">Installed Smartmeters</h5>
        <b-table :items="all" :fields="fields" :select-mode="selectMode" responsive="sm" ref="selectableTable" selectable @row-selected="onRowSelected">
          <!-- Scoped slot for the 'online' status -->
          <template #cell(status)="{ item }">
            <span class="led-indicator" :class="getLedClass(item.online)"></span>
          </template>
          <template #cell(assaignCap)="{ item }">
            <div class="d-flex align-items-center">        
                <input type="text" class="form-control mr-2" style="width: 50px; height: 32px;" placeholder="#" v-model="item.capacityAssign">
                <b-button size="sm" variant="primary" @click="submitCapacity(item)">Submit</b-button>
                
            </div>
          </template>
          <!-- <template #cell(capacity)="{ item }">
            <div class="d-flex align-items-center">        
                
            </div>
          </template> -->
        </b-table>

        <p class="btn-grp">
          <b-button size="sm" variant="outline-primary" @click="selectAllRows">Select all</b-button>
          <b-button size="sm" variant="outline-danger" @click="clearSelected">Clear selected</b-button>
        </p>
        <p>Selected Rows:<br />{{ selected }}</p>
      </b-card>
    </b-col>
  </b-row>
</template>
  
  <script>
  import { mapActions } from 'vuex';
  import axios from 'axios';
  import { coords } from './coords.js';
  import PahoMQTT from 'paho-mqtt';
  export default {
  
    data() {
      return {
        selectMode: 'multi',        
        selected: [],
        fields: [
        { key: 'id', sortable: true },
        { key: 'status', sortable: true },
        { key: 'customer', sortable:true},
        { key: 'power', sortable: true, label: 'Power kW'},
        { key: 'lat', sortable: true, label: 'Latitude' },
        { key: 'long', sortable: true, label: 'Longitude' },
        { key: 'type', sortable: true },
        { key: 'assaignCap', label: 'Asign Capacity'},       
        { key: 'capacity', label: 'Capacity'}  
      ],        
        power: '',
        powerCorr:'',
        time:'',
        countDown: {},
        polling: null,
        newEntries: {},
        singleCorrection:{},
        checked: {},
        allSelected: true,
        activeClass: 'disabled',
        btn_class: 'btn btn-success mb-2',
        all: [],
        posts: [],
        errors: [],
        connection: {
          protocol: "ws",
          host: "159.89.103.242",
          // ws: 8083; wss: 8084
          port: 9001,
          endpoint: "/mqtt",
          // for more options, please refer to https://github.com/mqttjs/MQTT.js#mqttclientstreambuilder-options
          clean: true,
          connectTimeout: 30 * 1000, // ms
          reconnectPeriod: 4000, // ms
          clientId: "emqx_vue_" + Math.random().toString(16).substring(2, 8),
          // auth
          //username: "emqx_test",
          //password: "emqx_test",
        },
        subscription: {
          topic: "ping/+",
          qos: 0,
        },
        client: {
          connected: false,
        },
        subscribeSuccess: false,
        connecting: false,
        retryTimes: 0,
        sm_coeff: [{"sm-0001":120},{"sm-0002":320},{"sm-0003":400},{"sm-0004":200},{"sm-0006":200},{"sm-0008":200},{"sm-0009":80},
                   {"sm-0010":60},{"sm-0011":60},{"sm-0015":60},{"sm-0016":250},{"sm-0017":200},{"sm-0018":400},{"sm-0019":500},{"sm-0020":500},{"sm-0025":200}],  
      };
    },
  
    methods: {   
        ...mapActions(['allDevsCreation']),
        
        capacityLog(){

            axios
                .get("http://85.14.6.37:16455/api/capa_asign/")
                .then(response => response.data.forEach(el=>{         
                    let capacityObj = {
                        "dev":el.dev,
                        "cap":el.capacity              
                    }
                    let found = this.all.find(element => element.id === capacityObj.dev)
                    if (found){
                        found.capacity = capacityObj.cap
                    }

                }))
                .catch(error=>{
                console.log(error)
                })         

            },

        submitCapacity(item) {
            console.log(item)
            axios.post('http://85.14.6.37:16455/api/capa/', {
                "dev" : item.id,
                "capacity": item.capacityAssign
            }).then(response =>{
                console.log(response.data)
                this.success = 'Data saved successfully';
                this.response = JSON.stringify(response, null, 2)
            }).catch(error => {
                this.response = 'Error: ' + error.response.status
            })
            
        },

        getLedClass(status) {
            switch (status) {
            case 'not-ready':
                return 'led-blue';
            case 'offline':
                return 'led-gray';
            case 'ready':
                return 'led-green';
            case 'providing':
                return 'led-orange';
            default:
                return '';
            }
        },

        onRowSelected(selectedItems) {
        this.selected = selectedItems;
        },
        selectAllRows() {
        this.$refs.selectableTable.selectAllRows();
        },
        clearSelected() {
        this.$refs.selectableTable.clearSelected();
        },

        doSubscribe() {
        const { topic, qos } = this.subscription;
        this.client.subscribe(topic, { qos: qos });
      },

      createConnection() {
        try {
            
          this.connecting = true;
          const { protocol, host, port, endpoint, clientId, connectTimeout, reconnectPeriod } = this.connection;
          const connectUrl = `${protocol}://${host}:${port}${endpoint}`;
          this.client = new PahoMQTT.Client(connectUrl, clientId);

          // Set additional client options if needed
          this.client.connectTimeout = connectTimeout;
          this.client.reconnectPeriod = reconnectPeriod;

          // Set up event listeners
        
          this.client.onConnectionLost = this.onConnectionLost.bind(this); // Bind to the component's context
          this.client.onMessageArrived = this.onMessageArrived.bind(this); // Bind to the component's context


          // Connect to the MQTT broker
          this.client.connect({
            onSuccess: () => {
              this.connecting = false;
              console.log('Connected to MQTT broker');
              this.doSubscribe(); // Subscribe after successful connection
            },
            onFailure: (error) => {
              this.connecting = false;
              console.error('MQTT connection failed:', error);
            },
          });
        } catch (error) {
          this.connecting = false;
          console.error('mqtt.connect error', error);
        }
      },
      onConnectionLost(responseObject) {
        if (responseObject.errorCode !== 0) {
          console.error('MQTT Connection Lost:', responseObject.errorMessage);
          // Handle reconnection logic here if needed
        }
      },
      onMessageArrived(message) {        
        try {
          const topic = message.destinationName;
          const payload = message.payloadString;

          // Process the incoming message here
          const parsedPayload = JSON.parse(payload);
          let dev = topic.split("/")[1]
          let pow = parsedPayload.payload.power

          this.sm_coeff.forEach(el=>{
            let keyId = Object.keys(el);                
              if(keyId[0] === dev){
                if(keyId[0] === "sm-0001" || keyId[0] === "sm-0016")
                {
                  pow *=-1
                }
                pow *=el[keyId[0]]
              }
          })
          let devObj = {
            "dev":dev,
            "power":pow.toFixed(2),
            "ready":parsedPayload.payload.gridReady,
            "providing":parsedPayload.payload.providing                
          }
          let found = this.all.find(element => element.id === devObj.dev)
          if(found){              
            found.power = devObj.power
            found.providing = devObj.providing
            found.online = 'online'
            found.ready = devObj.ready
            found.customer = parsedPayload.payload.blynkName
            if (found.ready == 1)
            {
              if (found.providing == 0)
              {
              found.online = 'ready'
              }
              else if (found.providing == 1)
              {
                found.online = 'providing'
              }
            }
            else if (found.ready == 0)
            {
              found.online = 'not-ready'
            }
            else{
              found.online = 'offline'
            }          
            
          }
          this.allDevsCreation(this.all);
        } catch (error) {
          console.error('Error processing MQTT message:', error);
        }
      },
      createAllDevs() {
        // Generate device IDs upfront with the correct format
        const deviceIds = Array.from({ length: 31 }, (_, i) =>
            `sm-${(i + 1).toString().padStart(4, '0')}`
        );

        // Map device IDs to device objects, incorporating coords data
        this.all = deviceIds.map(id => {
            // Find coordinates for the current device, if available
            const coord = coords.find(coord => coord[id]);
            const deviceType = ['sm-0001', 'sm-0016'].includes(id) ? 'Producer' : 'Consumer';
            
            return {
            id: id,
            online: 'offline', // Default state
            power: 'N/A',
            lat: coord ? coord[id].lat : undefined,
            long: coord ? coord[id].long : undefined,                  
            type: deviceType,
            customer:'',
            capacity:''            
            };
        });

        // Directly generate ids and forecastIds from the all array
        this.ids = this.all.map(device => device.id);
        this.forecastIds = this.ids.map(id => `${id}F`);
        //commit all to store
        this.allDevsCreation(this.all);
    } 
       },
  
    created (){       
      this.createAllDevs()
      this.createConnection()
      this.capacityLog()
    },
    beforeDestroy () {
         clearInterval(this.polling)
    },
    computed: {
      isDisabled: function(){
          return !this.power || !this.countDown;
      }
    }
  
  
  
  };
  </script>
  
  <style scoped>
  .led-indicator {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 5px;
}

.led-blue {
  background-color:skyblue;
}

.led-gray {
  background-color: gray;
}

.led-green {
  background-color: green;
}

.led-orange {
  background-color: orange;
}
  </style>
  