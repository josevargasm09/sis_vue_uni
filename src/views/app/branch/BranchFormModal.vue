<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="text-h6 pa-0 pl-3 grey lighten-2">
        <p class="mb-0 text-capitalize secondary--text text-sm font-weight-semibold">
          {{ isEdit ? 'Editar Sucursal' : 'Agregar Sucursal' }}
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
              label="Nombre"
              outlined
              class="pa-1 black-border"
              dense
              v-model="form.name"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="12" sm="12">
            <v-text-field
              class="pa-1"
              hide-details
              label="Dirección"
              outlined
              dense
              v-model="form.address"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="12" sm="12">
            <v-text-field
              class="pa-1"
              hide-details
              label="Teléfono"
              outlined
              dense
              v-model="form.phone"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="saveBranch">{{ isEdit ? 'Guardar Cambios' : 'Agregar Sucursal' }}</v-btn>
        <v-btn color="error" @click="dialog = false">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import BranchService from '../services/branch.service.js';

const initFormData = {
  id: null,
  name: '',
  address: '',
  phone: ''
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
    open(branch) {
      if (branch) {
        this.isEdit = true;
        this.form = { ...branch };
      } else {
        this.isEdit = false;
        this.resetForm();
      }
      this.dialog = true;
    },
    resetForm() {
      this.form = { ...initFormData };
    },
    saveBranch() {
      if (this.isEdit) {
        BranchService.updateBranch(this.form.id, this.form)
          .then(() => {
            this.$emit('updateList');
            this.dialog = false;
            this.$store.dispatch('notification/showSnackbar', {
              message: 'Sucursal actualizada correctamente',
              color: 'success'
            });
          })
          .catch(error => {
            console.error('Error updating branch:', error);
            this.$store.dispatch('notification/showSnackbar', {
              message: `Error al actualizar sucursal: ${error.message}`,
              color: 'error'
            });
          });
      } else {
        BranchService.createBranch(this.form)
          .then(() => {
            this.$emit('updateList');
            this.dialog = false;
            this.$store.dispatch('notification/showSnackbar', {
              message: 'Sucursal creada correctamente',
              color: 'success'
            });
          })
          .catch(error => {
            console.error('Error creating branch:', error);
            this.$store.dispatch('notification/showSnackbar', {
              message: `Error al crear sucursal: ${error.message}`,
              color: 'error'
            });
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
