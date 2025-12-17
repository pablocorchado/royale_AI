import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const clashService = {
  async getCompleteProfile(playerTag) {
    const cleanTag = playerTag.replace('#', '');
    const response = await api.get(`/api/clash/player/${cleanTag}/complete`);
    return response.data;
  },

  async getHistory(playerTag, limit = 30) {
    const cleanTag = playerTag.replace('#', '');
    const response = await api.get(`/api/clash/history/${cleanTag}?limit=${limit}`);
    return response.data;
  },
};

export default api;
