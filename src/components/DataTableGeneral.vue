<template>
  <v-row dense>
    <v-col cols="12" >
              <v-row>
                  <v-col cols="12"  md="2">
                     <v-btn icon>
                        <v-icon color="warning" >mdi-reload</v-icon>
                    </v-btn>
                    <v-btn icon >
                        <v-icon color="success">mdi-file-excel-outline </v-icon>
                    </v-btn>
                    <v-btn icon>
                        <v-icon color="info" @click="exportPdf">mdi-file-pdf-box </v-icon>
                    </v-btn>
                  </v-col>
                  <v-col cols="12"  md="4">
                    <h5 class="font-weight-bold pt-1 ma-0 text--secondary">{{title}}</h5>
                  </v-col>
                  <v-col cols="12"  md="6">
                    <v-text-field
                        v-model="serverParams.search"
                        clearable
                        clear-icon="mdi-close-circle-outline"
                        filled
                        solo
                        hide-details
                        dense
                        placeholder="Buscar"
                        autofocus
                        label="Buscar "
                        background-color="#EBEBE4"
                        @input="onSearch"
                    >
                      <template #prepend-inner><v-icon color="primary">mdi-magnify</v-icon></template>
                    </v-text-field>
                  </v-col>
              </v-row>
              <v-spacer></v-spacer>
    </v-col>
    <v-col cols="12" >
      <v-data-table
        header-color="#FF0000"
        :headers="headers"
        :items="items"
        :options.sync="options"
        :server-items-length="totalItems"
        :loading="loading"
        fixed-header
        :height="300"
        dense
        :item-key="idTable"
        :item-class="getSelectedClass"
        class="elevation-1"
        :single-select="true"
        @click:row="onRowClick"
        :footer-props="{
                      'items-per-page-text':'Items por página',
                      'items-per-page-options': [10, 20,50,100, 300, 500, 1000],
                      'show-current-page':true,
                      'show-first-last-page':true,
                  }"
      >
                    <template v-slot:[`footer.page-text`]="items">
                        {{ items.pageStart }} - {{ items.pageStop }} de {{ items.itemsLength }}
                    </template>
      </v-data-table>              
    </v-col>  
  </v-row>
</template>
<script>
import axios from 'axios';
export default {
  metaInfo: {
    title: "Datatable",
  },
  props: {
    idTable: String,
    path: {
      type: String,
      default: ''
    },
    headers: {
      type: Array,
      default: [],
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      options: {
        sortBy: ['id'],
        sortDesc: [false],
        itemsPerPage: 10,
      },
      totalPassengers: 0,
      serverParams: {
        search: '',
        columnFilters: {},
        sort: {
          field: '', // example: 'name'
          type: '' // 'asc' or 'desc'
        },
        columns: {},
        colModel: [],//para el pdf y excel
        page: 1,
        perPage: 10
      },
      page: 1,
      perPage: 15,
      loading: false,
      totalItems: 0,
      search: '',
      selectedRow: null,
      items: [],
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    exportPdf() {
      this.$emit('exportPdf');
    },
    getSelectedClass(item) {
      return {
        'selected-row': item.id === this.selectedItem?.id,
      };
    },
    dblClick(event, { item }) {
      this.$refs.load.starting();
      this.$nextTick(() => {
        this.$emit('dblClick', item);
        this.$refs.load.ending();
      });
    },
    getSelectedRow() {
      return this.selectedRow;
    },
    onSearch(){
        this.options.page=1;
        this.fetchData();
    },
    updateParams() {
      const { page, itemsPerPage, sortBy, sortDesc } = this.options;
      
      let columns = [];
      // this.columns.forEach((item)=>{
      //     const filterable=(item.filterable!=undefined)?item.filterable:true
      //     if(filterable){
      //         columns.push(item.value);
      //     }
      // });
      const newProps = {
        page: page,
        perPage: itemsPerPage,
        sort: {
          type: (sortDesc[0] === true) ? 'desc' : 'asc',
          field: (sortBy[0] !== undefined) ? sortBy[0] : '',
        },
      }
      this.serverParams = Object.assign({}, this.serverParams, newProps);
      // this.serverParams.columns=columns;
    },
    onRowClick(row, event) {
      event.select(true);
      console.log(row, "dddd")
      this.selectedRow = row;
      // this.rowSelected
    },
    
    fetchData() {
      console.log("entro search",this.search);
      this.loading = true;
      this.updateParams();
    
      axios.get("/user", {
        
        params: {
          
                    ...this.serverParams,
          },
          
      })
      
        .then(response => {
          console.log("Fetching data with search:", this.serverParams.search);
          console.log( response.data,"if");
          let res = response.data;
          this.loading = false;
          this.totalItems = res.meta.total;
          this.items = res.data;
        })
        .catch(function (error) {
          console.error(error);
        });
    },
  },
  watch: {
    search() {
      this.fetchData();
    },
    totalItems() {
      console.log("dtrej");
    },
    perPage: {
      handler() {
        console.log("bbbbbb");
      },
      deep: true,
    },
    options: {
      handler() {
        this.fetchData();
      },
      deep: true,
    },

    page() {
      this.fetchData();
    },

  },
  computed: {
    isSelected() {
      return (item) => item.id === this.selectedItem?.id;
    },
  },
}
</script>
<style lang="scss" >
::v-deep .my-custom-dialog {
  align-self: flex-start;
}

.v-data-table__selected {
  background-color: rgb(209, 243, 232) !important;
}
</style>