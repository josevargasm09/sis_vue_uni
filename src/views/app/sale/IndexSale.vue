<template>
  <div>
    <v-btn color="primary" @click="openDialog">Registrar Venta</v-btn>
    <sale-form-modal v-model="dialog" @saleSaved="fetchSales"></sale-form-modal>

    <v-data-table :headers="headers" :items="sales" class="elevation-1">
      <template v-slot:item.actions="{ item }">
        <v-btn icon @click="editSale(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="deleteSale(item)">
          <v-icon color="red">mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import SaleFormModal from './SaleFormModal.vue';
import SaleService from '../services/sale.service';

export default {
  components: {
    SaleFormModal
  },
  data() {
    return {
      dialog: false,
      sales: [],
      headers: [
        { text: 'Cliente', value: 'client.name' },
        { text: 'Fecha', value: 'saleDate' },
        { text: 'Total', value: 'totalAmount' },
        { text: 'Acciones', value: 'actions', sortable: false }
      ]
    };
  },
  methods: {
    openDialog() {
      this.dialog = true;
    },
    fetchSales() {
      SaleService.getAllSales().then(response => {
        this.sales = response.data;
      }).catch(error => {
        console.error('Error fetching sales:', error);
      });
    },
    editSale(sale) {
      // Implementar la lógica para editar una venta
    },
    deleteSale(sale) {
      // Implementar la lógica para eliminar una venta
    }
  },
  created() {
    this.fetchSales();
  }
};
</script>
