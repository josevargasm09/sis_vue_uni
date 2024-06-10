<template>
      <v-dialog
        content-class="my-custom-dialog"
        v-model="dialog"
        max-width="500px"
         hide-overlay
      >
        <v-card>
            <!-- <v-toolbar
              flat
              class="text-h6 grey lighten-4"
            >
            <v-toolbar-title>Usuario</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn
                icon
                dark
                @click="dialog = false"
              >
                <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar> -->
          <v-card-title class="text-h6 pa-0 pl-3  grey lighten-2" >
                    <p class="mb-0 text-capitalize secondary--text text-sm font-weight-semibold">
                      Usuario
                    </p>
                    <v-spacer></v-spacer>
                    <v-btn icon x-small dark @click="dialog = false" class="ma-1 secondary--text">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-card-title>
                <v-divider></v-divider>
          <v-card-text>
            <v-row dense>
                <v-col  densecols="12" md="12" sm="12">
                  <v-text-field
                    hide-details
                    label="Usuario"
                    outlined
                    class=" pa-1 black-border"
                    dense
                    v-model="form.name"
                  ></v-text-field>
                </v-col>
                <v-col  cols="12" md="12" sm="12">
                  <v-text-field
                    class="pa-1"
                    hide-details
                    label="email"
                    outlined
                    dense
                    v-model="form.email"
                  ></v-text-field>
                </v-col>  
                <v-col  cols="12" md="12" sm="12">
                  <v-text-field 
                    class="pa-1"
                    hide-details
                    outlined
                    dense
                    v-model="form.password"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rulesTwo.required, rulesTwo.min]"
                    :type="show1 ? 'text' : 'password'"
                    name="input-10-1"
                    label="Contraseña"
                    hint="At least 8 characters"
                    counter
                    @click:append="show1 = !show1"
                  />
                </v-col>
                <v-col  cols="12" md="12" sm="12">
                  <v-text-field 
                    class="pa-1"
                    hide-details
                    outlined
                    dense
                    v-model="form.remember_password"
                    :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                    :rules="[rulesTwo.required, rulesTwo.min]"
                    :type="show1 ? 'text' : 'password'"
                    name="input-10-1"
                    label="Repetir Contraseña"
                    hint="At least 8 characters"
                    counter
                    @click:append="show1 = !show1"
                  />
                </v-col>
                <v-col  cols="12" md="12" sm="12">
                  <v-select
                    v-model="form.profile_id"
                    class="pa-1"
                    :items="profiles"
                    hide-details
                    label="Perfil"
                    outlined
                    menu-props="offset-y"
                    dense
                    item-text="description"
                    item-value="id"
                  ></v-select>   
                </v-col>       
            </v-row>        
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="error"
              @click="dialog = false"
            >
              Cerrar
            </v-btn>
            <v-btn
              color="primary"
              @click="registerUser"
            >
              Guardar
            </v-btn>
            
          </v-card-actions>
        </v-card>
      </v-dialog>
  </template>
  <script>
    import Vue from "vue";
    const initFromData = {
      id:'-1',
      name:'',
      email:'',
      password:'',
      remember_password:'',
      profile_id:null,
    };
    export default {
    data () {
        return {
          form: Object.assign({}, initFromData),
          profiles:[],
          show1: false,
          dialog: false,
          password: 'Password',
          rulesTwo: {
            required: (value) => !!value || 'Required.',
            min: (v) => v.length >= 8 || 'Min 8 characters',
            emailMatch: () => "The email and password you entered don't match"
        },
        }
      },
    mounted () {
        this.init();
      },
    methods: {
      resetForm(){
        Vue.set(this.$data, 'form', Object.assign({}, initFromData));
      },
      setForm(data){ 
            this.resetForm();
            this.dialog=true;
            this.setFormData(this.form,data);
            // let record_product = this.plans.find(item => item.producto_id == data.producto_id);
            // this.resetForm();
            // this.setFormData(this.form,data.customer);
            // this.form.detalle_contacto=data.detail_contact_customer;
            // this.form.products=record_product;
           
            // this.$nextTick(()=>{
            //     if(this.global_billing=='SI'){
            //         this.$refs.selectPersonal.refreshLoad();
            //         this.$refs.selectPersonal.setValue(data);
            //     }
            //     if(this.form.tipo_doc!='-'){
            //         this.$refs.searchCustomer.setDocument(this.form.ruc);
            //     }
            // })
            // this.$refs.dlgCustomer.openModal();
        },
      registerUser() {
        axios.post('/api/user/store', this.form)
              .then(response => {
                this.$emit('updateList');
                  this.dialog=false;
                  // this.$refs.close.click();
                  // this.$refs.GridTable.list();
              })
              .catch(function (error) {
                  console.error(error);
              });
      },
      addOptionSelected(data){
        let option_selected = {
          id: null,
          description:"::Seleccionar::",
        };
        data.unshift(option_selected);
      },
      open(){
        this.resetForm();
        this.dialog=true;
      },
      init(){
            axios.get(`/api/profile/get/`)
              .then(response => {
                let res=response.data;
                this.profiles=res.profile;
                this.addOptionSelected(res.profile);
              })
              .catch(function (error) {
                console.error(error);
              });
      }
      },
    watch: {
        
        },
    computed: {
        
    },
    }
  </script>
  <style lang="scss" scoped>
  ::v-deep .my-custom-dialog {
      align-self: flex-start;
  }
  </style>