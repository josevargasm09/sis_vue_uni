<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            Clientes
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="openCreateDialog">Agregar Cliente</v-btn>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="clientQuery"
              label="Buscar Cliente (Nombre o DNI)"
              outlined
              dense
              prepend-inner-icon="mdi-magnify"
              @input="searchClient"
            ></v-text-field>
            <v-data-table
              :headers="headers"
              :items="clients"
              item-key="id"
              class="elevation-1"
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
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
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
  </v-container>
</template>

<script>
import ClientService from '../services/client.service.js';
import ClientFormModal from './ClientFormModal.vue';
import NotificationSnackbar from '../../../components/NotificationSnackbar.vue';

export default {
  components: {
    ClientFormModal,
    NotificationSnackbar
  },
  data() {
    return {
      clientQuery: '',
      clients: [],
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Nombre', value: 'name' },
        { text: 'DNI', value: 'dni' },
        { text: 'Dirección', value: 'address' },
        { text: 'Email', value: 'email' },
        { text: 'Teléfono', value: 'phone' },
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
      ClientService.getAllClients().then(response => {
        this.clients = response.data;
      }).catch(error => {
        this.showNotification(`Error al obtener clientes: ${error.message}`, 'error');
        console.error('Error fetching clients:', error);
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
      ClientService.deleteClient(this.clientToDelete.id).then(() => {
        this.fetchClients();
        this.deleteDialog = false;
        this.showNotification('Cliente eliminado correctamente', 'success');
      }).catch(error => {
        this.deleteDialog = false;
        this.showNotification(`Error al eliminar cliente: ${error.message}`, 'error');
        console.error('Error deleting client:', error);
      });
    },
    searchClient() {
      if (this.clientQuery.length > 0) {
        ClientService.searchClients(this.clientQuery).then(response => {
          this.clients = response.data;
        }).catch(error => {
          this.showNotification(`Error al buscar clientes: ${error.message}`, 'error');
          console.error('Error searching clients:', error);
        });
      } else {
        this.fetchClients();
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
