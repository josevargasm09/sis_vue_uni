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
                              <div v-if="submitted && errors.has('username')" class="alert-danger">{{ errors.first('username') }}</div>
                            </div>
                            <div class="form-group">
                              <v-text-field for="password" name="password" v-model="user.password" v-validate="'required|min:6|max:40'" label="Password" required outlined type="password"/>
                              <div v-if="submitted && errors.has('password')" class="alert-danger">{{ errors.first('password') }}</div>
                            </div>
                            <div class="form-group">
                              <v-btn color="primary" class="btn-block" @click="handleLogin">Iniciar Sesion</v-btn>
                            </div>
                          </div>
                    </form>
                    <div v-if="message" class="alert alert-danger" role="alert">{{ message }}</div>
                    <div class="">
                      ¿Aún no tienes una cuenta?
                      <v-btn text small color="primary" to="/app/sessions/register">Registrate</v-btn>
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
  created() {
      if (this.loggedIn) {
          this.$router.push('/app/dashboard/analytic');
      }
  },
  computed: {
      loggedIn() {
          return this.$store.state.auth.status.loggedIn;
      }
  },
  methods: {
    ...mapActions(['login']),
    handleLogin() {
  this.loading = true;
  this.message = '';
  this.submitted = true;
  this.$validator.validateAll().then(isValid => {
    if (!isValid) {
      this.loading = false;
      return;
    }
    if (this.user.username && this.user.password) {
      this.$store.dispatch('auth/login', this.user).then(
        () => {
          if (this.$route.path !== '/app/dashboard/analytic') {
            this.$router.push('/app/dashboard/analytic');
          }
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
