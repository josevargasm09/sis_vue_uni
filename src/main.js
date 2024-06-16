import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VeeValidate from 'vee-validate';

import vuetify from './plugins/vuetify';
import './plugins';

import octaviaKit from '@/plugins/octavia.kit';
import VueApexCharts from 'vue-apexcharts';
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-default.css';  // or another theme like 'theme-sugar.css'
import setupAxiosInterceptors from '../src/views/app/services/axios-interceptor.js';
setupAxiosInterceptors();
// mock
import './fake-db/index.js';

Vue.component('apexchart', VueApexCharts);

Vue.use(VeeValidate);
Vue.use(octaviaKit);
Vue.use(VueToast);  

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
