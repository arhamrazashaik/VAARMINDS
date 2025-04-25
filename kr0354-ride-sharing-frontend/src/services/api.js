import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token
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

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log the error for debugging
    console.error('API Error:', error.response?.data || error.message);

    // Handle specific error status codes
    if (error.response) {
      const { status, data } = error.response;

      // Handle 401 Unauthorized errors - but only if not on login/register page
      if (status === 401 &&
          !window.location.pathname.includes('/login') &&
          !window.location.pathname.includes('/register')) {
        // Clear token and redirect to login
        localStorage.removeItem('token');

        // Add a query parameter to show an error message
        window.location.href = '/login?session=expired';
        return Promise.reject(new Error('Session expired. Please login again.'));
      }

      // Handle 400 Bad Request errors
      if (status === 400) {
        return Promise.reject(new Error(data.message || 'Invalid request'));
      }

      // Handle 500 Server errors
      if (status >= 500) {
        return Promise.reject(new Error('Server error. Please try again later.'));
      }
    }

    // Handle network errors
    if (error.request && !error.response) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me')
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  addSavedLocation: (locationData) => api.post('/users/locations', locationData),
  deleteSavedLocation: (id) => api.delete(`/users/locations/${id}`),
  addPaymentMethod: (paymentData) => api.post('/users/payment-methods', paymentData),
  deletePaymentMethod: (id) => api.delete(`/users/payment-methods/${id}`)
};

// Ride API
export const rideAPI = {
  getRides: (params) => api.get('/rides', { params }),
  getRide: (id) => api.get(`/rides/${id}`),
  createRide: (rideData) => api.post('/rides', rideData),
  updateRideStatus: (id, status) => api.put(`/rides/${id}/status`, { status }),
  joinRide: (id, data) => api.post(`/rides/${id}/join`, data),
  calculateFare: (data) => api.post('/rides/calculate-fare', data)
};

// Group API
export const groupAPI = {
  getGroups: (params) => api.get('/groups', { params }),
  getGroup: (id) => api.get(`/groups/${id}`),
  createGroup: (groupData) => api.post('/groups', groupData),
  updateGroup: (id, groupData) => api.put(`/groups/${id}`, groupData),
  joinGroup: (id) => api.post(`/groups/${id}/join`),
  leaveGroup: (id) => api.delete(`/groups/${id}/leave`)
};

export default api;
