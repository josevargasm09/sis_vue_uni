import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/brands/';

class BrandService {
  getAllBrands() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getBrandById(id) {
    return axios.get(API_URL + id, { headers: authHeader() });
  }

  createBrand(brand) {
    return axios.post(API_URL, brand, { headers: authHeader() });
  }

  updateBrand(id, brand) {
    return axios.put(API_URL + id, brand, { headers: authHeader() });
  }

  deleteBrand(id) {
    return axios.delete(API_URL + id, { headers: authHeader() });
  }
}

export default new BrandService();