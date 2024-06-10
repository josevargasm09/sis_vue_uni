<template>
    <!-- <v-row>
      <v-col cols="12">
          <base-card>
              <v-card-title>
                
                  <div class="d-flex justify-space-between flex-wrap">
                      <v-btn   
                      @click="addUser" 
                      small depressed 
                      class="ma-2" 
                      dark 
                      color="danger">
                      <v-icon>mdi-plus</v-icon>
                          Add Customer ssss
                      </v-btn>
                      <div>
                          <v-btn class="ma-2" color="primary">
                              <v-icon>mdi-cog</v-icon>
                          </v-btn>
                          <v-btn outlined class="ma-2">Import</v-btn>
                          <v-btn outlined class="ma-2">Export</v-btn>
                      </div>
                  </div>
              </v-card-title>
              <v-card-title>
                  Customers
                  <v-spacer></v-spacer>
                  <v-spacer></v-spacer>
                  <v-spacer></v-spacer>
                  <v-spacer></v-spacer>

                  <v-text-field
                     
                      append-icon="mdi-magnify"
                      label="Search"
                      single-line
                      hide-details
                  ></v-text-field>
              </v-card-title>
              <data-table-general 
              ref="dataTableGeneral"
              path='/app/dashboard/analytic'
              :headers="headers"
              @dblClick="edit"
              idTable="id"
             
            ></data-table-general>
          </base-card>
      </v-col>
  </v-row> -->
</template>
<script>
import analyticOneCard from "@/components/card/AnalyticCardVersionOne";
import analyticTwoCard from "@/components/card/AnalyticCardVersionTwo";
import {
  analyticOne,
  analyticTwo,
  analyticThree,
  analyticFour,
  analyticFive,
} from "@/data/analytic2";
export default {
  name: "Analytic",
  metaInfo: {
    // title will be injected into parent titleTemplate
    title: "Analytic",
  },
// agragado recientemente
  computed: {
    currentUser() {
 
      return this.$store.state.auth.user;
    }
  },

  mounted() {
    if (!this.currentUser) {
      this.$router.push('/login');
    }
  },

  components: {
    "analytic-one-card": analyticOneCard,
    "analytic-two-card": analyticTwoCard,
  },
  data() {
    return {
      analyticOne,
      analyticTwo,
      analyticThree,
      analyticFour,
      analyticFive,
    };
  },
};
</script>
