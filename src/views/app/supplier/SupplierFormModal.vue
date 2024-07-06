<template>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="headline grey lighten-2">
          {{ isEdit ? 'Editar Proveedor' : 'Registrar Proveedor' }}
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form ref="form">
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.name"
                  label="Nombre"
                  outlined
                  dense
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.address"
                  label="Dirección"
                  outlined
                  dense
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="form.phone"
                  label="Teléfono"
                  outlined
                  dense
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="closeDialog">Cancelar</v-btn>
          <v-btn color="primary" @click="saveSupplier">{{ isEdit ? 'Guardar Cambios' : 'Registrar' }}</v-btn>
        </v-card-actions>
      </v-card>
  
      <!-- Notification Snackbar -->
      <NotificationSnackbar :message="notification.message" :color="notification.color" v-if="notification.visible" />
    </v-dialog>
  </template>
  
  <script>
  import SupplierService from '../services/supplier.service';
  import NotificationSnackbar from '../../../components/NotificationSnackbar.vue';
  
  export default {
    props: ['value'],
    components: {
      NotificationSnackbar
    },
    data() {
      return {
        dialog: this.value,
        isEdit: false,
        form: {
          name: '',
          address: '',
          phone: ''
        },
        notification: {
          visible: false,
          message: '',
          color: 'success'
        }
      };
    },
    watch: {
      value(val) {
        this.dialog = val;
      },
      dialog(val) {
        this.$emit('input', val);
      }
    },
    methods: {
      closeDialog() {
        this.dialog = false;
        this.$emit('close');
      },
      saveSupplier() {
        if (this.isEdit) {
          SupplierService.updateSupplier(this.form.id, this.form)
            .then(() => {
              this.showNotification('Proveedor actualizado correctamente', 'success');
              this.$emit('updateList');
              this.dialog = false;
            })
            .catch(error => {
              this.showNotification(`Error al actualizar el proveedor: ${error.message}`, 'error');
              console.error('Error updating supplier:', error);
            });
        } else {
          SupplierService.createSupplier(this.form)
            .then(() => {
              this.showNotification('Proveedor registrado correctamente', 'success');
              this.$emit('updateList');
              this.dialog = false;
            })
            .catch(error => {
              this.showNotification(`Error al registrar el proveedor: ${error.message}`, 'error');
              console.error('Error creating supplier:', error);
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
      },
      open(supplier) {
        if (supplier) {
          this.isEdit = true;
          this.form = { ...supplier };
        } else {
          this.isEdit = false;
          this.resetForm();
        }
        this.dialog = true;
      },
      resetForm() {
        this.form = {
          name: '',
          address: '',
          phone: ''
        };
      }
    }
  };
  </script>
  
  <style scoped>
  </style>
  