<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title class="headline grey lighten-2">
        {{ isEdit ? 'Editar Caja' : 'Registrar Caja' }}
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="form.serie"
            label="Serie"
            outlined
            dense
            required
          ></v-text-field>
          <v-select
            v-model="form.tipoCaja"
            :items="tipoCajas"
            label="Tipo Caja"
            outlined
            dense
            required
          ></v-select>
          <v-select
            v-model="form.oficina"
            :items="oficinas"
            label="Oficina"
            outlined
            dense
            required
          ></v-select>
          <v-text-field
            v-model="form.descripcion"
            label="Descripción"
            outlined
            dense
          ></v-text-field>
          <v-checkbox
            v-model="form.activo"
            label="Activo"
          ></v-checkbox>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="closeDialog">Cancelar</v-btn>
        <v-btn color="primary" @click="saveCaja">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import CajaService from '../services/caja.service';

export default {
  props: ['value'],
  data() {
    return {
      dialog: this.value,
      isEdit: false,
      form: {
        serie: '',
        tipoCaja: '',
        oficina: '',
        descripcion: '',
        activo: true
      },
      tipoCajas: ['Oficina', 'Venta', 'Almacén'],
      oficinas: ['Oficina Central', 'Sucursal A', 'Sucursal B']
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
    open(caja) {
      if (caja) {
        this.isEdit = true;
        this.form = { ...caja };
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
    saveCaja() {
      if (this.isEdit) {
        CajaService.updateCaja(this.form.id, this.form)
          .then(() => {
            this.$store.dispatch('notification/showSnackbar', 
            { message: 'Caja actualizada correctamente', color: 'success' });
            this.$emit('updateList');
            this.dialog = false;
          })
          .catch(error => {
            this.$store.dispatch('notification/showSnackbar', 
            { message: `Error al actualizar caja: ${error.message}`, color: 'error' });
          });
      } else {
        CajaService.createCaja(this.form)
          .then(() => {
            this.$store.dispatch('notification/showSnackbar', 
            { message: 'Caja creada correctamente', color: 'success' });
            this.$emit('updateList');
            this.dialog = false;
          })
          .catch(error => {
            this.$store.dispatch('notification/showSnackbar', 
            { message: `Error al crear caja: ${error.message}`, color: 'error' });
          });
      }
    },
    resetForm() {
      this.form = {
        serie: '',
        tipoCaja: '',
        oficina: '',
        descripcion: '',
        activo: true
      };
    }
  }
};
</script>

<style scoped>
.black-border {
  border: 1px solid black;
}
</style>
