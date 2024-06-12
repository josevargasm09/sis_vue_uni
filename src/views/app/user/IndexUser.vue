<template>
  <v-row>
    <v-col cols="12">
      <base-card>
        <v-card-title>
          <div class="d-flex justify-space-between flex-wrap">
            <v-btn class="ma-2" dark color="danger" @click="openCreateDialog">
              <v-icon>mdi-plus</v-icon>
              Agregar Usuario 
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
          Usuarios
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
          :items="users"
          item-key="username"
          show-select
          class="elevation-1 table-one"
          multi-sort
        >
          <template v-slot:item.username="{ item }">
            <div class="d-flex align-center">
              <p class="ma-0 font-weight-medium">{{ item.username }}</p>
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
      <UserFormModal ref="userFormModal" @updateList="fetchUsers"/>
      <!-- Confirm Delete Modal -->
      <v-dialog v-model="deleteDialog" max-width="500px">
        <v-card>
          <v-card-title class="headline">Confirmar Eliminación</v-card-title>
          <v-card-text>¿Estás seguro de que deseas eliminar este usuario?</v-card-text>
          <v-card-actions>
            <v-btn color="error" @click="deleteDialog = false">Cancelar</v-btn>
            <v-btn color="primary" @click="confirmDeleteUser">Eliminar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
import UserService from '../services/user.service.js'
import UserFormModal from './UserFormModal.vue';

export default {
  data() {
    return {
      search: '',
      users: [],
      selected: [],
      headers: [
        { text: 'Name', value: 'username' },
        { text: 'Email', value: 'email' },
        { text: 'Actions', value: 'action', sortable: false },
        // Otros encabezados según sea necesario
      ],
      deleteDialog: false,
      userToDelete: null
    };
  },
  created() {
    this.fetchUsers();
  },
  methods: {
    fetchUsers() {
      UserService.getAllUsers()
        .then(response => {
          this.users = response.data;
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
    },
    openCreateDialog() {
      this.$refs.userFormModal.open();
    },
    openEditDialog(user) {
      this.$refs.userFormModal.open(user);
    },
    openDeleteDialog(user) {
      this.userToDelete = user;
      this.deleteDialog = true;
    },
    confirmDeleteUser() {
      UserService.deleteUser(this.userToDelete.id)
        .then(() => {
          this.fetchUsers();
          this.deleteDialog = false;
        })
        .catch(error => {
          console.error('Error deleting user:', error);
        });
    }
  },
  components: {
    UserFormModal
  }
};
</script>

<style scoped>
.table-one {
  width: 100%;
}
</style>
