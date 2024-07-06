import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/suppliers/';

class SupplierService {
  getAllSuppliers() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getSupplierById(id) {
    return axios.get(API_URL + id, { headers: authHeader() });
  }

  createSupplier(supplier) {
    return axios.post(API_URL, supplier, { headers: authHeader() });
  }

  updateSupplier(id, supplier) {
    return axios.put(API_URL + id, supplier, { headers: authHeader() });
  }

  deleteSupplier(id) {
    return axios.delete(API_URL + id, { headers: authHeader() });
  }
}

export default new SupplierService();
