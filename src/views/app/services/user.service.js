import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/test/';

class UserService {
  getAllUsers() {
    return axios.get(API_URL + 'users', { headers: authHeader() });
  }

  createUser(user) {
    return axios.post(API_URL + 'users', user, { headers: authHeader() });
  }

  updateUser(id, user) {
    return axios.put(API_URL + 'users/' + id, user, { headers: authHeader() });
  }

  deleteUser(id) {
    return axios.delete(API_URL + 'users/' + id, { headers: authHeader() });
  }

  getAllRoles() {
    return axios.get(API_URL.replace('/test', '/roles'), { headers: authHeader() });
  }
}

export default new UserService();
