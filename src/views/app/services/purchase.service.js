import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/purchases/';

class PurchaseService {
  getAllPurchases() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getPurchaseById(id) {
    return axios.get(API_URL + id, { headers: authHeader() });
  }

  createPurchase(purchase) {
    return axios.post(API_URL, purchase, { headers: authHeader() });
  }

  updatePurchase(id, purchase) {
    return axios.put(API_URL + id, purchase, { headers: authHeader() });
  }

  deletePurchase(id) {
    return axios.delete(API_URL + id, { headers: authHeader() });
  }
}

export default new PurchaseService();
