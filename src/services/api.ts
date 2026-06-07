import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Default URLs
const getDebuggerHost = () => {
  return null; // Force PROD for both so sockets connect
};

const PROD_URL = 'https://editgoapp.onrender.com/api';

export let BASE_URL = PROD_URL;

// Initialize BASE_URL dynamically
export const initBaseUrl = async () => {
  // If the user manually saved a server url via the secret menu, use that
  try {
    const savedUrl = await SecureStore.getItemAsync('server_url');
    if (savedUrl) {
      BASE_URL = savedUrl;
      api.defaults.baseURL = savedUrl;
      console.log('[API] Using saved server URL:', savedUrl);
      return;
    }
  } catch (e) {
    // Ignore error
  }

  // Detect local debugger IP for local development
  const debugHost = getDebuggerHost();
  if (debugHost && __DEV__) {
    console.log('[API] Setting Dev Host URL:', debugHost);
    BASE_URL = debugHost;
    api.defaults.baseURL = debugHost;
    return;
  }

  // Default to Production API
  console.log('[API] Using Production Server:', PROD_URL);
  BASE_URL = PROD_URL;
  api.defaults.baseURL = PROD_URL;
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

  updateProfile: async (name: string, email: string) => {
    const response = await api.post('/auth/update-profile', { name, email });
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
  getMyEditorOrders: async () => {
    const response = await api.get('/orders/my-editor');
    return response.data;
  },
  getMyCustomerOrders: async () => {
    const response = await api.get('/orders/my-customer');
    return response.data;
  },
  getOrderById: async (id: string) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  processPayment: async (orderId: string, paymentId: string) => {
    const response = await api.patch(`/orders/${orderId}/status`, { isPaid: true, paymentId });
    return response.data;
  },
  uploadVideo: async (orderId: string, fileUri: string) => {
    const formData = new FormData();
    const filename = fileUri.split('/').pop() || 'video.mp4';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `video/${match[1]}` : `video/mp4`;
    
    formData.append('video', {
      uri: fileUri,
      name: filename,
      type,
    } as any);

    const response = await api.post(`/orders/${orderId}/video`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

export const ROOT_URL = BASE_URL.replace('/api', '');

export const editorService = {
  getAvailableOrders: async () => {
    const response = await api.get('/orders/available');
    return response.data;
  },
  getAssignedOrders: async () => {
    const response = await api.get('/orders/my-editor');
    return response.data;
  },
  updateOrderStatus: async (orderId: string, status: string, progress: number) => {
    const response = await api.patch(`/orders/${orderId}/status`, { status, progress });
    return response.data;
  },
  uploadPreview: async (orderId: string, fileUri: string) => {
    const formData = new FormData();
    const filename = fileUri.split('/').pop() || 'preview.mp4';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `video/${match[1]}` : `video/mp4`;
    
    formData.append('video', {
      uri: fileUri,
      name: filename,
      type,
    } as any);

    const response = await api.post(`/orders/${orderId}/previews`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  uploadFinalWork: async (orderId: string, fileUri: string) => {
    const formData = new FormData();
    const filename = fileUri.split('/').pop() || 'final.mp4';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `video/${match[1]}` : `video/mp4`;
    
    formData.append('video', {
      uri: fileUri,
      name: filename,
      type,
    } as any);

    const response = await api.post(`/orders/${orderId}/final`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  toggleOnline: async (isOnline: boolean) => {
    // This would ideally be a separate endpoint, but for now we can use a generic profile update
    const response = await api.post('/auth/update-profile', { isOnline });
    return response.data;
  },
  getSignedVideo: async (orderId: string) => {
    const response = await api.get(`/orders/${orderId}/video-signed`);
    return response.data;
  },
  cancelOrder: async (orderId: string) => {
    const response = await api.post(`/orders/${orderId}/cancel`);
    return response.data;
  },
  requestWithdrawal: async (amount: number, bankDetails?: string) => {
    const response = await api.post('/editors/withdrawals', { amount, bankDetails });
    return response.data;
  },
  getMyWithdrawals: async () => {
    const response = await api.get('/editors/withdrawals');
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
  addFunds: async (amount: number) => {
    const response = await api.post('/customer/add-funds', { amount });
    return response.data;
  },
  submitReview: async (orderId: string, rating: number, comment: string) => {
    const response = await api.post(`/orders/${orderId}/review`, { rating, comment });
    return response.data;
  },
};

export const pricingService = {
  getConfigs: async () => {
    const response = await api.get('/pricing');
    return response.data;
  },
  updateConfig: async (configData: any) => {
    const response = await api.post('/pricing/update', configData);
    return response.data;
  }
};

export const settingService = {
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },
  updateSettings: async (settings: any) => {
    const response = await api.post('/settings/update', { settings });
    return response.data;
  }
};

export default api;
