<template>
  <v-dialog
    v-model="dialog"
    max-width="500px"
  >
    <v-card>
      <v-card-title class="text-h6 pa-0 pl-3 grey lighten-2">
        <p class="mb-0 text-capitalize secondary--text text-sm font-weight-semibold">
          Usuario
        </p>
        <v-spacer></v-spacer>
        <v-btn icon x-small dark @click="dialog = false" class="ma-1 secondary--text">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row dense>
          <v-col cols="12" md="12" sm="12">
            <v-text-field
              hide-details
              label="Usuario"
              outlined
              class="pa-1 black-border"
              dense
              v-model="form.username"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="12" sm="12">
            <v-text-field
              class="pa-1"
              hide-details
              label="Email"
              outlined
              dense
              v-model="form.email"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="12" sm="12">
            <v-text-field
              class="pa-1"
              hide-details
              outlined
              dense
              v-model="form.password"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rulesTwo.required, rulesTwo.min]"
              :type="show1 ? 'text' : 'password'"
              name="input-10-1"
              label="Contraseña"
              hint="At least 8 characters"
              counter
              @click:append="show1 = !show1"
            />
          </v-col>
          <v-col cols="12" md="12" sm="12">
            <v-text-field
              class="pa-1"
              hide-details
              outlined
              dense
              v-model="form.remember_password"
              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="[rulesTwo.required, rulesTwo.min]"
              :type="show1 ? 'text' : 'password'"
              name="input-10-1"
              label="Repetir Contraseña"
              hint="At least 8 characters"
              counter
              @click:append="show1 = !show1"
            />
          </v-col>
          <v-col cols="12" md="12" sm="12">
            <v-select
              v-model="form.profile_id"
              class="pa-1"
              :items="profiles"
              hide-details
              label="Perfil"
              outlined
              menu-props="offset-y"
              dense
              item-text="description"
              item-value="id"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" @click="dialog = false">
          Cerrar
        </v-btn>
        <v-btn color="primary" @click="registerUser">
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios';
import Vue from 'vue';

const initFormData = {
  id: '-1',
  username: '',
  email: '',
  password: '',
  remember_password: '',
  profile_id: null,
};

export default {
  data() {
    return {
      form: Object.assign({}, initFormData),
      profiles: [],
      show1: false,
      dialog: false,
      rulesTwo: {
        required: (value) => !!value || 'Required.',
        min: (v) => v.length >= 8 || 'Min 8 characters',
        emailMatch: () => "The email and password you entered don't match",
      },
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    resetForm() {
      Vue.set(this.$data, 'form', Object.assign({}, initFormData));
    },
    registerUser() {
      axios.post('auth/register', this.form)
        .then(response => {
          this.$emit('updateList');
          this.dialog = false;
        })
        .catch(error => {
          console.error(error);
        });
    },
    init() {
      axios.get('/api/profile/get/')
        .then(response => {
          let res = response.data;
          this.profiles = res.profile;
          this.addOptionSelected(res.profile);
        })
        .catch(error => {
          console.error(error);
        });
    },
    addOptionSelected(data) {
      let option_selected = {
        id: null,
        description: "::Seleccionar::",
      };
      data.unshift(option_selected);
    },
    open() {
      this.resetForm();
      this.dialog = true;
    },
  },
};
</script>

<style scoped>
::v-deep .my-custom-dialog {
  align-self: flex-start;
}
</style>
