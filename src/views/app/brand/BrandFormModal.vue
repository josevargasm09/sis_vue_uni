<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title class="text-h6 pa-0 pl-3 grey lighten-2">
        <p class="mb-0 text-capitalize secondary--text text-sm font-weight-semibold">
          {{ isEdit ? 'Editar Marca' : 'Agregar Marca' }}
        </p>
        <v-spacer></v-spacer>
        <v-btn icon x-small dark @click="close" class="ma-1 secondary--text">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form ref="form">
          <v-row dense>
            <v-col cols="12" md="12" sm="12">
              <v-text-field
                hide-details
                label="Nombre de la Marca"
                outlined
                class="pa-1 black-border"
                dense
                v-model="form.name"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="saveBrand">{{ isEdit ? 'Guardar Cambios' : 'Agregar Marca' }}</v-btn>
        <v-btn color="error" @click="close">Cancelar</v-btn>
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
import BrandService from '../services/brand.service';
import NotificationSnackbar from '../../../components/NotificationSnackbar.vue';

const initFormData = {
  id: null,
  name: ''
};

export default {
  name: 'BrandFormModal',
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
    open(brand) {
      if (brand) {
        this.isEdit = true;
        this.form = { ...brand };
      } else {
        this.isEdit = false;
        this.resetForm();
      }
      this.dialog = true;
    },
    close() {
      this.dialog = false;
    },
    resetForm() {
      this.form = { ...initFormData };
    },
    saveBrand() {
      if (this.isEdit) {
        BrandService.updateBrand(this.form.id, this.form)
          .then(() => {
            this.$store.dispatch('notification/showSnackbar', 
            { message: 'Marca actualizada correctamente', color: 'success' });
            this.$emit('updateList');
            this.close();
          })
          .catch(error => {
            this.$store.dispatch('notification/showSnackbar', 
            { message: `Error al actualizar la marca: ${error.message}`, color: 'error' });
          });
      } else {
        BrandService.createBrand(this.form)
          .then(() => {
            this.$store.dispatch('notification/showSnackbar', 
            { message: 'Marca creada correctamente', color: 'success' });
            this.$emit('updateList');
            this.close();
          })
          .catch(error => {
            this.$store.dispatch('notification/showSnackbar', 
            { message: `Error al crear la marca: ${error.message}`, color: 'error' });
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
