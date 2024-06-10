<template>
    <div class="page-wrap">
        <div class="session-form-hold">
            <base-card>
                <v-progress-linear
                    :active="loading"
                    :indeterminate="loading"
                    absolute
                    top
                    color="primary"
                ></v-progress-linear>
                <v-card-text class="text-center">
                    <v-avatar size="60" class="mb-4">
                        <img src="@/assets/images/logo.svg" alt="" /> 
                    </v-avatar>

                    <h6 class="text--disabled font-weight-medium mb-10">
                        Iniciar Sesion
                    </h6>
                    <form name="form" @submit.prevent="handleLogin">
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
                              <!-- <div class="form-group">
                                <v-text-field for="email"  name="email" v-model="user.email"  :rules="emailRules"   v-validate="'required|email|max:50'"  label="Email" required outlined type="text"/>  -->
                                    <!-- <label for="email">Email </label>
                                    <input v-model="user.email" 
                                    v-validate="'required|email|max:50'"  
                                    type="email" 
                                    class="form-control"
                                    name="email" /> -->
                                <!-- <div v-if="submitted && 
                                    errors.has('email')" 
                                    class="alert-danger">{{ 
                                    errors.first('email') }}</div>
                              </div> -->
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
                                <v-btn color="primary" class="btn-block" @click="handleLogin"> Iniciar Sesion</v-btn>
                                <!-- <v-btn   color="primary"  dark button class="btn btn-primary btn-block" >Registrarse</v-btn> -->
                                <!-- <button class="btn btn-primary btn-block" color="primary">Registrar</button> -->
                                
                              </div>
                            </div>
                      </form>
                      <div class="">
                        ¿Aún no tienes una cuenta?
                        <v-btn
                            text
                            small
                            color="primary"
                            to="/app/sessions/register"
                         > Registrate</v-btn>
                    </div>
                </v-card-text>
            </base-card>
        </div>
    </div>
</template>
<script>
import firebase from 'firebase/app'
import {mapGetters, mapActions} from 'vuex'
import User from '../models/user';
export default {
    name: 'Login',
    metaInfo: {
        // title will be injected into parent titleTemplate
        title: 'SignIn Two'
    },
    data() {
        return {
      user: new User('', ''),
      loading: false,
      successful: false,
      submitted: false,
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

loggedIn() {
        console.log("pasaa3");
      return this.$store.state.auth.status.loggedIn;
    },

    created() {
        console.log("pasaa1");
    if (this.loggedIn ) {
        console.log("pasaa2");
      this.$router.push('/app/dashboard/analytic');
    }
  },
      computed: {
        
    
},
 
    methods: {
        ...mapActions(['login']),
        // login: function() {
        //   firebase.auth().signInWithEmailAndPassword(this.email, this.ePassword)
        //     .then(
        //       user => {
        //         // console.log(user);
        //         this.loading = true;
        //         this.$router.push('/');

        //       },
        //       err => {

        //         // alert(err);

        //       }
        //     )
        // },
    handleLogin() {
      this.loading = true;
      this.message = '';
      this.submitted = true;
      this.$validator.validateAll().then(isValid => {
        if (!isValid) {
          this.loading = false;
          return;
        }
        console.log("pasaa4");
        if (this.user.username && this.user.password) {
          this.$store.dispatch('auth/login', this.user).then(
            () => {
              this.$router.push('/app/dashboard/analytic');
            },
            error => {
              this.loading = false;
              this.message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            }
          );
        }
      });
    },
        // formSubmit() {
        //     this.login({email: this.email, password: this.ePassword})
        // },
        googleSignIn() {
            const provider = new firebase.auth.GoogleAuthProvider()

            firebase
                .auth()
                .signInWithPopup(provider)
                .then((result) => {
                    const newUser = {uid: result.user.uid}
                    localStorage.setItem('userInfo', JSON.stringify(newUser))
                    this.$router.push('/')
                })
                .catch((err) => {
                    alert('Oops' + err.message)
                })
        }
    },
    watch: {
        // loading (val) {
        //   if (!val) return
        //   setTimeout(() => (this.loading = false), 2000)
        // },
        // loggedInUser(val) {
        //     if (val && val.uid && val.uid.length > 0) {
        //         console.log("escuchando");
        //         // this.makeToast("success", "Successfully Logged In");
        //         console.log('logged in successfully ')
        //         this.loading = true
        //         setTimeout(() => {
        //             this.$router.push('/')
        //         }, 500)
        //     }
        // },
        error(val) {
            if (val != null) {
                // this.makeToast("warning", val.message);
            }
        }
    }
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
