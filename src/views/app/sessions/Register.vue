<template>
    <div class="page-wrap">
        <div class="session-form-hold">
            <base-card>
                <v-card-text class="text-center">
                    <div class="py-3">
                        <h5 class="font-weight-bold">¡BIEVENIDO!</h5>
                        <p class="text--disabled font-weight-medium">
                            REGISTRAR UNA UNA CUENTA PARA ACCEDER
                        </p>
                    </div>
                    <v-avatar tile size="200" class="mb-4">
                        <img
                            src="@/assets/images/illustrations/posting_photo.svg"
                            alt=""
                        />
                    </v-avatar>

                    <h6 class="text--disabled font-weight-medium mb-10">
                         REGISTRAR UNA CUENTA
                    </h6>
                     <form name="form" @submit.prevent="handleRegister">
                            <div v-if="!successful">
                              <div class="form-group">
                                <v-text-field for="username" name="username" v-model="user.username" :rules="usernameRules"  label="Username" required outlined type="text"/> 
                                <!-- <input v-model="user.username" 
                                    v-validate="'required|min:3|max:20'" 
                                    type="text" class="form-control"
                                    name="username" /> -->
                                <div v-if="submitted && 
                                    errors.has('username')" 
                                    class="alert-danger">{{ 
                                    errors.first('username') }}</div>
                              </div>
                              <div class="form-group">
                                <v-text-field for="email"  name="email" v-model="user.email"  :rules="emailRules"   v-validate="'required|email|max:50'"  label="Email" required outlined type="text"/> 
                                    <!-- <label for="email">Email </label>
                                    <input v-model="user.email" 
                                    v-validate="'required|email|max:50'" 
                                    type="email" 
                                    class="form-control"
                                    name="email" /> -->
                                <div v-if="submitted && 
                                    errors.has('email')" 
                                    class="alert-danger">{{ 
                                    errors.first('email') }}</div>
                              </div>
                              <div class="form-group">

                                <v-text-field for="password"  name="password" v-model="user.password"  v-validate="'required|min:6|max:40'"  label="Password" required outlined type="password"/>
                                <!-- <label for="password">Password </label>
                                <input v-model="user.password"
                                      v-validate="'required|min:6|max:40'"
                                      type="password" class="form-control"
                                      name="password" />  -->
                                <div v-if="submitted && 
                                    errors.has('password')" 
                                    class="alert-danger">{{ 
                                    errors.first('password') }}</div>
                              </div>
                              <div class="form-group">
                                <v-btn color="primary" class="btn-block" @click="handleRegister"> Registrar</v-btn>
                                <!-- <v-btn   color="primary"  dark button class="btn btn-primary btn-block" >Registrarse</v-btn> -->
                                <!-- <button class="btn btn-primary btn-block" color="primary">Registrar</button> -->
                                
                              </div>
                            </div>
                      </form>
                      <div class="">
                        ¿Ya tienes una cuenta?
                        <v-btn
                            text
                            small
                            color="primary"
                            to="/app/sessions/login"
                            >Iniciar sesion</v-btn
                        >
                    </div>

                </v-card-text>

                <!-- error password snackbar  -->
                <!-- <v-snackbar v-model="snackbar" top color="danger">
                    Email and Password must be required

                    <template v-slot:action="{attrs}">
                        <v-btn
                            color=""
                            text
                            v-bind="attrs"
                            @click="snackbar = false"
                        >
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </template>
                </v-snackbar> -->
            </base-card>
        </div>
    </div>
</template>
<script>
import {mapGetters, mapActions} from 'vuex'
import firebase from 'firebase/app'
import User from '../models/user';
// firebase sdk
// var firebaseConfig = {
//   apiKey: "AIzaSyCzb5-JZHbTZA8AOvUgscCTZbPN8gdRFvw",
//   authDomain: "fir-auth-f6c58.firebaseapp.com",
//   databaseURL: "https://fir-auth-f6c58.firebaseio.com",
//   projectId: "fir-auth-f6c58",
//   storageBucket: "fir-auth-f6c58.appspot.com",
//   messagingSenderId: "541805155537",
//   appId: "1:541805155537:web:21eb9b0c161ca1f8a161f0"
// };
// // Initialize Firebase
// firebase.initializeApp(firebaseConfig);

export default {
    name: 'Register',
    metaInfo: {
        // title will be injected into parent titleTemplate
        title: 'Registrar'
    },
    data() {
    return {
      user: new User('', '', ''),
      submitted: false,
      successful: false,
      message: '',


      usernameRules: [
        v => !!v || 'Username is required',
        v => (v && v.length >= 3) || 'Username must be at least 3 characters',
        v => (v && v.length <= 20) || 'Username must be less than 20 characters',
      ],
      emailRules: [
        v => !!v || 'Email is required',
        v => (v && v.length >= 10) || 'Username must be at least 3 characters',
        v => (v && v.length <= 50) || 'Username must be less than 20 characters',
      ],
    };

    
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }
  },

  mounted() {
    if (this.loggedIn) {
      this.$router.push('');
    }
  },

  methods: {
    handleRegister() {
      this.message = '';
      this.submitted = true;
      this.$validator.validate().then(isValid => {
        if (isValid) {
          this.$store.dispatch('auth/register', this.user).then(
            data => {
              this.message = data.message;
              this.successful = true;
            },
            error => {
              this.message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
              this.successful = false;
            }
          );
        }
      });
    }
  }

    // methods: {
    //     ...mapActions(['signUserUp']),
    //     submit() {
    //         if (this.email && this.ePassword) {
    //             this.signUserUp({email: this.email, password: this.ePassword})

    //             setTimeout(() => {
    //                 console.log('done')
    //             }, 1000)
    //         } else {
    //             this.snackbar = true
    //         }
    //     }
    //     // signUp: function() {
    //     //   // console.log(this.email, this.ePassword);
    //     //   firebase.auth().createUserWithEmailAndPassword(this.email, this.ePassword)
    //     //     .then(
    //     //       user => {
    //     //         console.log(user.data);

    //     //       },
    //     //       err => {
    //     //         console.log(err);

    //     //       }
    //     //     )
    //     // }
    // }
}
</script>
<style lang="scss" scoped>
.page-wrap {
    background-color: #242939 !important;
    display: flex;
    align-items: center;
    padding: 40px 1rem;
    height: 100%;
    min-height: 100vh;
}
.session-form-hold {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
}
</style>
