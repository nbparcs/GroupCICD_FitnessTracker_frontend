import api from './api';

const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login/', credentials);
    if (response.data.tokens) {
      localStorage.setItem('accessToken', response.data.tokens.access);
      localStorage.setItem('refreshToken', response.data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
      await api.post('/auth/logout/', { refresh_token: refreshToken });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile/');
    return response.data;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },
};

export default authService;
