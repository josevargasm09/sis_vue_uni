import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/cajas/';

class CajaService {
  getAllCajas() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getCajaById(id) {
    return axios.get(API_URL + id, { headers: authHeader() });
  }

  createCaja(caja) {
    return axios.post(API_URL, caja, { headers: authHeader() });
  }

  updateCaja(id, caja) {
    return axios.put(API_URL + id, caja, { headers: authHeader() });
  }

  deleteCaja(id) {
    return axios.delete(API_URL + id, { headers: authHeader() });
  }
}

export default new CajaService();
