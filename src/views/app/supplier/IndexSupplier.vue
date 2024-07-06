<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <base-card>
            <v-card-title>
              Proveedores
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="openCreateDialog">Agregar proveedor</v-btn>
            </v-card-title>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar"
              single-line
              hide-details
            ></v-text-field>
            <v-data-table
              v-model="selected"
              :headers="headers"
              :items="suppliers"
              item-key="id"
              class="elevation-1"
              :search="search"
            >
              <template v-slot:item.action="{ item }">
                <v-btn icon @click="openEditDialog(item)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon @click="confirmDelete(item)">
                  <v-icon color="red">mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </base-card>
        </v-col>
      </v-row>
      <supplier-form-modal ref="supplierFormModal" @updateList="fetchSuppliers"/>
      <v-dialog v-model="deleteDialog" max-width="500px">
        <v-card>
          <v-card-title class="headline">Confirmar eliminación</v-card-title>
          <v-card-text>¿Está seguro de que desea eliminar este proveedor?</v-card-text>
          <v-card-actions>
            <v-btn color="error" @click="deleteDialog = false">Cancelar</v-btn>
            <v-btn color="primary" @click="deleteSupplier">Eliminar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
  import SupplierService from '../services/supplier.service';
  import SupplierFormModal from './SupplierFormModal.vue';
  
  export default {
    components: {
      SupplierFormModal
    },
    data() {
      return {
        search: '',
        suppliers: [],
        selected: [],
        headers: [
          { text: 'ID', value: 'id' },
          { text: 'Nombre', value: 'name' },
          { text: 'Dirección', value: 'address' },
          { text: 'Teléfono', value: 'phone' },
          { text: 'Acciones', value: 'action', sortable: false }
        ],
        deleteDialog: false,
        supplierToDelete: null
      };
    },
    created() {
      this.fetchSuppliers();
    },
    methods: {
      fetchSuppliers() {
        SupplierService.getAllSuppliers()
          .then(response => {
            this.suppliers = response.data;
          })
          .catch(error => {
            console.error('Error fetching suppliers:', error);
          });
      },
      openCreateDialog() {
        this.$refs.supplierFormModal.open();
      },
      openEditDialog(supplier) {
        this.$refs.supplierFormModal.open(supplier);
      },
      confirmDelete(supplier) {
        this.supplierToDelete = supplier;
        this.deleteDialog = true;
      },
      deleteSupplier() {
        SupplierService.deleteSupplier(this.supplierToDelete.id)
          .then(() => {
            this.fetchSuppliers();
            this.deleteDialog = false;
          })
          .catch(error => {
            console.error('Error deleting supplier:', error);
          });
      }
    }
  };
  </script>
  
  <style scoped>
  .elevation-1 {
    margin-top: 20px;
  }
  </style>
  