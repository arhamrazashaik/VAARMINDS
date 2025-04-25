import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
// Mock socket for now since we don't have a real backend
const socket = {
  auth: {},
  connected: false,
  connect: () => console.log('Socket connected'),
  disconnect: () => console.log('Socket disconnected'),
  emit: (event, data) => console.log(`Socket emitted ${event}:`, data)
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await axios.get('http://localhost:5000/api/users/profile');
          setUser(res.data);
          setIsAuthenticated(true);

          // Connect socket.io
          socket.auth = { token };
          socket.connect();

          // Join user's personal room
          socket.emit('join-user', res.data._id);
        } catch (err) {
          console.error('Error loading user:', err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);
          setError('Session expired. Please login again.');
        }
      }
      setLoading(false);
    };

    loadUser();

    // Cleanup socket connection on unmount
    return () => {
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [token]);

  // Register user
  const register = async (formData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/users', formData);

      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data);
      setIsAuthenticated(true);
      setLoading(false);
      setError(null);

      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', { email, password });

      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data);
      setIsAuthenticated(true);
      setLoading(false);
      setError(null);

      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
      return { success: false, error: err.response?.data?.message || 'Invalid credentials' };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);

    // Disconnect socket
    if (socket.connected) {
      socket.disconnect();
    }
  };

  // Update user profile
  const updateProfile = async (formData) => {
    try {
      const res = await axios.put('http://localhost:5000/api/users/profile', formData);

      setUser(res.data);
      setError(null);

      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      return { success: false, error: err.response?.data?.message || 'Failed to update profile' };
    }
  };

  // Add saved location
  const addSavedLocation = async (locationData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/locations', locationData);

      setUser({
        ...user,
        savedLocations: res.data
      });

      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add location');
      return { success: false, error: err.response?.data?.message || 'Failed to add location' };
    }
  };

  // Add payment method
  const addPaymentMethod = async (paymentData) => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/payment-methods', paymentData);

      setUser({
        ...user,
        paymentMethods: res.data
      });

      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add payment method');
      return { success: false, error: err.response?.data?.message || 'Failed to add payment method' };
    }
  };

  // Clear errors
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        addSavedLocation,
        addPaymentMethod,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
