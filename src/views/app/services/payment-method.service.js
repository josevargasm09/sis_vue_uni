// src/services/payment-method.service.js
import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/payment-methods';

class PaymentMethodService {
  getAllPaymentMethods() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getPaymentMethodById(id) {
    return axios.get(`${API_URL}/${id}`, { headers: authHeader() });
  }

  createPaymentMethod(paymentMethod) {
    return axios.post(API_URL, paymentMethod, { headers: authHeader() });
  }

  updatePaymentMethod(id, paymentMethod) {
    return axios.put(`${API_URL}/${id}`, paymentMethod, { headers: authHeader() });
  }

  deletePaymentMethod(id) {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
  }
}

export default new PaymentMethodService();
