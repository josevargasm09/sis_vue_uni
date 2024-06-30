<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            Marcas
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="openCreateDialog">Agregar Marca</v-btn>
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
              :items="filteredBrands"
              item-key="id"
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

    <BrandFormModal ref="brandFormModal" @updateList="fetchBrands" />
    
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmar Eliminación</v-card-title>
        <v-card-text>¿Estás seguro de que deseas eliminar esta marca?</v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="confirmDeleteBrand">Eliminar</v-btn>
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
import BrandService from '../services/brand.service.js';
import BrandFormModal from './BrandFormModal.vue';
import NotificationSnackbar from '../../../components/NotificationSnackbar.vue';

export default {
  components: {
    BrandFormModal,
    NotificationSnackbar
  },
  data() {
    return {
      search: '',
      brands: [],
      deleteDialog: false,
      brandToDelete: null,
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Nombre', value: 'name' },
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
    this.fetchBrands();
  },
  methods: {
    fetchBrands() {
      BrandService.getAllBrands()
        .then(response => {
          this.brands = response.data;
        })
        .catch(error => {
          if (error.response && error.response.status === 401) {
            this.$router.push('/app/sessions/login');
          } else {
            console.error('Error fetching brands:', error);
            this.showNotification(`Error al obtener las marcas: ${error.message}`, 'error');
          }
        });
    },
    openCreateDialog() {
      this.$refs.brandFormModal.open();
    },
    openEditDialog(brand) {
      this.$refs.brandFormModal.open(brand);
    },
    openDeleteDialog(brand) {
      this.brandToDelete = brand;
      this.deleteDialog = true;
    },
    confirmDeleteBrand() {
      BrandService.deleteBrand(this.brandToDelete.id)
        .then(() => {
          this.fetchBrands();
          this.deleteDialog = false;
          this.showNotification('Marca eliminada correctamente', 'success');
        })
        .catch(error => {
          this.deleteDialog = false;
          this.showNotification(`Error al eliminar la marca: ${error.message}`, 'error');
          if (error.response && error.response.status === 401) {
            this.$router.push('/app/sessions/login');
          } else {
            console.error('Error deleting brand:', error);
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
    filteredBrands() {
      return this.brands.filter(brand => 
        brand.name.toLowerCase().includes(this.search.toLowerCase())
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
