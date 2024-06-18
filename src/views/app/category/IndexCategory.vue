<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <base-card>
          <v-card-title>
            Categorías
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="openCreateDialog">Agregar Categoría</v-btn>
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
            :search="search"
            :headers="headers"
            :items="categories"
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
        </base-card>
      </v-col>
    </v-row>

    <!-- Form Modal -->
    <CategoryFormModal ref="categoryFormModal" @updateList="fetchCategories" />
    
    <!-- Confirm Delete Modal -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmar Eliminación</v-card-title>
        <v-card-text>¿Estás seguro de que deseas eliminar esta categoría?</v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="confirmDeleteCategory">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import CategoryService from '../services/category.service.js';
import CategoryFormModal from './CategoryFormModal.vue';

export default {
  components: {
    CategoryFormModal
  },
  data() {
    return {
      search: '',
      categories: [],
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Nombre', value: 'name' },
        { text: 'Acciones', value: 'action', sortable: false }
      ],
      deleteDialog: false,
      categoryToDelete: null
    };
  },
  created() {
    this.fetchCategories();
  },
  methods: {
    fetchCategories() {
      CategoryService.getAllCategories()
        .then(response => {
          this.categories = response.data;
        })
        .catch(error => {
          if (error.response && error.response.status === 401) {
            this.$router.push('/app/sessions/login');
          } else {
            console.error('Error fetching categories:', error);
          }
        });
    },
    openCreateDialog() {
      this.$refs.categoryFormModal.open();
    },
    openEditDialog(category) {
      this.$refs.categoryFormModal.open(category);
    },
    openDeleteDialog(category) {
      this.categoryToDelete = category;
      this.deleteDialog = true;
    },
    confirmDeleteCategory() {
      CategoryService.deleteCategory(this.categoryToDelete.id)
        .then(() => {
          this.fetchCategories();
          this.deleteDialog = false;
          this.showNotification('Categoría eliminada correctamente', 'success');
        })
        .catch(error => {
          this.deleteDialog = false;
          this.showNotification(`Error al eliminar categoría: ${error.message}`, 'error');
        });
    },
    showNotification(message, color) {
      this.$store.dispatch('notification/showSnackbar', {
        message: message,
        color: color
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
