<!-- src/components/UserFormModal.vue -->
<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="text-h6 pa-0 pl-3 grey lighten-2">
        <p class="mb-0 text-capitalize secondary--text text-sm font-weight-semibold">
          {{ isEdit ? 'Editar Usuario' : 'Agregar Usuario' }}
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
              label="Usuario"
              outlined
              class="pa-1 black-border"
              dense
              v-model="form.username"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="12" sm="12">
            <v-text-field
              class="pa-1"
              hide-details
              label="Email"
              outlined
              dense
              v-model="form.email"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="12" sm="12">
            <v-text-field
              class="pa-1"
              hide-details
              outlined
              dense
              v-model="form.password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              label="Contraseña"
              @click:append="showPassword = !showPassword"
            />
          </v-col>
          <v-col cols="12" md="12" sm="12">
            <v-text-field
              class="pa-1"
              hide-details
              outlined
              dense
              v-model="form.confirmPassword"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              label="Confirmar Contraseña"
              @click:append="showPassword = !showPassword"
            />
          </v-col>
          <v-col cols="12" md="12" sm="12">
            <v-select
              v-model="form.roles"
              :items="roles"
              item-text="name"
              item-value="id"
              label="Roles"
              multiple
              outlined
              dense
              hide-details
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="saveUser">{{ isEdit ? 'Guardar Cambios' : 'Agregar Usuario' }}</v-btn>
        <v-btn color="error" @click="dialog = false">Cancelar</v-btn>
      </v-card-actions>
    </v-card>

    <!-- Notification Snackbar -->
    <NotificationSnackbar
      :message="notification.message"
      :color="notification.color"
      v-if="notification.visible"
    />
  </v-dialog>
</template>

<script>
import UserService from '../services/user.service.js';
import NotificationSnackbar from '../../../components/NotificationSnackbar.vue';

const initFormData = {
  id: null,
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  roles: []
};

export default {
  name: 'UserFormModal',
  components: {
    NotificationSnackbar
  },
  data() {
    return {
      dialog: false,
      isEdit: false,
      showPassword: false,
      form: Object.assign({}, initFormData),
      roles: [],
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
    open(user) {
      if (user) {
        this.isEdit = true;
        this.form = { ...user, password: '', confirmPassword: '', roles: user.roles.map(role => role.id) };
      } else {
        this.isEdit = false;
        this.resetForm();
      }
      this.dialog = true;
    },
    resetForm() {
      this.form = Object.assign({}, initFormData);
    },
    saveUser() {
      if (this.form.password !== this.form.confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
      }

      const user = {
        ...this.form,
        roles: this.form.roles.map(roleId => ({ id: roleId }))
      };

      if (this.isEdit) {
        UserService.updateUser(this.form.id, user)
          .then(() => {
            this.$store.dispatch('notification/showSnackbar', 
              { message: 'Usuario actualizado correctamente', color: 'success' });
            this.$emit('updateList');
            this.dialog = false;
          })
          .catch(error => {
            this.$store.dispatch('notification/showSnackbar', 
              { message: `Error al actualizar usuario: ${error.message}`, color: 'error' });
          });
      } else {
        UserService.createUser(user)
          .then(() => {
            this.$store.dispatch('notification/showSnackbar', 
              { message: 'Usuario creado correctamente', color: 'success' });
            this.$emit('updateList');
            this.dialog = false;
          })
          .catch(error => {
            this.$store.dispatch('notification/showSnackbar', 
              { message: `Error al crear usuario: ${error.message}`, color: 'error' });
          });
      }
    },
    fetchRoles() {
      UserService.getAllRoles()
        .then(response => {
          this.roles = response.data;
        })
        .catch(error => {
          console.error('Error fetching roles:', error);
        });
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
