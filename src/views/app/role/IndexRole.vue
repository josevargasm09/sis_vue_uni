<!-- src/views/app/role/IndexRole.vue -->
<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            Roles
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="openCreateDialog">Agregar Rol</v-btn>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="roles"
              item-key="id"
            >
              <template v-slot:item.action="{ item }">
                <v-icon small @click="openEditDialog(item)">mdi-pencil</v-icon>
                <v-icon small @click="openDeleteDialog(item)">mdi-delete</v-icon>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <RoleFormModal ref="roleFormModal" @updateList="fetchRoles" />
  </v-container>
</template>

<script>
import RoleFormModal from './RoleFormModal.vue';
import RoleService from '../services/role.service.js';

export default {
  components: {
    RoleFormModal
  },
  data() {
    return {
      roles: [],
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Nombre', value: 'name' },
        { text: 'Acciones', value: 'action', sortable: false }
      ]
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
      if (confirm('¿Estás seguro de que deseas eliminar este rol?')) {
        RoleService.deleteRole(role.id)
          .then(() => {
            this.fetchRoles();
          })
          .catch(error => {
            console.error('Error deleting role:', error);
          });
      }
    }
  }
};
</script>

<style scoped>
.v-data-table {
  margin-top: 20px;
}
</style>
