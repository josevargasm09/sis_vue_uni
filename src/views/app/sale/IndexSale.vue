<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <base-card>
          <v-card-title>
            Ventas
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="openCreateSaleDialog">Registrar Venta</v-btn>
          </v-card-title>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar venta"
            class="mx-4"
            solo
          ></v-text-field>
          <v-data-table
            :headers="headers"
            :items="sales"
            :search="search"
            item-key="id"
            class="elevation-1"
          >
            <template v-slot:item.action="{ item }">
              <v-btn icon @click="openEditSaleDialog(item)">
                <v-icon color="primary">mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="openDeleteSaleDialog(item)">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </base-card>
      </v-col>
    </v-row>
    <!-- Modal para registrar/editar venta -->
    <SaleFormModal
      v-model="saleModalVisible"
      :sale="selectedSale"
      @close="fetchSales"
    />

    <!-- Confirmación para eliminar venta -->
    <v-dialog v-model="deleteDialogVisible" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmar Eliminación</v-card-title>
        <v-card-text>¿Estás seguro de que deseas eliminar esta venta?</v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="deleteDialogVisible = false">Cancelar</v-btn>
          <v-btn color="primary" @click="confirmDeleteSale">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import SaleFormModal from './SaleFormModal.vue';
import SaleService from '../services/sale.service.js';

export default {
  components: {
    SaleFormModal
  },
  data() {
    return {
      search: '',
      sales: [],
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Cliente', value: 'clientName' },
        { text: 'Fecha', value: 'date' },
        { text: 'Total', value: 'total' },
        { text: 'Acciones', value: 'action', sortable: false }
      ],
      saleModalVisible: false,
      selectedSale: null,
      deleteDialogVisible: false,
      saleToDelete: null
    };
  },
  created() {
    this.fetchSales();
  },
  methods: {
    fetchSales() {
      SaleService.getAllSales()
        .then(response => {
          this.sales = response.data.map(sale => ({
            ...sale,
            clientName: sale.client.name, // Mapea el nombre del cliente para mostrar
            total: sale.total.toFixed(2) // Formatea el total
          }));
        })
        .catch(error => {
          console.error('Error fetching sales:', error);
        });
    },
    openCreateSaleDialog() {
      this.selectedSale = null;
      this.saleModalVisible = true;
    },
    openEditSaleDialog(sale) {
      this.selectedSale = sale;
      this.saleModalVisible = true;
    },
    openDeleteSaleDialog(sale) {
      this.saleToDelete = sale;
      this.deleteDialogVisible = true;
    },
    confirmDeleteSale() {
      SaleService.deleteSale(this.saleToDelete.id)
        .then(() => {
          this.fetchSales();
          this.deleteDialogVisible = false;
          this.$store.dispatch('notification/showSnackbar', {
            message: 'Venta eliminada correctamente',
            color: 'success'
          });
        })
        .catch(error => {
          console.error('Error deleting sale:', error);
          this.$store.dispatch('notification/showSnackbar', {
            message: `Error al eliminar la venta: ${error.message}`,
            color: 'error'
          });
        });
    }
  }
};
</script>

<style scoped>
.mx-4 {
  margin-left: 16px;
  margin-right: 16px;
}
</style>
