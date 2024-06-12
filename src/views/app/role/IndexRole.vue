<template>
  <v-row>
    <v-col cols="12">
      <base-card>
        <v-card-title>
          <div class="d-flex justify-space-between flex-wrap">
            <v-btn class="ma-2" dark color="danger" @click="openCreateDialog">
              <v-icon>mdi-plus</v-icon>
              Agregar Rol 
            </v-btn>
            <div>
              <v-btn class="ma-2" color="primary">
                <v-icon>mdi-cog</v-icon>
              </v-btn>
              <v-btn outlined class="ma-2">Import</v-btn>
              <v-btn outlined class="ma-2">Export</v-btn>
            </div>
          </div>
        </v-card-title>
        <v-card-title>
          Roles
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
          :items="roles"
          item-key="name"
          show-select
          class="elevation-1 table-one"
          multi-sort
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
      <!-- Form Modal -->
      <RoleFormModal ref="roleFormModal" @updateList="fetchRoles"/>
      <!-- Confirm Delete Modal -->
      <v-dialog v-model="deleteDialog" max-width="500px">
        <v-card>
          <v-card-title class="headline">Confirmar Eliminación</v-card-title>
          <v-card-text>¿Estás seguro de que deseas eliminar este rol?</v-card-text>
          <v-card-actions>
            <v-btn color="error" @click="deleteDialog = false">Cancelar</v-btn>
            <v-btn color="primary" @click="confirmDeleteRole">Eliminar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>

import RoleFormModal from './RoleFormModal.vue';
import RoleService from '../services/role.service.js';

export default {
  data() {
    return {
      search: '',
      roles: [],
      selected: [],
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Actions', value: 'action', sortable: false },
        // Otros encabezados según sea necesario
      ],
      deleteDialog: false,
      roleToDelete: null
    };
  },
  created() {
    this.fetchRoles();
  },
  methods: {
    fetchRoles() {
      RoleService.getAllRoles()
        .then(response => {
          this.roles = response.data;
        })
        .catch(error => {
          console.error('Error fetching roles:', error);
        });
    },
    openCreateDialog() {
      this.$refs.roleFormModal.open();
    },
    openEditDialog(role) {
      this.$refs.roleFormModal.open(role);
    },
    openDeleteDialog(role) {
      this.roleToDelete = role;
      this.deleteDialog = true;
    },
    confirmDeleteRole() {
      RoleService.deleteRole(this.roleToDelete.id)
        .then(() => {
          this.fetchRoles();
          this.deleteDialog = false;
        })
        .catch(error => {
          console.error('Error deleting role:', error);
        });
    }
  },
  components: {
    RoleFormModal
  }
};
</script>

<style scoped>
.table-one {
  width: 100%;
}
</style>
