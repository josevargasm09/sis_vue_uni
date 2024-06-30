<!-- src/views/app/product/IndexProduct.vue -->
<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn color="primary" @click="openCreateDialog">AGREGAR PRODUCTO</v-btn>
        <v-text-field
          v-model="search"
          label="Buscar"
          append-icon="mdi-magnify"
          single-line
          hide-details
        ></v-text-field>
        <v-data-table
          :headers="headers"
          :items="filteredProducts"
          :search="search"
          item-key="id"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon small @click="openEditDialog(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteProduct(item.id)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    <ProductFormModal ref="productFormModal" @updateList="fetchProducts" />
    <NotificationSnackbar
      :message="notificationMessage"
      :color="notificationColor"
      :visible="notificationVisible"
    />
  </v-container>
</template>

<script>
import ProductFormModal from './ProductFormModal.vue';
import ProductService from '../services/product.service';
import CategoryService from '../services/category.service';
import BrandService from '../services/brand.service';
import NotificationSnackbar from '../../../components/NotificationSnackbar.vue';
import { mapGetters } from 'vuex';

export default {
  components: {
    ProductFormModal,
    NotificationSnackbar
  },
  data() {
    return {
      search: '',
      products: [],
      categories: [],
      brands: [],
      headers: [
        { text: 'Nombre', value: 'name' },
        { text: 'Descripción', value: 'description' },
        { text: 'Precio', value: 'price' },
        { text: 'Categoría', value: 'categoryName' },
        { text: 'Marca', value: 'brandName' },
        { text: 'Acciones', value: 'actions', sortable: false }
      ]
    };
  },
  computed: {
    filteredProducts() {
      return this.products.map(product => ({
        ...product,
        categoryName: this.getCategoryName(product.categoryId),
        brandName: this.getBrandName(product.brandId)
      }));
    },
    ...mapGetters({
      notificationVisible: 'snackbarVisible',
      notificationMessage: 'snackbarMessage',
      notificationColor: 'snackbarColor'
    })
  },
  methods: {
    fetchProducts() {
      ProductService.getAllProducts()
        .then(response => {
          this.products = response.data;
        })
        .catch(error => {
          this.showNotification(`Error fetching products: ${error.message}`, 'error');
        });
      this.fetchCategories();
      this.fetchBrands();
    },
    openCreateDialog() {
      this.$refs.productFormModal.open();
    },
    openEditDialog(product) {
      this.$refs.productFormModal.open(product);
    },
    deleteProduct(id) {
      ProductService.deleteProduct(id)
        .then(() => {
          this.fetchProducts();
          this.$store.dispatch('notification/showSnackbar', 
          { message: 'Producto eliminado correctamente', color: 'success' });
        })
        .catch(error => {
          this.$store.dispatch('notification/showSnackbar',
          { message: `Error al eliminar producto: ${error.message}`, color: 'error' });
        });
    },
    showNotification(message, color) {
      this.$store.dispatch('notification/showSnackbar', { message, color });
    },
    getCategoryName(categoryId) {
      const category = this.categories.find(category => category.id === categoryId);
      return category ? category.name : 'Desconocido';
    },
    getBrandName(brandId) {
      const brand = this.brands.find(brand => brand.id === brandId);
      return brand ? brand.name : 'Desconocido';
    },
    fetchCategories() {
      CategoryService.getAllCategories()
        .then(response => {
          this.categories = response.data;
        })
        .catch(error => {
          console.error('Error fetching categories:', error);
        });
    },
    fetchBrands() {
      BrandService.getAllBrands()
        .then(response => {
          this.brands = response.data;
        })
        .catch(error => {
          console.error('Error fetching brands:', error);
        });
    }
  },
  created() {
    this.fetchProducts();
  }
};
</script>

<style scoped>
</style>
