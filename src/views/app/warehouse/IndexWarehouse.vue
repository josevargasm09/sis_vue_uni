<!-- src/views/app/warehouse/IndexWarehouse.vue -->
<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            Almacenes
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="openCreateDialog">Agregar Almacén</v-btn>
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
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="filteredWarehouses"
              item-key="id"
            >
              <template v-slot:item.name="{ item }">
                <div>{{ item.name }}</div>
              </template>
              <template v-slot:item.location="{ item }">
                <div>{{ item.location }}</div>
              </template>
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

    <!-- Modal para formulario de almacenes -->
    <WarehouseFormModal ref="warehouseFormModal" @updateList="fetchWarehouses" />
    
    <!-- Modal para confirmar eliminación -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmar Eliminación</v-card-title>
        <v-card-text>¿Estás seguro de que deseas eliminar este almacén?</v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="confirmDeleteWarehouse">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Notification Snackbar -->
    <NotificationSnackbar
      :message="notification.message"
      :color="notification.color"
      :visible="notification.visible"
    />
  </v-container>
</template>

<script>
import WarehouseService from '../services/WarehouseService.js';
import WarehouseFormModal from './WarehouseFormModal.vue';
import NotificationSnackbar from '../../../components/NotificationSnackbar.vue';
export default {
  components: {
    WarehouseFormModal,
    NotificationSnackbar
  },
  data() {
    return {
      search: '',
      warehouses: [],
      deleteDialog: false,
      warehouseToDelete: null,
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Nombre', value: 'name' },
        { text: 'Ubicación', value: 'location' },
        { text: 'Acciones', value: 'action', sortable: false }
      ],
      notification: {
        visible: false,
        message: '',
        color: 'success'
      }
    };
  },
  created() {
    this.fetchWarehouses();
  },
  methods: {
    fetchWarehouses() {
      WarehouseService.getAllWarehouses()
        .then(response => {
          this.warehouses = response.data;
        })
        .catch(error => {
          this.showNotification(`Error al cargar los almacenes: ${error.message}`, 'error');
          if (error.response && error.response.status === 401) {
            this.$router.push('/app/sessions/login');
          } else {
            console.error('Error fetching warehouses:', error);
          }
        });
    },
    openCreateDialog() {
      this.$refs.warehouseFormModal.open();
    },
    openEditDialog(warehouse) {
      this.$refs.warehouseFormModal.open(warehouse);
    },
    openDeleteDialog(warehouse) {
      this.warehouseToDelete = warehouse;
      this.deleteDialog = true;
    },
    confirmDeleteWarehouse() {
      WarehouseService.deleteWarehouse(this.warehouseToDelete.id)
        .then(() => {
          this.fetchWarehouses();
          this.deleteDialog = false;
          this.showNotification('Almacén eliminado correctamente', 'success');
        })
        .catch(error => {
          this.deleteDialog = false;
          this.showNotification(`Error al eliminar el almacén: ${error.message}`, 'error');
          if (error.response && error.response.status === 401) {
            this.$router.push('/app/sessions/login');
          } else {
            console.error('Error deleting warehouse:', error);
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
  },
  computed: {
    filteredWarehouses() {
      return this.warehouses.filter(warehouse => 
        warehouse.name.toLowerCase().includes(this.search.toLowerCase()) ||
        warehouse.location.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  }
};
</script>

<style scoped>
.table-one {
  width: 100%;
}
</style>
