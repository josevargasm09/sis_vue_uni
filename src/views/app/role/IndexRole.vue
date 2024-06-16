
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
    <RoleFormModal ref="roleFormModal" @updateList="fetchRoles" />
    <!-- Confirm Delete Modal -->
    <v-dialog v-model="deleteDialog" max-width="500px">
        <v-card>
          <v-card-title class="headline">Confirmar Eliminación</v-card-title>
          <v-card-text>¿Estás seguro de que deseas eliminar este usuario?</v-card-text>
          <v-card-actions>
            <v-btn color="error" @click="deleteDialog = false">Cancelar</v-btn>
            <v-btn color="primary" @click="confirmDeleteRole">Eliminar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <NotificationSnackbar
      :message="notification.message"
      :color="notification.color"
      v-if="notification.visible"
    />
  </v-container>
</template>

<script>
import RoleFormModal from './RoleFormModal.vue';
import RoleService from '../services/role.service.js';
import NotificationSnackbar from '../../../components/NotificationSnackbar.vue';

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
      ],
      deleteDialog: false,
      roleToDelete: null,
     
      roleToDelete: null,
      notification: {
      visible: false,
      message: '',
      color: 'success'
    }
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
        // Mostrar notificación de éxito
        this.$store.dispatch('notification/showSnackbar', 
        { message: 'Rol eliminado correctamente', color: 'success' });
      })
      .catch(error => {
        if (error.response && error.response.status === 401) {
          this.$router.push('/app/sessions/login');
        } else {
          console.error('Error deleting role:', error);
          // Mostrar notificación de error
          this.$store.dispatch('notification/showSnackbar', 
          { message: `Error al eliminar rol: ${error.message}`, color: 'error' });
        }
      });
  }
    // openDeleteDialog(role) {
    //  {
    //     RoleService.deleteRole(role.id)
    //       .then(() => {
    //         this.fetchRoles();
    //       })
    //       .catch(error => {
    //         console.error('Error deleting role:', error);
    //       });
    //   }
    // }
  },
  components: {
    RoleFormModal
  }
};
</script>

<style scoped>
.v-data-table {
  margin-top: 20px;
}
</style>
