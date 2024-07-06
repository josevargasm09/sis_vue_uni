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
              <v-autocomplete
                v-model="sale.client_id"
                :items="clients"
                item-text="name"
                item-value="id"
                label="Buscar Cliente (Nombre o DNI)"
                outlined
                dense
                @change="onClientSelected"
              ></v-autocomplete>
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
                v-model="sale.sale_date"
                label="Fecha Venta"
                outlined
                dense
                required
                type="date"
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
                v-model="sale.warehouse_id"
                :items="warehouses"
                item-text="name"
                item-value="id"
                label="Almacén"
                outlined
                dense
                required
              ></v-select>
              <v-autocomplete
                v-model="searchProduct"
                :items="products"
                item-text="name"
                item-value="id"
                label="Escriba el nombre del producto o código para buscar"
                outlined
                dense
                @change="onProductSelected"
              ></v-autocomplete>
            </v-col>
          </v-row>

          <!-- Lista de productos agregados -->
          <v-data-table
            :headers="productHeaders"
            :items="sale.items"
            class="elevation-1"
            dense
          >
            <template v-slot:item.quantity="{ item }">
              <v-text-field
                v-model="item.quantity"
                type="number"
                @input="updateAmount(item)"
                outlined
                dense
              ></v-text-field>
            </template>
            <template v-slot:item.amount="{ item }">
              <span>{{ item.amount }}</span>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn icon @click="removeProduct(item)">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-data-table>

          <!-- Resumen de totales -->
          <v-row class="mt-4">
            <v-col cols="12" md="4">
              <v-select
                v-model="sale.invoice_id"
                :items="invoices"
                item-text="type"
                item-value="id"
                label="Comprobante"
                outlined
                dense
                required
              ></v-select>
            </v-col>
            <v-col cols="6" md="4">
              <v-text-field
                v-model="sale.series"
                label="Serie"
                outlined
                dense
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6" md="4">
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
                v-model="sale.payment_method_id"
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
import WarehouseService from '../services/WarehouseService';
import ProductService from '../services/product.service';
import SaleService from '../services/sale.service';
import InvoiceService from '../services/invoice.service';
import PaymentMethodService from '../services/payment-method.service';

export default {
  props: ['value'],
  data() {
    return {
      dialog: this.value,
      addClientDialog: false,
      searchProduct: '',
      sale: {
        client_id: '',
        address: '',
        sale_date: '',
        notes: '',
        warehouse_id: null,
        items: [],
        invoice_id: null,
        payment_method_id: null,
        discount: 0,
        totalAmount: 0
      },
      clients: [],
      products: [],
      warehouses: [],
      invoices: [],
      paymentMethods: [],
      saleSummary: [
        { label: 'Subtotal', value: 0 },
        { label: 'Descuento', value: 0 },
        { label: 'I.G.V', value: 0 },
        { label: 'Total', value: 0 }
      ],
      productHeaders: [
        { text: '#', value: 'product_id' },
        { text: 'Producto', value: 'name' },
        { text: 'Cantidad', value: 'quantity' },
        { text: 'Precio', value: 'price' },
        { text: 'Importe', value: 'amount' },
        { text: 'Acciones', value: 'actions', sortable: false }
      ],
      newClient: {
        name: '',
        email: '',
        phone: '',
        dni: ''
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
      if (!this.sale.client_id || !this.sale.warehouse_id || !this.sale.invoice_id || !this.sale.payment_method_id) {
        this.$store.dispatch('notification/showSnackbar', {
          message: 'Por favor complete todos los campos',
          color: 'error'
        });
        return;
      }
      SaleService.createSale(this.sale)
        .then(() => {
          this.$emit('saleSaved');
          this.closeDialog();
          this.$store.dispatch('notification/showSnackbar', {
            message: 'Venta registrada correctamente',
            color: 'success'
          });
        })
        .catch(error => {
          console.error('Error al guardar la venta:', error);
          this.$store.dispatch('notification/showSnackbar', {
            message: `Error al guardar la venta: ${error.message}`,
            color: 'error'
          });
        });
    },
    addProduct() {
      const selectedProduct = this.products.find(product => product.id === this.searchProduct);
      if (selectedProduct) {
        const productInSale = this.sale.items.find(p => p.product_id === selectedProduct.id);
        if (productInSale) {
          productInSale.quantity += 1;
          productInSale.amount = productInSale.quantity * selectedProduct.price;
        } else {
          this.sale.items.push({ 
            product_id: selectedProduct.id, 
            name: selectedProduct.name,
            quantity: 1, 
            price: selectedProduct.price, 
            amount: selectedProduct.price 
          });
        }
        this.calculateSummary();
        this.searchProduct = '';
      }
    },
    removeProduct(item) {
      this.sale.items = this.sale.items.filter(p => p.product_id !== item.product_id);
      this.calculateSummary();
    },
    updateAmount(item) {
      const product = this.products.find(p => p.id === item.product_id);
      if (product) {
        item.amount = item.quantity * product.price;
        this.calculateSummary();
      }
    },
    calculateSummary() {
      let subtotal = 0;
      this.sale.items.forEach(product => {
        subtotal += product.amount;
      });
      this.saleSummary[0].value = subtotal;
      this.saleSummary[3].value = subtotal - this.saleSummary[1].value + this.saleSummary[2].value; // Total
    },
    fetchData() {
      ClientService.getAllClients().then(response => {
        this.clients = response.data;
      });
      WarehouseService.getAllWarehouses().then(response => {
        this.warehouses = response.data;
      });
      ProductService.getAllProducts().then(response => {
        this.products = response.data;
      });
      InvoiceService.getAllInvoices().then(response => {
        this.invoices = response.data;
      });
      PaymentMethodService.getAllPaymentMethods().then(response => {
        this.paymentMethods = response.data;
      });
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
    onClientSelected(client_id) {
      const selectedClient = this.clients.find(client => client.id === client_id);
      if (selectedClient) {
        this.sale.address = selectedClient.address;
      }
    },
    onProductSelected(product_id) {
      this.addProduct();
    },
    addClient() {
      ClientService.createClient(this.newClient).then(() => {
        this.fetchData();
        this.addClientDialog = false;
        this.newClient = { name: '', email: '', phone: '', dni: '' };
        this.$store.dispatch('notification/showSnackbar', {
          message: 'Cliente agregado correctamente',
          color: 'success'
        });
      }).catch(error => {
        console.error('Error al agregar el cliente:', error);
        this.$store.dispatch('notification/showSnackbar', {
          message: `Error al agregar el cliente: ${error.message}`,
          color: 'error'
        });
      });
    }
  },
  created() {
    this.fetchData();
  }
};
</script>

<style scoped>
.headline {
  font-weight: bold;
}
</style>
