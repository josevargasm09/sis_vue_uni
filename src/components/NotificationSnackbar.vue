<!-- src/components/NotificationSnackbar.vue -->
<template>
  <v-snackbar v-model="snackbar.visible" :color="snackbar.color" top timeout="2000">
    {{ snackbar.message }}
    <v-btn color="white" text @click="closeSnackbar">Cerrar</v-btn>
  </v-snackbar>
</template>

<script>
export default {
  computed: {
    
    snackbar() {
      return this.$store.getters['notification/snackbar'];
    }
  },
  methods: {
    closeSnackbar() {
      this.$store.dispatch('notification/hideSnackbar');
    }
  }
};
</script>
