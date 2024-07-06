<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEdit ? 'Editar Compra' : 'Registrar Compra' }}</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="form.purchaseDate"
            label="Fecha de Compra"
            type="date"
            outlined
            dense
          ></v-text-field>

          <v-select
            v-model="form.supplierId"
            :items="suppliers"
            item-text="name"
            item-value="id"
            label="Proveedor"
            outlined
            dense
          ></v-select>

          <v-text-field
            v-model="form.totalAmount"
            label="Monto Total"
            type="number"
            outlined
            dense
          ></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn color="error" @click="closeDialog">Cancelar</v-btn>
        <v-btn color="primary" @click="savePurchase">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import purchaseService from '../services/purchase.service';
import supplierService from '../services/supplier.service';

export default {
  data() {
    return {
      dialog: false,
      isEdit: false,
      form: {
        id: null,
        purchaseDate: '',
        supplierId: null,
        totalAmount: null,
      },
      suppliers: []
    };
  },
  methods: {
    open(purchase) {
      if (purchase) {
        this.isEdit = true;
        this.form = { ...purchase };
      } else {
        this.isEdit = false;
        this.resetForm();
      }
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
      this.resetForm();
    },
    resetForm() {
      this.form = {
        id: null,
        purchaseDate: '',
        supplierId: null,
        totalAmount: null,
      };
    },
    savePurchase() {
      if (this.isEdit) {
        purchaseService.updatePurchase(this.form.id, this.form).then(() => {
          this.$emit('updateList');
          this.$emit('showNotification', { message: 'Compra actualizada correctamente', color: 'success' });
          this.closeDialog();
        }).catch(error => {
          this.$emit('showNotification', { message: `Error al actualizar compra: ${error.message}`, color: 'error' });
          console.error('Error updating purchase:', error);
        });
      } else {
        purchaseService.createPurchase(this.form).then(() => {
          this.$emit('updateList');
          this.$emit('showNotification', { message: 'Compra creada correctamente', color: 'success' });
          this.closeDialog();
        }).catch(error => {
          this.$emit('showNotification', { message: `Error al crear compra: ${error.message}`, color: 'error' });
          console.error('Error creating purchase:', error);
        });
      }
    },
    fetchSuppliers() {
      supplierService.getAllSuppliers().then(response => {
        this.suppliers = response.data;
      }).catch(error => {
        this.$emit('showNotification', { message: `Error al cargar proveedores: ${error.message}`, color: 'error' });
        console.error('Error fetching suppliers:', error);
      });
    }
  },
  created() {
    this.fetchSuppliers();
  }
};
</script>

<style scoped>
.headline {
  font-weight: bold;
}
</style>
