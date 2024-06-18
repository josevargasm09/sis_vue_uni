<!-- src/views/app/client/ClientFormModal.vue -->
<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="text-h6 pa-0 pl-3 grey lighten-2">
        <p class="mb-0 text-capitalize secondary--text text-sm font-weight-semibold">
          {{ isEdit ? 'Editar Cliente' : 'Agregar Cliente' }}
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
              label="Nombre del Cliente"
              outlined
              class="pa-1 black-border"
              dense
              v-model="form.name"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="12" sm="12">
            <v-text-field
              hide-details
              label="Email del Cliente"
              outlined
              class="pa-1 black-border"
              dense
              v-model="form.email"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="12" sm="12">
            <v-text-field
              hide-details
              label="Teléfono del Cliente"
              outlined
              class="pa-1 black-border"
              dense
              v-model="form.phone"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="12" sm="12">
            <v-text-field
              hide-details
              label="Dirección del Cliente"
              outlined
              class="pa-1 black-border"
              dense
              v-model="form.address"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="saveClient">{{ isEdit ? 'Guardar Cambios' : 'Agregar Cliente' }}</v-btn>
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
import ClientService from '../services/client.service';
import NotificationSnackbar from '../../../components/NotificationSnackbar.vue';

const initFormData = {
  id: null,
  name: '',
  email: '',
  phone: '',
  address: ''
};

export default {
  name: 'ClientFormModal',
  components: {
    NotificationSnackbar
  },
  data() {
    return {
      dialog: false,
      isEdit: false,
      form: { ...initFormData },
      notification: {
        visible: false,
        message: '',
        color: 'success'
      }
    };
  },
  methods: {
    open(client) {
      if (client) {
        this.isEdit = true;
        this.form = { ...client };
      } else {
        this.isEdit = false;
        this.resetForm();
      }
      this.dialog = true;
    },
    resetForm() {
      this.form = { ...initFormData };
    },
    saveClient() {
      if (this.isEdit) {
        ClientService.updateClient(this.form.id, this.form)
          .then(() => {
            this.$store.dispatch('notification/showSnackbar', 
            { message: 'Cliente actualizado correctamente', color: 'success' });
            this.$emit('updateList');
            this.dialog = false;
          })
          .catch(error => { 
            this.$store.dispatch('notification/showSnackbar',
             { message: `Error al actualizar cliente: ${error.message}`, color: 'error' });
          });
      } else {
        ClientService.createClient(this.form)
          .then(() => {
            this.$store.dispatch('notification/showSnackbar', 
            { message: 'Cliente creado correctamente', color: 'success' });
            this.$emit('updateList');
            this.dialog = false;
          })
          .catch(error => {
            this.$store.dispatch('notification/showSnackbar', 
            { message: `Falló al crear cliente: ${error.message}`, color: 'error' });
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
