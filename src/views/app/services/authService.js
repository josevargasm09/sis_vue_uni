import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

class AuthService {
  login(user) {
    return axios
      .post(API_URL + 'signin', {
        username: user.username,
        password: user.password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(user) {
    return axios.post(API_URL + 'signup', {
      username: user.username,
      email: user.email,
      password: user.password
    });
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  refreshToken() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.refreshToken) {
      return axios.post(API_URL + 'refreshtoken', {
        refreshToken: user.refreshToken,
      });
    }
    return Promise.reject(new Error('No refresh token available'));
  }
}

export default new AuthService();
