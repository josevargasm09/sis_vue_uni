import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/purchase-reports/';

class PurchaseReportService {
  getAllReports() {
    return axios.get(API_URL, { headers: authHeader() });
  }

  getReportById(id) {
    return axios.get(API_URL + id, { headers: authHeader() });
  }

  createReport(report) {
    return axios.post(API_URL, report, { headers: authHeader() });
  }

  updateReport(report) {
    return axios.put(API_URL + report.id, report, { headers: authHeader() });
  }

  deleteReport(id) {
    return axios.delete(API_URL + id, { headers: authHeader() });
  }
}

export default new PurchaseReportService();
