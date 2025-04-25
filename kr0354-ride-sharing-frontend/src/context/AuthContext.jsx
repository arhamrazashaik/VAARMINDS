import { createContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import io from 'socket.io-client';

// Socket.io connection
const socket = io('http://localhost:5000', {
  autoConnect: false
});

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user if token exists
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');

      if (storedToken) {
        try {
          // Get user data from API
          const response = await authAPI.getMe();
          const userData = response.data.data;

          setUser(userData);
          setToken(storedToken); // Ensure token state matches localStorage
          setIsAuthenticated(true);

          // Connect socket.io
          socket.auth = { token: storedToken };
          socket.connect();

          // Join user's personal room
          socket.emit('join-user', userData._id);
        } catch (err) {
          console.error('Error loading user:', err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);

          // Don't show error message on initial load
          if (err.response && err.response.status !== 401) {
            setError('Session expired. Please login again.');
          }
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
  }, []);

  // Register user
  const register = async (formData) => {
    try {
      const response = await authAPI.register(formData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      setLoading(false);
      setError(null);

      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      setLoading(false);
      setError(null);

      // Connect socket
      socket.auth = { token };
      socket.connect();

      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Invalid credentials';
      setError(errorMessage);
      return { success: false, error: errorMessage };
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
      // Use mock backend instead of axios
      const userData = await mockBackend.updateProfile(token, formData);

      setUser(userData);
      setError(null);

      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      return { success: false, error: err.message || 'Failed to update profile' };
    }
  };

  // Add saved location
  const addSavedLocation = async (locationData) => {
    try {
      // Use mock backend instead of axios
      const savedLocations = await mockBackend.addSavedLocation(token, locationData);

      setUser({
        ...user,
        savedLocations
      });

      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to add location');
      return { success: false, error: err.message || 'Failed to add location' };
    }
  };

  // Add payment method
  const addPaymentMethod = async (paymentData) => {
    try {
      // Use mock backend instead of axios
      const paymentMethods = await mockBackend.addPaymentMethod(token, paymentData);

      setUser({
        ...user,
        paymentMethods
      });

      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to add payment method');
      return { success: false, error: err.message || 'Failed to add payment method' };
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
