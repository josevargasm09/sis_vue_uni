<template>
  <v-dialog v-model="dialog" max-width="1200px" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-2">
        Registrar Venta
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-row>
            <!-- Cliente y dirección -->
            <v-col cols="12" md="6">
              <v-row no-gutters>
                <v-col cols="10">
                  <v-text-field
                    v-model="clientQuery"
                    label="Buscar Cliente (Nombre o DNI)"
                    outlined
                    dense
                    prepend-inner-icon="mdi-magnify"
                    @input="searchClient"
                  ></v-text-field>
                  <v-select
                    v-if="clients.length > 0"
                    v-model="sale.client"
                    :items="clients"
                    item-text="name"
                    item-value="id"
                    label="Seleccione Cliente"
                    outlined
                    dense
                    required
                  ></v-select>
                </v-col>
                <v-col cols="2">
                  <v-btn color="primary" @click="openAddClientDialog">+</v-btn>
                </v-col>
              </v-row>
              <v-text-field
                v-model="sale.address"
                label="Dirección"
                outlined
                dense
                required
              ></v-text-field>
            </v-col>
            <!-- Fecha y observaciones -->
            <v-col cols="12" md="6">
              <v-text-field
                v-model="sale.date"
                label="Fecha Venta"
                outlined
                dense
                required
                :type="'date'"
              ></v-text-field>
              <v-text-field
                v-model="sale.notes"
                label="Observaciones"
                outlined
                dense
                required
              ></v-text-field>
            </v-col>
            <!-- Almacén y búsqueda de productos -->
            <v-col cols="12" md="6">
              <v-select
                v-model="sale.warehouse"
                :items="warehouses"
                item-text="name"
                item-value="id"
                label="Almacén"
                outlined
                dense
                required
              ></v-select>
              <v-text-field
                v-model="searchProduct"
                label="Escriba el nombre del producto o código para buscar"
                outlined
                dense
                prepend-inner-icon="mdi-magnify"
                @click:append="addProduct"
              ></v-text-field>
            </v-col>
          </v-row>

          <!-- Lista de productos agregados -->
          <v-data-table
            :headers="productHeaders"
            :items="sale.products"
            class="elevation-1"
            dense
          >
            <template v-slot:item.action="{ item }">
              <v-btn icon @click="removeProduct(item)">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <!-- Resumen de la venta -->
          <v-row class="mt-4">
            <v-col cols="12" md="4">
              <v-text-field
                v-model="sale.invoiceType"
                label="Comprobante"
                outlined
                dense
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6" md="2">
              <v-text-field
                v-model="sale.series"
                label="Serie"
                outlined
                dense
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6" md="2">
              <v-text-field
                v-model="sale.invoiceNumber"
                label="Nro."
                outlined
                dense
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="sale.paymentMethod"
                :items="paymentMethods"
                item-text="name"
                item-value="id"
                label="Forma de Pago"
                outlined
                dense
                required
              ></v-select>
            </v-col>
          </v-row>

          <!-- Resumen de totales -->
          <v-row class="mt-4">
            <v-col cols="6" md="2" v-for="(summary, index) in saleSummary" :key="index">
              <v-text-field
                :label="summary.label"
                v-model="summary.value"
                outlined
                dense
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="closeDialog">Cancelar</v-btn>
        <v-btn color="primary" @click="saveSale">Guardar</v-btn>
      </v-card-actions>
    </v-card>

    <!-- Modal para agregar nuevo cliente -->
    <v-dialog v-model="addClientDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Agregar Cliente</v-card-title>
        <v-card-text>
          <v-form ref="addClientForm">
            <v-text-field
              v-model="newClient.name"
              label="Nombre del Cliente"
              outlined
              dense
              required
            ></v-text-field>
            <v-text-field
              v-model="newClient.email"
              label="Correo Electrónico"
              outlined
              dense
              required
            ></v-text-field>
            <v-text-field
              v-model="newClient.phone"
              label="Teléfono"
              outlined
              dense
              required
            ></v-text-field>
            <v-text-field
              v-model="newClient.dni"
              label="DNI"
              outlined
              dense
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="addClientDialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="addClient">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-dialog>
</template>

