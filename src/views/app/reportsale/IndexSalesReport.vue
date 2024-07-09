<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            Reporte de Ventas
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="openCreateDialog">Agregar Reporte</v-btn>
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="reportQuery"
              label="Buscar Reporte (Fecha)"
              outlined
              dense
              prepend-inner-icon="mdi-magnify"
              @input="searchReport"
            ></v-text-field>
            <v-data-table
              :headers="headers"
              :items="reports"
              item-key="id"
              class="elevation-1"
            >
              <template v-slot:item.action="{ item }">
                <div class="d-flex">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="success" dark v-bind="attrs" v-on="on" icon @click="openEditDialog(item)">
                        <v-icon>mdi-pencil-box-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Editar</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn color="danger" dark v-bind="attrs" v-on="on" icon @click="openDeleteDialog(item)">
                        <v-icon>mdi-trash-can-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Eliminar</span>
                  </v-tooltip>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <SalesReportFormModal ref="reportFormModal" @updateList="fetchReports" />
    <!-- Confirm Delete Modal -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmar Eliminación</v-card-title>
        <v-card-text>¿Estás seguro de que deseas eliminar este reporte?</v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="confirmDeleteReport">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Notification Snackbar -->
    <NotificationSnackbar
      :message="notification.message"
      :color="notification.color"
      v-if="notification.visible"
    />
  </v-container>
</template>

<script>
import SalesReportService from '../services/sales-report.service.js';
import SalesReportFormModal from './SalesReportFormModal.vue';
import NotificationSnackbar from '../../../components/NotificationSnackbar.vue';

export default {
  components: {
    SalesReportFormModal,
    NotificationSnackbar
  },
  data() {
    return {
      reportQuery: '',
      reports: [],
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Fecha', value: 'date' },
        { text: 'Ventas Totales', value: 'totalSales' },
        { text: 'Acciones', value: 'action', sortable: false }
      ],
      deleteDialog: false,
      reportToDelete: null,
      notification: {
        visible: false,
        message: '',
        color: 'success'
      }
    };
  },
  created() {
    this.fetchReports();
  },
  methods: {
    fetchReports() {
      SalesReportService.getAllReports().then(response => {
        this.reports = response.data;
      }).catch(error => {
        this.showNotification(`Error al obtener reportes: ${error.message}`, 'error');
        console.error('Error fetching reports:', error);
      });
    },
    openCreateDialog() {
      this.$refs.reportFormModal.open();
    },
    openEditDialog(report) {
      this.$refs.reportFormModal.open(report);
    },
    openDeleteDialog(report) {
      this.reportToDelete = report;
      this.deleteDialog = true;
    },
    confirmDeleteReport() {
      SalesReportService.deleteReport(this.reportToDelete.id).then(() => {
        this.fetchReports();
        this.deleteDialog = false;
        this.showNotification('Reporte eliminado correctamente', 'success');
      }).catch(error => {
        this.deleteDialog = false;
        this.showNotification(`Error al eliminar reporte: ${error.message}`, 'error');
        console.error('Error deleting report:', error);
      });
    },
    searchReport() {
      if (this.reportQuery.length > 0) {
        SalesReportService.searchReports(this.reportQuery).then(response => {
          this.reports = response.data;
        }).catch(error => {
          this.showNotification(`Error al buscar reportes: ${error.message}`, 'error');
          console.error('Error searching reports:', error);
        });
      } else {
        this.fetchReports();
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
.v-data-table {
  margin-top: 20px;
}
</style>
