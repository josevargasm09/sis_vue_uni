import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/roles/';

class RoleService {
  getAllRoles() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  createRole(role) {
    return axios.post(API_URL, role);
  }

  updateRole(id, role) {
    return axios.put(`${API_URL}${id}`, role);
  }
  deleteRole(id) {
    return axios.delete(API_URL + id, { headers: authHeader() });
  }
}

export default new RoleService();
