// src/services/C.service.js

import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/branches';

class BranchService {
  getAllBranches() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getBranchById(id) {
    return axios.get(`${API_URL}/${id}`, { headers: authHeader() });
  }

  createBranch(data) {
    return axios.post(API_URL, data, { headers: authHeader() });
  }

  updateBranch(id, data) {
    return axios.put(`${API_URL}/${id}`, data, { headers: authHeader() });
  }

  deleteBranch(id) {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
  }
}

export default new BranchService();
