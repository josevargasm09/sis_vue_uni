<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="text-h6 pa-0 pl-3 grey lighten-2">
        <p class="mb-0 text-capitalize secondary--text text-sm font-weight-semibold">
          {{ isEdit ? 'Editar Rol' : 'Agregar Rol' }}
        </p>
        <v-spacer></v-spacer>
        <v-btn icon x-small dark @click="dialog = false" class="ma-1 secondary--text">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="12" sm="12">
            <v-text-field
              hide-details
              label="Nombre del Rol"
              outlined
              class="pa-1 black-border"
              dense
              v-model="form.name"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="saveRole">{{ isEdit ? 'Guardar Cambios' : 'Agregar Rol' }}</v-btn>
        <v-btn color="error" @click="dialog = false">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import RoleService from '../services/role.service.js';

const initFormData = {
  id: null,
  name: ''
};

export default {
  name: 'RoleFormModal',
  data() {
    return {
      dialog: false,
      isEdit: false,
      form: { ...initFormData }
    };
  },
  methods: {
    open(role) {
      if (role) {
        this.isEdit = true;
        this.form = { ...role };
      } else {
        this.isEdit = false;
        this.resetForm();
      }
      this.dialog = true;
    },
    resetForm() {
      this.form = { ...initFormData };
    },
    saveRole() {
      const validRoles = ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_MODERATOR'];
      if (!validRoles.includes(this.form.name)) {
        alert('El nombre del rol no es válido.');
        return;
      }

      const roleData = {
        name: this.form.name
      };

      if (this.isEdit) {
        RoleService.updateRole(this.form.id, roleData)
          .then(() => {
            this.$emit('updateList');
            this.dialog = false;
          })
          .catch(error => {
            console.error('Error updating role:', error);
          });
      } else {
        RoleService.createRole(roleData)
          .then(() => {
            this.$emit('updateList');
            this.dialog = false;
          })
          .catch(error => {
            console.error('Error creating role:', error);
          });
      }
    }
  }
};
</script>

<style scoped>
.pa-1 {
  padding: 4px;
}
.black-border {
  border: 1px solid black;
}
</style>
