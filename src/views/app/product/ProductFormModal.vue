<!-- src/views/app/product/ProductFormModal.vue -->
<template>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{ isEdit ? 'Editar Producto' : 'Agregar Producto' }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field v-model="form.name" label="Nombre" required></v-text-field>
          <v-text-field v-model="form.description" label="Descripción" required></v-text-field>
          <v-text-field v-model="form.price" label="Precio" required type="number"></v-text-field>
          <v-select
            v-model="form.categoryId"
            :items="categories"
            item-text="name"
            item-value="id"
            label="Categoría"
            required
          ></v-select>
          <v-select
            v-model="form.brandId"
            :items="brands"
            item-text="name"
            item-value="id"
            label="Marca"
            required
          ></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="closeDialog">Cancelar</v-btn>
        <v-btn color="blue darken-1" text @click="saveProduct">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ProductService from '../services/product.service';
import CategoryService from '../services/category.service';
import BrandService from '../services/brand.service';
import NotificationSnackbar from  '../../../components/NotificationSnackbar.vue';

const initFormData = {
  id: null,
  name: '',
  description: '',
  price: 0,
  categoryId: null,
  brandId: null
};

export default {
  components: { NotificationSnackbar },
  data() {
    return {
      dialog: false,
      isEdit: false,
      form: { ...initFormData },
      categories: [],
      brands: []
    };
  },
  methods: {
    open(product) {
      if (product) {
        this.isEdit = true;
        this.form = { ...product };
      } else {
        this.isEdit = false;
        this.resetForm();
      }
      this.dialog = true;
      this.fetchCategories();
      this.fetchBrands();
    },
    closeDialog() {
      this.dialog = false;
    },
    resetForm() {
      this.form = { ...initFormData };
    },
    saveProduct() {
      if (this.isEdit) {
        ProductService.updateProduct(this.form.id, this.form)
          .then(() => {
            this.$store.dispatch('notification/showSnackbar', 
            { message: 'Producto actualizado correctamente', color: 'success' });
            this.$emit('updateList');
            this.closeDialog();
          })
          .catch(error => {
            this.$store.dispatch('notification/showSnackbar',
            { message: `Error al actualizar producto: ${error.message}`, color: 'error' });
            console.error('Error updating product:', error);
          });
      } else {
        ProductService.createProduct(this.form)
          .then(() => {
            this.$store.dispatch('notification/showSnackbar', 
            { message: 'Producto creado correctamente', color: 'success' });
            this.$emit('updateList');
            this.closeDialog();
          })
          .catch(error => {
            this.$store.dispatch('notification/showSnackbar',
            { message: `Error al crear producto: ${error.message}`, color: 'error' });
            console.error('Error creating product:', error);
          });
      }
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
  }
};
</script>

<style scoped>
</style>
