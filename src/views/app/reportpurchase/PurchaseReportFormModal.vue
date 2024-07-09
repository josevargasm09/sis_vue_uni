<template>
  <v-dialog v-model="dialog" max-width="1200px" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-2">
        {{ localReport.id ? 'Editar Reporte de Compras' : 'Agregar Reporte de Compras' }}
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="localReport.date"
                label="Fecha"
                outlined
                dense
                required
                type="date"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="localReport.totalPurchases"
                label="Compras Totales"
                outlined
                dense
                required
                type="number"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="closeDialog">Cancelar</v-btn>
        <v-btn color="primary" @click="saveReport">{{ localReport.id ? 'Actualizar' : 'Guardar' }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import PurchaseReportService from '../services/purchase-report.service.js';

export default {
  data() {
    return {
      dialog: false,
      localReport: {
        date: '',
        totalPurchases: 0
      }
    };
  },
  methods: {
    open(report = null) {
      this.localReport = report ? { ...report } : {
        date: '',
        totalPurchases: 0
      };
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    saveReport() {
      if (!this.localReport.date || !this.localReport.totalPurchases) {
        this.$store.dispatch('notification/showSnackbar', {
          message: 'Por favor complete todos los campos',
          color: 'error'
        });
        return;
      }
      const saveMethod = this.localReport.id ? PurchaseReportService.updateReport : PurchaseReportService.createReport;
      saveMethod(this.localReport)
        .then(() => {
          this.$emit('updateList');
          this.closeDialog();
          this.$store.dispatch('notification/showSnackbar', {
            message: this.localReport.id ? 'Reporte actualizado correctamente' : 'Reporte registrado correctamente',
            color: 'success'
          });
        })
        .catch(error => {
          console.error('Error al guardar el reporte:', error);
          this.$store.dispatch('notification/showSnackbar', {
            message: `Error al guardar el reporte: ${error.message}`,
            color: 'error'
          });
        });
    }
  }
};
</script>
