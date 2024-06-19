import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/clients';

class ClientService {
  getAllClients() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  searchClients(query) {
    return axios.get(`${API_URL}/search?query=${query}`, { headers: authHeader() });
  }

  createClient(client) {
    return axios.post(API_URL, client, { headers: authHeader() });
  }

  updateClient(id, client) {
    return axios.put(`${API_URL}/${id}`, client, { headers: authHeader() });
  }

  deleteClient(id) {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
  }
}

export default new ClientService();
