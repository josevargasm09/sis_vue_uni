// src/services/category.service.js

import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/categories';

class CategoryService {
  getAllCategories() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getCategoryById(id) {
    return axios.get(`${API_URL}/${id}`, { headers: authHeader() });
  }

  createCategory(data) {
    return axios.post(API_URL, data, { headers: authHeader() });
  }

  updateCategory(id, data) {
    return axios.put(`${API_URL}/${id}`, data, { headers: authHeader() });
  }

  deleteCategory(id) {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
  }
}

export default new CategoryService();
