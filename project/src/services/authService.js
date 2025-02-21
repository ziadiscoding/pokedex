import api from './api';

export const authService = {
  async login(username, password) {
    const response = await api.post('/auth/login', { username, password });
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('userId', response.data.data.user.id);
    }
    return response.data;
  },

  async register(username, email, password) {
    const response = await api.post('/auth/register', { username, email, password });
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('userId', response.data.data.user.id);
    }
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data.data.user;
  },

  async updateProfile(updateData) {
    const oldUsername = (await this.getCurrentUser()).username;
    const response = await api.put('/auth/me', updateData);
    
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    
    if (updateData.username && updateData.username !== oldUsername) {
      return {
        ...response.data,
        requiresRelogin: true
      };
    }
    
    return response.data;
  },

  async refreshToken() {
    const response = await api.post('/auth/refresh');
    if (response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  getUserId() {
    return localStorage.getItem('userId');
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  },

  softLogout() {
    localStorage.removeItem('token');
  }
};