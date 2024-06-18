<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <base-card>
          <v-card-title>
            Sucursales
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="openCreateDialog">Agregar Sucursal</v-btn>
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
            :items="branches"
            item-key="id"
            class="elevation-1"
          >
            <template v-slot:item.name="{ item }">
              <div class="d-flex align-center">
                <p class="ma-0 font-weight-medium">{{ item.name }}</p>
              </div>
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
        </base-card>
      </v-col>
    </v-row>

    <!-- Form Modal -->
    <BranchFormModal ref="branchFormModal" @updateList="fetchBranches" />
    
    <!-- Confirm Delete Modal -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmar Eliminación</v-card-title>
        <v-card-text>¿Estás seguro de que deseas eliminar esta sucursal?</v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="confirmDeleteBranch">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import BranchService from '../services/branch.service.js';
import BranchFormModal from './BranchFormModal.vue';

export default {
  components: {
    BranchFormModal
  },
  data() {
    return {
      search: '',
      branches: [],
      headers: [
        { text: 'Nombre', value: 'name' },
        { text: 'Dirección', value: 'address' },
        { text: 'Teléfono', value: 'phone' },
        { text: 'Acciones', value: 'action', sortable: false }
      ],
      deleteDialog: false,
      branchToDelete: null
    };
  },
  created() {
    this.fetchBranches();
  },
  methods: {
    fetchBranches() {
      BranchService.getAllBranches()
        .then(response => {
          this.branches = response.data;
        })
        .catch(error => {
          console.error('Error fetching branches:', error);
        });
    },
    openCreateDialog() {
      this.$refs.branchFormModal.open();
    },
    openEditDialog(branch) {
      this.$refs.branchFormModal.open(branch);
    },
    openDeleteDialog(branch) {
      this.branchToDelete = branch;
      this.deleteDialog = true;
    },
    confirmDeleteBranch() {
      BranchService.deleteBranch(this.branchToDelete.id)
        .then(() => {
          this.fetchBranches();
          this.deleteDialog = false;
          this.$store.dispatch('notification/showSnackbar', {
            message: 'Sucursal eliminada correctamente',
            color: 'success'
          });
        })
        .catch(error => {
          console.error('Error deleting branch:', error);
          this.$store.dispatch('notification/showSnackbar', {
            message: `Error al eliminar sucursal: ${error.message}`,
            color: 'error'
          });
        });
    }
  }
};
</script>

<style scoped>
</style>
