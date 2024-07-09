import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/sales/';

class SaleService {
  getAllSales() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getSaleById(id) {
    return axios.get(API_URL + id, { headers: authHeader() });
  }

  createSale(sale) {
    return axios.post(API_URL, sale, { headers: authHeader() });
  }

  updateSale(sale) {
    return axios.put(API_URL + sale.id, sale, { headers: authHeader() });
  }

  deleteSale(id) {
    return axios.delete(API_URL + id, { headers: authHeader() });
  }

  // searchSales(query) {
  //   return axios.get(API_URL + 'search', {
  //     headers: authHeader(),
  //     params: { query }
  //   });
  // }
}

export default new SaleService();
