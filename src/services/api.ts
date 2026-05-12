import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Use your computer's local IP address here for physical devices
// For Android Emulator: http://10.0.2.2:5000/api
// For iOS Simulator: http://localhost:5000/api
const BASE_URL = 'http://192.168.1.7:5000/api'; // Corrected IP Address

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (phone: string, password: string) => {
    const response = await api.post('/auth/login', { phone, password });
    if (response.data.token) {
      await SecureStore.setItemAsync('userToken', response.data.token);
      await SecureStore.setItemAsync('userRole', response.data.user.role);
    }
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      await SecureStore.setItemAsync('userToken', response.data.token);
      await SecureStore.setItemAsync('userRole', response.data.user.role);
    }
    return response.data;
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('userToken');
    await SecureStore.deleteItemAsync('userRole');
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  becomeEditor: async () => {
    const response = await api.post('/auth/become-editor');
    if (response.data.message.includes('Successfully')) {
      await SecureStore.setItemAsync('userRole', 'EDITOR');
    }
    return response.data;
  },

  isAuthenticated: async () => {
    const token = await SecureStore.getItemAsync('userToken');
    return !!token;
  },
};

export default api;
