<template>
  <v-row>
    <v-col cols="12">
      <base-card>
        <v-card-title>
          Lista de Roles
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="openCreateDialog">Agregar Rol</v-btn>
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="roles"
          item-key="id"
          class="elevation-1"
        >
          <template v-slot:item.name="{ item }">
            <v-chip>{{ item.name }}</v-chip>
          </template>
          <template v-slot:item.action="{ item }">
            <v-btn icon @click="openEditDialog(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon @click="deleteRole(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </base-card>

      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>
            {{ isEdit ? 'Editar Rol' : 'Agregar Rol' }}
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="role.name" label="Nombre del Rol"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <!-- <v-btn color="primary" @click="saveRole">{{ isEdit ? 'Guardar Cambios' : 'Agregar Rol' }}</v-btn>
            <v-btn color="error" @click="closeDialog">Cancelar</v-btn> -->
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
// import RoleService from '../services/role.service.js';

export default {
  data() {
    return {
      roles: [],
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Nombre', value: 'name' },
        { text: 'Acciones', value: 'action', sortable: false },
      ],
      dialog: false,
      isEdit: false,
      role: {
        id: null,
        name: '',
      },
    };
  },
  // created() {
  //   this.fetchRoles();
  // },
  methods: {
    // fetchRoles() {
    //   RoleService.getAllRoles()
    //     .then(response => {
    //       this.roles = response.data;
    //     })
    //     .catch(error => {
    //       console.error('Error fetching roles:', error);
    //     });
    // },
    openCreateDialog() {
      this.resetRole();
      this.isEdit = false;
      this.dialog = true;
    },
    openEditDialog(role) {
      this.role = { ...role };
      this.isEdit = true;
      this.dialog = true;
    },
    // saveRole() {
    //   if (this.isEdit) {
    //     RoleService.updateRole(this.role.id, this.role)
    //       .then(() => {
    //         this.fetchRoles();
    //         this.closeDialog();
    //       })
    //       .catch(error => {
    //         console.error('Error updating role:', error);
    //       });
    //   } else {
    //     RoleService.createRole(this.role)
    //       .then(() => {
    //         this.fetchRoles();
    //         this.closeDialog();
    //       })
    //       .catch(error => {
    //         console.error('Error creating role:', error);
    //       });
    //   }
    // },
    // deleteRole(id) {
    //   RoleService.deleteRole(id)
    //     .then(() => {
    //       this.fetchRoles();
    //     })
    //     .catch(error => {
    //       console.error('Error deleting role:', error);
    //     });
    // },
    // closeDialog() {
    //   this.dialog = false;
    // },
    // resetRole() {
    //   this.role = { id: null, name: '' };
    // },
  },
};
</script>

<style scoped>
.table-one {
  width: 100%;
}
</style>
