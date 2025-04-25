import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Route imports
import userRoutes from './routes/userRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import rideRoutes from './routes/rideRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ride-sharing');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Routes
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/payments', paymentRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('KR0354 - Group Ride Sharing Platform API is running');
});

// Socket.io event handlers
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // Join a ride room
  socket.on('join-ride', (rideId) => {
    socket.join(`ride-${rideId}`);
    console.log(`User ${socket.id} joined ride-${rideId}`);
  });
  
  // Join a group chat
  socket.on('join-group-chat', (groupId) => {
    socket.join(`group-${groupId}`);
    console.log(`User ${socket.id} joined group-${groupId}`);
  });
  
  // Location update
  socket.on('location-update', (data) => {
    io.to(`ride-${data.rideId}`).emit('driver-location', {
      location: data.location,
      rideId: data.rideId
    });
  });
  
  // Group chat message
  socket.on('group-message', (data) => {
    io.to(`group-${data.groupId}`).emit('new-message', {
      sender: data.sender,
      message: data.message,
      timestamp: new Date()
    });
  });
  
  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});

export { io };
