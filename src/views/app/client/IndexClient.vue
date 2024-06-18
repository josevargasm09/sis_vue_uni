<!-- src/views/app/client/IndexClient.vue -->
<template>
  <v-row>
    <v-col cols="12">
      <base-card>
        <v-card-title>
          Clientes
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="openCreateDialog">Agregar Cliente</v-btn>
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
          :items="clients"
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
      <ClientFormModal ref="clientFormModal" @updateList="fetchClients" />
      <!-- Confirm Delete Modal -->
      <v-dialog v-model="deleteDialog" max-width="500px">
        <v-card>
          <v-card-title class="headline">Confirmar Eliminación</v-card-title>
          <v-card-text>¿Estás seguro de que deseas eliminar este cliente?</v-card-text>
          <v-card-actions>
            <v-btn color="error" @click="deleteDialog = false">Cancelar</v-btn>
            <v-btn color="primary" @click="confirmDeleteClient">Eliminar</v-btn>
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
</template>

<script>
import ClientService from '../services/client.service';
import ClientFormModal from './ClientFormModal.vue';
import NotificationSnackbar from '../../../components/NotificationSnackbar.vue';

export default {
  components: {
    ClientFormModal,
    NotificationSnackbar
  },
  data() {
    return {
      search: '',
      clients: [],
      selected: [],
      headers: [
        { text: 'Nombre', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: 'Teléfono', value: 'phone' },
        { text: 'Dirección', value: 'address' },
        { text: 'Acciones', value: 'action', sortable: false }
      ],
      deleteDialog: false,
      clientToDelete: null,
      notification: {
        visible: false,
        message: '',
        color: 'success'
      }
    };
  },
  created() {
    this.fetchClients();
  },
  methods: {
    fetchClients() {
      ClientService.getAllClients()
        .then(response => {
          this.clients = response.data;
        })
        .catch(error => {
          if (error.response && error.response.status === 401) {
            this.$router.push('/app/sessions/login');
          } else {
            console.error('Error fetching clients:', error);
          }
        });
    },
    openCreateDialog() {
      this.$refs.clientFormModal.open();
    },
    openEditDialog(client) {
      this.$refs.clientFormModal.open(client);
    },
    openDeleteDialog(client) {
      this.clientToDelete = client;
      this.deleteDialog = true;
    },
    confirmDeleteClient() {
      ClientService.deleteClient(this.clientToDelete.id)
        .then(() => {
          this.fetchClients();
          this.deleteDialog = false;
          this.$store.dispatch('notification/showSnackbar', 
          { message: 'Cliente eliminado correctamente', color: 'success' });
        })
        .catch(error => {
          this.deleteDialog = false;
          this.showNotification(`Error al eliminar cliente: ${error.message}`, 'error');
          if (error.response && error.response.status === 401) {
            this.$router.push('/app/sessions/login');
          } else {
            console.error('Error deleting client:', error);
          }
        });
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
.table-one {
  width: 100%;
}
</style>
