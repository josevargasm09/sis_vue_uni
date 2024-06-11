<template>
    <v-row>
      <v-col cols="12">
        <base-card>
          <v-card-title>
            <div class="d-flex justify-space-between flex-wrap">
              <v-btn class="ma-2" dark color="danger" @click="openFormModal">
                <v-icon>mdi-plus</v-icon>
                Agregar Usuario 
              </v-btn>
              <div>
                <v-btn class="ma-2" color="primary">
                  <v-icon>mdi-cog</v-icon>
                </v-btn>
                <v-btn outlined class="ma-2">Import</v-btn>
                <v-btn outlined class="ma-2">Export</v-btn>
              </div>
            </div>
          </v-card-title>
          <v-card-title>
            Usuarios
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            v-model="selected"
            :search="search"
            :headers="headers"
            :items="users"
            item-key="username"
            show-select
            class="elevation-1 table-one"
            multi-sort
          >
            <template v-slot:item.username="{ item }">
              <div class="d-flex align-center">
                <p class="ma-0 font-weight-medium">{{ item.username }}</p>
              </div>
            </template>
            <template v-slot:item.action="{ item }">
              <div class="d-flex">
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="success" dark v-bind="attrs" v-on="on" icon>
                      <v-icon>mdi-pencil-box-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Edit</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn color="danger" dark v-bind="attrs" v-on="on" icon>
                      <v-icon>mdi-trash-can-outline</v-icon>
                    </v-btn>
                  </template>
                  <span>Delete</span>
                </v-tooltip>
              </div>
            </template>
            <template v-slot:item.badge="{ item }">
              <template v-if="item.badge === 'Active'">
                <v-chip color="success" label small text-color="white">
                  <v-icon small left>mdi-check</v-icon>
                  {{ item.badge }}
                </v-chip>
              </template>
              <template v-else>
                <v-chip color="danger" label small text-color="white">
                  <v-icon small left>mdi-close</v-icon>
                  {{ item.badge }}
                </v-chip>
              </template>
            </template>
          </v-data-table>
        </base-card>
        <!-- Form Modal -->
        <UserFormModal ref="userFormModal" @updateList="fetchUsers"/>
      </v-col>
    </v-row>
  </template>
  
  <script>
  import UserService from '../services/user.service.js'
  import axios from 'axios';
  import authHeader from '../services/auth-header.js';
  import UserFormModal from './UserFormModal.vue'; // Import the form modal component
  
  export default {
    data() {
      return {
        search: '',
        users: [],
        selected: [],
        headers: [
          { text: 'Name', value: 'username' },
          { text: 'Email', value: 'email' },
          { text: 'Actions', value: 'action', sortable: false },
          // Otros encabezados según sea necesario
        ]
      };
    },
    created() {
      this.fetchUsers();
    },
    methods: {
      fetchUsers() {
        axios.get('http://localhost:8080/api/test/users', {
          headers: authHeader()   
        })
        .then(response => {
          this.users = response.data;
        })
        .catch(error => {
          console.error('Error fetching users:', error);
        });
      },
      openFormModal() {
        this.$refs.userFormModal.open();
      }
    },
    components: {
      UserFormModal // Register the form modal component
    }
  };
  </script>
  
  <style scoped>
  .table-one {
    width: 100%;
  }
  </style>
  