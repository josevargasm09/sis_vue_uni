<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title class="text-h6 pa-0 pl-3 grey lighten-2">
        <p class="mb-0 text-capitalize secondary--text text-sm font-weight-semibold">
          {{ isEdit ? 'Editar Cliente' : 'Agregar Cliente' }}
        </p>
        <v-spacer></v-spacer>
        <v-btn icon x-small dark @click="dialog = false" class="ma-1 secondary--text">
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
                label="Nombre del Cliente"
                outlined
                class="pa-1 black-border"
                dense
                v-model="form.name"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="12" sm="12">
              <!-- <v-text-field
                hide-details
                label="DNI"
                outlined
                class="pa-1 black-border"
                dense
                v-model="form.dni"
                @blur="fetchDniData"
              ></v-text-field> -->
            </v-col>
            <v-col cols="12" md="12" sm="12">
              <v-text-field
                hide-details
                label="Dirección"
                outlined
                class="pa-1 black-border"
                dense
                v-model="form.address"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="12" sm="12">
              <v-text-field
                hide-details
                label="Email"
                outlined
                class="pa-1 black-border"
                dense
                v-model="form.email"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="12" sm="12">
              <v-text-field
                hide-details
                label="Teléfono"
                outlined
                class="pa-1 black-border"
                dense
                v-model="form.phone"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="saveClient">{{ isEdit ? 'Guardar Cambios' : 'Agregar Cliente' }}</v-btn>
        <v-btn color="error" @click="dialog = false">Cancelar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ClientService from '../services/client.service.js';

const initFormData = {
  id: null,
  name: '',
  dni: '',
  address: '',
  email: '',
  phone: ''
};

export default {
  data() {
    return {
      dialog: false,
      isEdit: false,
      form: Object.assign({}, initFormData)
    };
  },
  methods: {
    open(client) {
      if (client) {
        this.isEdit = true;
        this.form = { ...client };
      } else {
        this.isEdit = false;
        this.resetForm();
      }
      this.dialog = true;
    },
    resetForm() {
      this.form = Object.assign({}, initFormData);
    },
    saveClient() {
      if (this.isEdit) {
        ClientService.updateClient(this.form.id, this.form)
          .then(() => {
            this.$store.dispatch('notification/showSnackbar', 
            { message: 'Cliente actualizado correctamente', color: 'success' });
            this.$emit('updateList');
            this.dialog = false;
          })
          .catch(error => { 
            this.$store.dispatch('notification/showSnackbar',
             { message: `Error al actualizar cliente: ${error.message}`, color: 'error' });
            console.error('Error updating client:', error);
          });
      } else {
        ClientService.createClient(this.form)
          .then(() => {
            this.$store.dispatch('notification/showSnackbar', 
            { message: 'Cliente creado correctamente', color: 'success' });
            this.$emit('updateList');
            this.dialog = false;
          })
          .catch(error => {
            this.$store.dispatch('notification/showSnackbar', 
            { message: `Error al crear cliente: ${error.message}`, color: 'error' });
            console.error('Error creating client:', error);
          });
      }
    },
    fetchDniData() {
      if (this.form.dni.length === 8) {
        const apiUrl = `https://api.factiliza.com/pe/v1/dni/info/${this.form.dni}`;
        const token = 'http://localhost:8080/api/clients'; // Reemplaza esto con tu token de autenticación real
        
        fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            if (data.success) {
              this.form.name = `${data.nombre} ${data.apellido_paterno} ${data.apellido_materno}`;
            } else {
              console.error('Error fetching DNI data:', data.message);
            }
          })
          .catch(error => {
            console.error('Error fetching DNI data:', error);
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
