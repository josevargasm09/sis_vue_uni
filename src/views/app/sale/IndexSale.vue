<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            Ventas
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="openCreateDialog">Registrar Venta</v-btn>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="saleQuery"
              label="Buscar Venta (Cliente, Fecha)"
              outlined
              dense
              prepend-inner-icon="mdi-magnify"
              @input="searchSale"
            ></v-text-field>
            <v-data-table
              :headers="headers"
              :items="sales"
              item-key="id"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }">
                <div class="d-flex">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="success" dark v-bind="attrs" v-on="on" icon @click="openEditDialog(item)">
                        <v-icon>mdi-pencil-box-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Editar</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="danger" dark v-bind="attrs" v-on="on" icon @click="openDeleteDialog(item)">
                        <v-icon>mdi-trash-can-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Eliminar</span>
                  </v-tooltip>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <sale-form-modal ref="saleFormModal" @saleSaved="fetchSales"></sale-form-modal>
    <!-- Confirm Delete Modal -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmar Eliminación</v-card-title>
        <v-card-text>¿Estás seguro de que deseas eliminar esta venta?</v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="confirmDeleteSale">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Notification Snackbar -->
    <notification-snackbar
      :message="notification.message"
      :color="notification.color"
      v-if="notification.visible"
    />
  </v-container>
</template>

<script>
import SaleService from '../services/sale.service';
import SaleFormModal from './SaleFormModal.vue';
import NotificationSnackbar from '../../../components/NotificationSnackbar.vue';

export default {
  components: {
    SaleFormModal,
    NotificationSnackbar
  },
  data() {
    return {
      saleQuery: '',
      sales: [],
      headers: [
        { text: 'Cliente', value: 'client.name' },
        { text: 'Fecha', value: 'saleDate' },
        { text: 'Total', value: 'totalAmount' },
        { text: 'Acciones', value: 'actions', sortable: false }
      ],
      deleteDialog: false,
      saleToDelete: null,
      notification: {
        visible: false,
        message: '',
        color: 'success'
      }
    };
  },
  created() {
    this.fetchSales();
  },
  methods: {
    fetchSales() {
      SaleService.getAllSales().then(response => {
        this.sales = response.data;
      }).catch(error => {
        this.showNotification(`Error al obtener ventas: ${error.message}`, 'error');
        console.error('Error fetching sales:', error);
      });
    },
    openCreateDialog() {
      this.$refs.saleFormModal.open();
    },
    openEditDialog(sale) {
      this.$refs.saleFormModal.open(sale);
    },
    openDeleteDialog(sale) {
      this.saleToDelete = sale;
      this.deleteDialog = true;
    },
    confirmDeleteSale() {
      SaleService.deleteSale(this.saleToDelete.id).then(() => {
        this.fetchSales();
        this.deleteDialog = false;
        this.showNotification('Venta eliminada correctamente', 'success');
      }).catch(error => {
        this.deleteDialog = false;
        this.showNotification(`Error al eliminar venta: ${error.message}`, 'error');
        console.error('Error deleting sale:', error);
      });
    },
    searchSale() {
      if (this.saleQuery.length > 0) {
        SaleService.searchSales(this.saleQuery).then(response => {
          this.sales = response.data;
        }).catch(error => {
          this.showNotification(`Error al buscar ventas: ${error.message}`, 'error');
          console.error('Error searching sales:', error);
        });
      } else {
        this.fetchSales();
      }
    },
    showNotification(message, color) {
      this.notification.message = message;
      this.notification.color = color;
      this.notification.visible = true;

      setTimeout(() => {
        this.notification.visible = false;
      }, 3000);
    }
  }
};
</script>

<style scoped>
.v-data-table {
  margin-top: 20px;
}
</style>
