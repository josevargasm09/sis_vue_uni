// src/services/axios-interceptor.js
import axios from 'axios';
import AuthService from '../services/authService';
import Vue from 'vue';
import router from '../../../router';

export default function setupAxiosInterceptors() {
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;
  
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
  
          try {
            const rs = await AuthService.refreshToken();
  
            if (rs.status === 200) {
              localStorage.setItem('user', JSON.stringify(rs.data));
  
              axios.defaults.headers.common['Authorization'] = 'Bearer ' + rs.data.accessToken;
  
              return axios(originalRequest);
            }
          } catch (_error) {
            AuthService.logout();
  
            Vue.$toast.open({
              message: 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.',
              type: 'error',
            });
  
            setTimeout(() => {
              router.push('/app/sessions/login');
            }, 3000); // Espera 3 segundos antes de redirigir
  
            return Promise.reject(_error);
          }
        }
  
        return Promise.reject(error);
      }
    );
  }