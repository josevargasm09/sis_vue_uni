// src/services/invoice.service.js
import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/invoices';

class InvoiceService {
  getAllInvoices() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getInvoiceById(id) {
    return axios.get(`${API_URL}/${id}`, { headers: authHeader() });
  }

  createInvoice(invoice) {
    return axios.post(API_URL, invoice, { headers: authHeader() });
  }

  updateInvoice(id, invoice) {
    return axios.put(`${API_URL}/${id}`, invoice, { headers: authHeader() });
  }

  deleteInvoice(id) {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
  }
}

export default new InvoiceService();
