<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <base-card>
          <v-card-title>
            Comprobantes
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="openCreateDialog">Agregar Comprobante</v-btn>
          </v-card-title>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            v-model="selected"
            :search="search"
            :headers="headers"
            :items="invoices"
            item-key="id"
            show-select
            class="elevation-1 table-one"
            multi-sort
          >
            <template v-slot:item.action="{ item }">
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
        </base-card>
        <!-- Form Modal -->
        <InvoiceFormModal ref="invoiceFormModal" @updateList="fetchInvoices" />
        <!-- Confirm Delete Modal -->
        <v-dialog v-model="deleteDialog" max-width="500px">
          <v-card>
            <v-card-title class="headline">Confirmar Eliminación</v-card-title>
            <v-card-text>¿Estás seguro de que deseas eliminar este comprobante?</v-card-text>
            <v-card-actions>
              <v-btn color="error" @click="deleteDialog = false">Cancelar</v-btn>
              <v-btn color="primary" @click="confirmDeleteInvoice">Eliminar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- Notification Snackbar -->
        <NotificationSnackbar
          :message="notification.message"
          :color="notification.color"
          v-if="notification.visible"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import InvoiceService from '../services/invoice.service.js';
import InvoiceFormModal from './InvoiceFormModal.vue';
import NotificationSnackbar from '../../../components/NotificationSnackbar.vue';

export default {
  components: {
    InvoiceFormModal,
    NotificationSnackbar
  },
  data() {
    return {
      search: '',
      invoices: [],
      selected: [],
      headers: [
        { text: 'Tipo', value: 'type' },
        { text: 'Serie', value: 'series' },
        { text: 'Número', value: 'number' },
        { text: 'Estado', value: 'status' },
        { text: 'Fecha', value: 'date' },
        { text: 'Acciones', value: 'action', sortable: false }
      ],
      deleteDialog: false,
      invoiceToDelete: null,
      notification: {
        visible: false,
        message: '',
        color: 'success'
      }
    };
  },
  created() {
    this.fetchInvoices();
  },
  methods: {
    fetchInvoices() {
      InvoiceService.getAllInvoices()
        .then(response => {
          this.invoices = response.data;
        })
        .catch(error => {
          if (error.response && error.response.status === 401) {
            this.$router.push('/app/sessions/login');
          } else {
            console.error('Error fetching invoices:', error);
          }
        });
    },
    openCreateDialog() {
      this.$refs.invoiceFormModal.open();
    },
    openEditDialog(invoice) {
      this.$refs.invoiceFormModal.open(invoice);
    },
    openDeleteDialog(invoice) {
      this.invoiceToDelete = invoice;
      this.deleteDialog = true;
    },
    confirmDeleteInvoice() {
      InvoiceService.deleteInvoice(this.invoiceToDelete.id)
        .then(() => {
          this.fetchInvoices();
          this.deleteDialog = false;
          this.$store.dispatch('notification/showSnackbar', 
          { message: 'Comprobante eliminado correctamente', color: 'success' });
        })
        .catch(error => {
          if (error.response && error.response.status === 401) {
            this.$router.push('/app/sessions/login');
          } else {
            console.error('Error deleting invoice:', error);
            this.$store.dispatch('notification/showSnackbar', 
            { message: `Error al eliminar comprobante: ${error.message}`, color: 'error' });
          }
        });
    }
  }
};
</script>

<style scoped>
.table-one {
  width: 100%;
}
</style>
