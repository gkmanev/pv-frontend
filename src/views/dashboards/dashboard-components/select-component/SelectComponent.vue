<template>
    <div>
      <b-form-select v-model="selected" @change="setSelected(selected)" :options="options"></b-form-select>      
      <!-- <div class="mt-3">Selected: <strong>{{ selected }}</strong></div> -->
    </div>

  </template>
  
  <script>
    import { mapActions } from 'vuex';
    import { mapState } from 'vuex';
    export default {
        data() {
            return {
            selected: null,
                options: [
                  
                    { value: null, text: 'Please select an option' },
          
                   
                ],
            }
        },
        computed: {
            ...mapState(['all_devs'])     
            
        }, 
        
        mounted(){
            this.populateOptions()
           
        },


        methods:{
            ...mapActions(['updateSelected']),
            setSelected(sel){
                this.updateSelected(sel)
            },
            populateOptions() {       
               
                                         
                const devOptions = this.all_devs.map(dev => ({                    
                        value: dev.id, 
                        text: dev.id,  
                        online:dev.online                  
                }));
                
                devOptions.forEach(el=>{
                    if(el.online !== 'offline')
                    {
                        this.options.push(el)
                    }
                })
                //this.options.push(devOptions)

                         
            },
        },
        
    }
  </script>
          