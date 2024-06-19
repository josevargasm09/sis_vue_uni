<!-- src/views/app/warehouse/WarehouseFormModal.vue -->
<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="text-h6 pa-0 pl-3 grey lighten-2">
        <p class="mb-0 text-capitalize secondary--text text-sm font-weight-semibold">
          {{ isEdit ? 'Editar Almacén' : 'Agregar Almacén' }}
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
              label="Nombre del Almacén"
              outlined
              class="pa-1 black-border"
              dense
              v-model="form.name"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="12" sm="12">
            <v-text-field
              hide-details
              label="Ubicación"
              outlined
              class="pa-1 black-border"
              dense
              v-model="form.location"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="saveWarehouse">{{ isEdit ? 'Guardar Cambios' : 'Agregar Almacén' }}</v-btn>
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
import WarehouseService from '../services/WarehouseService.js';
import NotificationSnackbar from '../../../components/NotificationSnackbar.vue';

const initFormData = {
  id: null,
  name: '',
  location: ''
};

export default {
  name: 'WarehouseFormModal',
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
    open(warehouse) {
      if (warehouse) {
        this.isEdit = true;
        this.form = { ...warehouse };
      } else {
        this.isEdit = false;
        this.resetForm();
      }
      this.dialog = true;
    },
    resetForm() {
      this.form = { ...initFormData };
    },
    saveWarehouse() {
      if (this.isEdit) {
        WarehouseService.updateWarehouse(this.form.id, this.form)
          .then(() => {
            this.$emit('updateList');
            this.showNotification('Almacén actualizado correctamente', 'success');
            this.dialog = false;
          })
          .catch(error => {
            this.showNotification(`Error al actualizar el almacén: ${error.message}`, 'error');
            console.error('Error updating warehouse:', error);
          });
      } else {
        WarehouseService.createWarehouse(this.form)
          .then(() => {
            this.$emit('updateList');
            this.showNotification('Almacén creado correctamente', 'success');
            this.dialog = false;
          })
          .catch(error => {
            this.showNotification(`Error al crear el almacén: ${error.message}`, 'error');
            console.error('Error creating warehouse:', error);
          });
      }
    },
    showNotification(message, color) {
      this.notification.message = message;
      this.notification.color = color;
      this.notification.visible = true;

      setTimeout(() => {
        this.notification.visible = false;
      }, 3000);
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
