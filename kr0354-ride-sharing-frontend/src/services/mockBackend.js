// Mock backend service for authentication
// This simulates API calls to a backend server

// Mock user database
const users = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    phoneNumber: '1234567890',
    savedLocations: [
      { id: '1', name: 'Home', address: '123 Main St, Anytown', coords: { lat: 28.6129, lng: 77.2295 } },
      { id: '2', name: 'Work', address: '456 Office Park, Business District', coords: { lat: 28.5355, lng: 77.2410 } }
    ],
    paymentMethods: [
      { id: '1', type: 'credit_card', last4: '4242', brand: 'Visa', isDefault: true }
    ],
    createdAt: new Date().toISOString()
  }
];

// Generate a token - simple format for easy validation
const generateToken = (userId) => {
  return `token-${userId}`;
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API endpoints
const mockBackend = {
  // Register a new user
  register: async (userData) => {
    await delay(800); // Simulate network delay

    // Check if email already exists
    const existingUser = users.find(user => user.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password, // In a real app, this would be hashed
      phoneNumber: userData.phoneNumber,
      savedLocations: [],
      paymentMethods: [],
      createdAt: new Date().toISOString()
    };

    users.push(newUser);

    // Generate token
    const token = generateToken(newUser.id);

    // Return user data and token (excluding password)
    const { password, ...userWithoutPassword } = newUser;
    return {
      ...userWithoutPassword,
      token
    };
  },

  // Login user
  login: async (email, password) => {
    await delay(800); // Simulate network delay

    // Find user by email
    const user = users.find(user => user.email === email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    if (user.password !== password) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user data and token (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      token
    };
  },

  // Get user profile
  getUserProfile: async (token) => {
    await delay(500); // Simulate network delay

    try {
      // Simple token validation - just check if it starts with "token-"
      if (!token || !token.startsWith('token-')) {
        throw new Error('Invalid token format');
      }

      // Extract user ID from token (everything after "token-")
      const userId = token.substring(6);

      // Find user by ID
      const user = users.find(user => user.id === userId);
      if (!user) {
        throw new Error('User not found');
      }

      console.log('User found:', user.name);

      // Return user data (excluding password)
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Error in getUserProfile:', error);
      throw new Error('Session expired. Please login again.');
    }
  },

  // Update user profile
  updateProfile: async (token, userData) => {
    await delay(800); // Simulate network delay

    // Simple token validation
    if (!token || !token.startsWith('token-')) {
      throw new Error('Invalid token format');
    }

    // Extract user ID from token
    const userId = token.substring(6);

    // Find user by ID
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      ...userData,
      // Don't update these fields from the request
      id: users[userIndex].id,
      email: users[userIndex].email,
      createdAt: users[userIndex].createdAt
    };

    // Return updated user data (excluding password)
    const { password, ...userWithoutPassword } = users[userIndex];
    return userWithoutPassword;
  },

  // Add saved location
  addSavedLocation: async (token, locationData) => {
    await delay(500); // Simulate network delay

    // Simple token validation
    if (!token || !token.startsWith('token-')) {
      throw new Error('Invalid token format');
    }

    // Extract user ID from token
    const userId = token.substring(6);

    // Find user by ID
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Add new location
    const newLocation = {
      id: (users[userIndex].savedLocations.length + 1).toString(),
      ...locationData
    };

    users[userIndex].savedLocations.push(newLocation);

    // Return all saved locations
    return users[userIndex].savedLocations;
  },

  // Add payment method
  addPaymentMethod: async (token, paymentData) => {
    await delay(500); // Simulate network delay

    // Simple token validation
    if (!token || !token.startsWith('token-')) {
      throw new Error('Invalid token format');
    }

    // Extract user ID from token
    const userId = token.substring(6);

    // Find user by ID
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    // Add new payment method
    const newPaymentMethod = {
      id: (users[userIndex].paymentMethods.length + 1).toString(),
      ...paymentData,
      isDefault: users[userIndex].paymentMethods.length === 0 // First payment method is default
    };

    users[userIndex].paymentMethods.push(newPaymentMethod);

    // Return all payment methods
    return users[userIndex].paymentMethods;
  }
};

export default mockBackend;
