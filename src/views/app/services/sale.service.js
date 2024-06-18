// src/services/sale.service.js
import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/sales';

class SaleService {
  getAllSales() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getSaleById(id) {
    return axios.get(`${API_URL}/${id}`, { headers: authHeader() });
  }

  createSale(sale) {
    return axios.post(API_URL, sale, { headers: authHeader() });
  }

  updateSale(id, sale) {
    return axios.put(`${API_URL}/${id}`, sale, { headers: authHeader() });
  }

  deleteSale(id) {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
  }
}

export default new SaleService();
