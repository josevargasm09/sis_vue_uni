<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title>
            Cajas
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="openCreateDialog">Agregar Caja</v-btn>
          </v-card-title>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="cajas"
            :search="search"
            item-key="id"
            class="elevation-1"
          >
            <template v-slot:item.action="{ item }">
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
                  <v-btn color="danger" dark v-bind="attrs" v-on="on" icon @click="confirmDelete(item)">
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </v-btn>
                </template>
                <span>Eliminar</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Form Modal -->
    <CajaFormModal ref="cajaFormModal" @updateList="fetchCajas" />

    <!-- Confirm Delete Modal -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmar Eliminación</v-card-title>
        <v-card-text>¿Estás seguro de que deseas eliminar esta caja?</v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="deleteCaja">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import CajaService from '../services/caja.service';
import CajaFormModal from './CajaFormModal.vue';

export default {
  components: {
    CajaFormModal
  },
  data() {
    return {
      search: '',
      cajas: [],
      headers: [
        { text: '#', value: 'id' },
        { text: 'Serie', value: 'serie' },
        { text: 'Tipo Caja', value: 'tipoCaja' },
        { text: 'Oficina', value: 'oficina' },
        { text: 'Descripción', value: 'descripcion' },
        { text: 'Activo', value: 'activo' },
        { text: 'Acciones', value: 'action', sortable: false }
      ],
      deleteDialog: false,
      cajaToDelete: null
    };
  },
  created() {
    this.fetchCajas();
  },
  methods: {
    fetchCajas() {
      CajaService.getAllCajas()
        .then(response => {
          this.cajas = response.data;
        })
        .catch(error => {
          console.error('Error fetching cajas:', error);
        });
    },
    openCreateDialog() {
      this.$refs.cajaFormModal.open();
    },
    openEditDialog(caja) {
      this.$refs.cajaFormModal.open(caja);
    },
    confirmDelete(caja) {
      this.cajaToDelete = caja;
      this.deleteDialog = true;
    },
    deleteCaja() {
      CajaService.deleteCaja(this.cajaToDelete.id)
        .then(() => {
          this.fetchCajas();
          this.deleteDialog = false;
          this.$store.dispatch('notification/showSnackbar', 
          { message: 'Caja eliminada correctamente', color: 'success' });
        })
        .catch(error => {
          this.deleteDialog = false;
          this.$store.dispatch('notification/showSnackbar', 
          { message: `Error al eliminar caja: ${error.message}`, color: 'error' });
          console.error('Error deleting caja:', error);
        });
    }
  }
};
</script>

<style scoped>
.v-data-table {
  margin-top: 20px;
}
</style>