<script>
import ClientService from '../services/client.service';
import WarehouseService from '../services/WarehouseService.js';
// import ProductService from '../services/product.service';
// import PaymentMethodService from '../services/payment-method.service';

export default {
  props: ['value'],
  data() {
    return {
      dialog: this.value,
      addClientDialog: false, // Estado del modal de agregar cliente
      clientQuery: '', // Query para buscar clientes
      sale: {
        client: null,
        address: '',
        date: '',
        notes: '',
        warehouse: null,
        products: [],
        invoiceType: '',
        series: '',
        invoiceNumber: '',
        paymentMethod: null,
        total: 0
      },
      searchProduct: '',
      clients: [],
      products: [],
      warehouses: [],  // Verificamos la carga de almacenes
      paymentMethods: [],
      saleSummary: [
        { label: 'Subtotal', value: 0 },
        { label: 'Descuento', value: 0 },
        { label: 'I.G.V', value: 0 },
        { label: 'Total', value: 0 }
      ],
      productHeaders: [
        { text: '#', value: 'id' },
        { text: 'Producto', value: 'name' },
        { text: 'Unidad', value: 'unit' },
        { text: 'Cantidad', value: 'quantity' },
        { text: 'Precio', value: 'price' },
        { text: 'Importe', value: 'amount' },
        { text: 'Acciones', value: 'action', sortable: false }
      ],
      newClient: { // Datos del nuevo cliente
        name: '',
        email: '',
        phone: '',
        dni: '' // Añadimos el campo DNI
      }
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
    closeDialog() {
      this.dialog = false;
      this.$emit('close');
    },
    saveSale() {
      // Aquí se manejaría el guardado de la venta
      console.log('Guardando venta:', this.sale);
      this.closeDialog();
    },
    addProduct() {
      // Lógica para agregar un producto a la lista
      if (this.searchProduct) {
        let product = {
          id: Date.now(),
          name: this.searchProduct,
          unit: 'Unidad',
          quantity: 1,
          price: 100,
          amount: 100
        };
        this.sale.products.push(product);
        this.calculateSummary();
        this.searchProduct = '';
      }
    },
    removeProduct(item) {
      this.sale.products = this.sale.products.filter(p => p.id !== item.id);
      this.calculateSummary();
    },
    calculateSummary() {
      let subtotal = 0;
      this.sale.products.forEach(product => {
        subtotal += product.amount;
      });
      this.saleSummary[0].value = subtotal;
      this.saleSummary[3].value = subtotal; // Total
    },
    fetchData() {
      ClientService.getAllClients().then(response => {
        this.clients = response.data;
      });

      WarehouseService.getAllWarehouses().then(response => {  // Aseguramos la carga de los almacenes
        this.warehouses = response.data;
      });

      // PaymentMethodService.getAllPaymentMethods().then(response => {
      //   this.paymentMethods = response.data;
      // });

      // ProductService.getAllProducts().then(response => {
      //   this.products = response.data;
      // });
    },
    searchClient() {
      if (this.clientQuery) {
        ClientService.searchClients(this.clientQuery).then(response => {
          this.clients = response.data;
        });
      } else {
        this.clients = [];
      }
    },
    openAddClientDialog() {
      this.addClientDialog = true; // Abre el modal de agregar cliente
    },
    addClient() {
      ClientService.createClient(this.newClient).then(() => {
        // Actualiza la lista de clientes
        this.fetchData();
        this.addClientDialog = false;
        // Limpiar el formulario de nuevo cliente
        this.newClient = { name: '', email: '', phone: '', dni: '' };
      });
    }
  },
  created() {
    this.fetchData();
  }
};
</script>

<style scoped>
.black-border {
  border: 1px solid black;
}
</style>
