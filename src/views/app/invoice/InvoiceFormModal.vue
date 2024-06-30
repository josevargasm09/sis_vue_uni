<template>
  <v-dialog v-model="dialog" max-width="500px" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-2">
        {{ isEdit ? 'Editar Comprobante' : 'Registrar Comprobante' }}
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row dense>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.type"
                :items="invoiceTypes"
                label="Tipo de Comprobante"
                outlined
                dense
                required
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.series"
                label="Serie"
                outlined
                dense
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="form.number"
                label="Número"
                outlined
                dense
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="form.status"
                :items="statusOptions"
                label="Estado"
                outlined
                dense
                required
              ></v-select>
            </v-col>
            <v-col cols="12" md="12">
              <v-text-field
                v-model="form.date"
                label="Fecha"
                outlined
                dense
                required
                type="date"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="closeDialog">Cancelar</v-btn>
        <v-btn color="primary" @click="saveInvoice">{{ isEdit ? 'Guardar Cambios' : 'Registrar' }}</v-btn>
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
import InvoiceService from '../services/invoice.service.js';
import NotificationSnackbar from '../../../components/NotificationSnackbar.vue';

const initFormData = {
  id: null,
  type: '',
  series: '',
  number: '',
  status: '',
  date: ''
};

export default {
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
      },
      invoiceTypes: ['Factura', 'Boleta'],
      statusOptions: ['Activo', 'Inactivo']
    };
  },
  methods: {
    open(invoice) {
      if (invoice) {
        this.isEdit = true;
        this.form = { ...invoice };
      } else {
        this.isEdit = false;
        this.resetForm();
      }
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
      this.$emit('close');
    },
    resetForm() {
      this.form = { ...initFormData };
    },
    saveInvoice() {
      if (this.isEdit) {
        InvoiceService.updateInvoice(this.form.id, this.form).then(() => {
          this.$store.dispatch('notification/showSnackbar', 
          { message: 'Comprobante actualizado correctamente', color: 'success' });
          this.$emit('updateList');
          this.dialog = false;
        }).catch(error => {
          this.$store.dispatch('notification/showSnackbar', 
          { message: `Error al actualizar comprobante: ${error.message}`, color: 'error' });
          console.error('Error updating invoice:', error);
        });
      } else {
        InvoiceService.createInvoice(this.form).then(() => {
          this.$store.dispatch('notification/showSnackbar', 
          { message: 'Comprobante creado correctamente', color: 'success' });
          this.$emit('updateList');
          this.dialog = false;
        }).catch(error => {
          this.$store.dispatch('notification/showSnackbar', 
          { message: `Error al crear comprobante: ${error.message}`, color: 'error' });
          console.error('Error creating invoice:', error);
        });
      }
    }
  }
};
</script>

<style scoped>
.black-border {
  border: 1px solid black;
}
</style>
