import axios from 'axios';

// Android emulator uses:
// http://10.0.2.2:5000/api
// Physical phone uses:
// http://YOUR_COMPUTER_LAN_IP:5000/api
// Keep this value easy to change when switching devices.
const API_BASE_URL = 'http://10.0.2.2:5000/api';

let authToken;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    if (authToken) {
      config.headers.Authorization = `Bearer ${authToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export const setApiToken = (token) => {
  authToken = token;
};

export const clearApiToken = () => {
  authToken = undefined;
};

export const getApiError = (error, message) => {
  return error.response?.data || { error: message };
};

export const cleanParams = (filters = {}) => {
  const params = {};

  Object.keys(filters).forEach((key) => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
      params[key] = filters[key];
    }
  });

  return params;
};

export default api;
