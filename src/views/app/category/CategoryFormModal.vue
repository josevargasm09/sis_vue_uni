<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="text-h6 pa-0 pl-3 grey lighten-2">
        <p class="mb-0 text-capitalize secondary--text text-sm font-weight-semibold">
          {{ isEdit ? 'Editar Categoría' : 'Agregar Categoría' }}
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
              label="Nombre de la Categoría"
              outlined
              class="pa-1 black-border"
              dense
              v-model="form.name"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="saveCategory">{{ isEdit ? 'Guardar Cambios' : 'Agregar Categoría' }}</v-btn>
        <v-btn color="error" @click="dialog = false">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import CategoryService from '../services/category.service.js';

const initFormData = {
  id: null,
  name: ''
};

export default {
  data() {
    return {
      dialog: false,
      isEdit: false,
      form: { ...initFormData }
    };
  },
  methods: {
    open(category) {
      if (category) {
        this.isEdit = true;
        this.form = { ...category };
      } else {
        this.isEdit = false;
        this.resetForm();
      }
      this.dialog = true;
    },
    resetForm() {
      this.form = { ...initFormData };
    },
    saveCategory() {
      if (this.isEdit) {
        CategoryService.updateCategory(this.form.id, this.form)
          .then(() => {
            this.$emit('updateList');
            this.dialog = false;
            this.showNotification('Categoría actualizada correctamente', 'success');
          })
          .catch(error => {
            this.showNotification(`Error al actualizar la categoría: ${error.message}`, 'error');
          });
      } else {
        CategoryService.createCategory(this.form)
          .then(() => {
            this.$emit('updateList');
            this.dialog = false;
            this.showNotification('Categoría creada correctamente', 'success');
          })
          .catch(error => {
            this.showNotification(`Error al crear la categoría: ${error.message}`, 'error');
          });
      }
    },
    showNotification(message, color) {
      this.$store.dispatch('notification/showSnackbar', {
        message: message,
        color: color
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
