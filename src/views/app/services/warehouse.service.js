// src/services/warehouse.service.js
import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/warehouses';

class WarehouseService {
  getAllWarehouses() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getWarehouseById(id) {
    return axios.get(`${API_URL}/${id}`, { headers: authHeader() });
  }

  createWarehouse(warehouse) {
    return axios.post(API_URL, warehouse, { headers: authHeader() });
  }

  updateWarehouse(id, warehouse) {
    return axios.put(`${API_URL}/${id}`, warehouse, { headers: authHeader() });
  }

  deleteWarehouse(id) {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
  }
}

export default new WarehouseService();
