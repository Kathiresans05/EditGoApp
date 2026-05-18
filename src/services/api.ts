import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Default URLs
const getDebuggerHost = () => {
  // Try getting from expoConfig
  let hostUri = Constants.expoConfig?.hostUri;
  
  // If not there, try manifest (for older versions/certain builds)
  if (!hostUri && (Constants as any).manifest) {
    hostUri = (Constants as any).manifest.debuggerHost;
  }

  if (!hostUri) {
    console.log('[API] No hostUri found in Constants');
    return null;
  }
  
  // hostUri is usually something like "192.168.1.7:8081"
  const ip = hostUri.split(':')[0];
  const url = `http://${ip}:8000/api`;
  console.log('[API] Detected Backend URL:', url);
  return url;
};

const DEFAULT_ANDROID_URL = 'http://10.0.2.2:8000/api';
const DETECTED_URL = getDebuggerHost();
const FALLBACK_URL = 'http://192.168.1.26:8000/api'; // Using detected machine IP as fallback

export let BASE_URL = 'http://192.168.1.26:8000/api'; // FORCE EXACT IP FOR NOW

// Initialize BASE_URL from SecureStore if available
export const initBaseUrl = async () => {
  // FORCE THE CORRECT IP
  const FORCED_IP = 'http://192.168.1.26:8000/api';
  console.log('[API] Forcing IP address to:', FORCED_IP);
  BASE_URL = FORCED_IP;
  api.defaults.baseURL = FORCED_IP;
};

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

export const adminService = {
  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },
  getUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data;
  },
  getEditors: async () => {
    const response = await api.get('/admin/editors');
    return response.data;
  },
  getOrders: async () => {
    const response = await api.get('/admin/orders');
    return response.data;
  },
  getRevenue: async () => {
    const response = await api.get('/admin/revenue');
    return response.data;
  },
};

export const orderService = {
  createOrder: async (orderData: any) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  getMyOrders: async () => {
    const response = await api.get('/orders/my');
    return response.data;
  },
  getOrderById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  processPayment: async (orderId: string, paymentId: string) => {
    const response = await api.patch(`/orders/${orderId}/status`, { isPaid: true, paymentId });
    return response.data;
  }
};

export const ROOT_URL = BASE_URL.replace('/api', '');

export const editorService = {
  getAssignedOrders: async () => {
    const response = await api.get('/orders/my');
    return response.data;
  },
  updateOrderStatus: async (orderId: string, status: string, progress: number) => {
    const response = await api.patch(`/orders/${orderId}/status`, { status, progress });
    return response.data;
  },
  uploadPreview: async (orderId: string, previewUrl: string) => {
    const response = await api.post(`/orders/${orderId}/previews`, { previewUrl });
    return response.data;
  },
  uploadFinalWork: async (orderId: string, finalUrl: string) => {
    const response = await api.patch(`/orders/${orderId}/status`, { finalUrl, status: 'COMPLETED', progress: 100 });
    return response.data;
  },
  toggleOnline: async (isOnline: boolean) => {
    // This would ideally be a separate endpoint, but for now we can use a generic profile update
    const response = await api.post('/auth/update-profile', { isOnline });
    return response.data;
  }
};

export const customerService = {
  getHomeData: async () => {
    const response = await api.get('/customer/home');
    return response.data;
  },
  getEditors: async () => {
    const response = await api.get('/customer/editors');
    return response.data;
  },
};

export default api;
