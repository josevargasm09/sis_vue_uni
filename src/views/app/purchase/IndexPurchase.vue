<template>
  <div>
    <v-card>
      <v-card-title>
        <span class="headline">Compras</span>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openCreateDialog">AGREGAR COMPRA</v-btn>
      </v-card-title>
      <v-card-text>
        <v-text-field v-model="search" label="Buscar" solo-inverted hide-details></v-text-field>
        <v-data-table
          :headers="headers"
          :items="filteredPurchases"
          item-key="id"
          class="elevation-1"
        >
          <template v-slot:item.purchaseDate="{ item }">
            <span>{{ formatPurchaseDate(item.purchaseDate) }}</span>
          </template>
          <template v-slot:item.supplier="{ item }">
            <span>{{ getSupplierName(item.supplierId) }}</span>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn icon @click="openEditDialog(item)">
              <v-icon color="green">mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="deletePurchase(item.id)">
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <PurchaseFormModal ref="purchaseFormModal" @updateList="fetchPurchases" @showNotification="showNotification" />
    <NotificationSnackbar :message="snackbarMessage" :color="snackbarColor" :timeout="snackbarTimeout" v-if="showSnackbar" />
  </div>
</template>

<script>
import PurchaseFormModal from './PurchaseFormModal.vue';
import NotificationSnackbar from '@/components/NotificationSnackbar.vue';
import purchaseService from '../services/purchase.service';
import supplierService from '../services/supplier.service';

export default {
  components: {
    PurchaseFormModal,
    NotificationSnackbar
  },
  data() {
    return {
      search: '',
      purchases: [],
      suppliers: [],
      headers: [
        { text: 'Fecha de Compra', value: 'purchaseDate' },
        { text: 'Proveedor', value: 'supplier' },
        { text: 'Monto Total', value: 'totalAmount' },
        { text: 'Acciones', value: 'actions', sortable: false },
      ],
      snackbarMessage: '',
      snackbarColor: '',
      snackbarTimeout: 3000,
      showSnackbar: false,
    };
  },
  computed: {
    filteredPurchases() {
      return this.purchases.filter((purchase) => {
        return (
          this.formatPurchaseDate(purchase.purchaseDate).includes(this.search) ||
          this.getSupplierName(purchase.supplierId).toLowerCase().includes(this.search.toLowerCase()) ||
          purchase.totalAmount.toString().includes(this.search)
        );
      });
    },
  },
  methods: {
    fetchPurchases() {
      purchaseService.getAllPurchases().then((response) => {
        this.purchases = response.data;
      });
      supplierService.getAllSuppliers().then((response) => {
        this.suppliers = response.data;
      });
    },
    openCreateDialog() {
      this.$refs.purchaseFormModal.open();
    },
    openEditDialog(purchase) {
      this.$refs.purchaseFormModal.open(purchase);
    },
    deletePurchase(id) {
      purchaseService.deletePurchase(id).then(() => {
        this.fetchPurchases();
        this.showNotification({ message: 'Compra eliminada correctamente', color: 'success' });
      }).catch(error => {
        this.showNotification({ message: `Error al eliminar compra: ${error.message}`, color: 'error' });
      });
    },
    formatPurchaseDate(date) {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0'); // Enero es 0
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    },
    getSupplierName(supplierId) {
      const supplier = this.suppliers.find((sup) => sup.id === supplierId);
      return supplier ? supplier.name : 'Desconocido';
    },
    showNotification({ message, color }) {
      this.snackbarMessage = message;
      this.snackbarColor = color;
      this.showSnackbar = true;
      setTimeout(() => {
        this.showSnackbar = false;
      }, this.snackbarTimeout);
    }
  },
  created() {
    this.fetchPurchases();
  },
};
</script>

<style scoped>
.headline {
  font-weight: bold;
}
</style>
