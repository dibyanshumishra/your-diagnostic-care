import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Response interceptor to handle token expiration or invalid tokens
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 && error.config.url !== '/auth/login') {
      console.error('Unauthorized access or token expired. Logging out...');
      window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default API;