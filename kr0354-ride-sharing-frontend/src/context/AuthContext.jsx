import { createContext, useState, useEffect } from 'react';
import mockBackend from '../services/mockBackend';

// Mock socket for development
const socket = {
  auth: {},
  connected: false,
  connect: () => { console.log('Mock socket connected'); },
  disconnect: () => { console.log('Mock socket disconnected'); },
  emit: (event, data) => { console.log(`Mock socket emit: ${event}`, data); }
};

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
          // Get user data from mock backend
          const userData = await mockBackend.getUserProfile(storedToken);

          setUser(userData);
          setToken(storedToken); // Ensure token state matches localStorage
          setIsAuthenticated(true);

          // Connect mock socket
          socket.auth = { token: storedToken };
          socket.connect();

          // Join user's personal room
          socket.emit('join-user', userData.id);
        } catch (err) {
          console.error('Error loading user:', err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setIsAuthenticated(false);

          // Don't show error message on initial load
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
  }, []);

  // Register user
  const register = async (formData) => {
    try {
      const userData = await mockBackend.register(formData);

      localStorage.setItem('token', userData.token);
      setToken(userData.token);
      setUser(userData);
      setIsAuthenticated(true);
      setLoading(false);
      setError(null);

      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const userData = await mockBackend.login(email, password);

      localStorage.setItem('token', userData.token);
      setToken(userData.token);
      setUser(userData);
      setIsAuthenticated(true);
      setLoading(false);
      setError(null);

      // Connect mock socket
      socket.auth = { token: userData.token };
      socket.connect();

      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'Invalid credentials';
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
      // Use mock backend
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
      // Use mock backend
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
      // Use mock backend
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
