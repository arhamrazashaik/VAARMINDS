import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addSavedLocation,
  addPaymentMethod,
  getUsers
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', registerUser);
router.post('/login', loginUser);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.post('/locations', protect, addSavedLocation);
router.post('/payment-methods', protect, addPaymentMethod);

// Admin routes
router.get('/', protect, admin, getUsers);

export default router;
