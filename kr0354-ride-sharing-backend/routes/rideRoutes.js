import express from 'express';
import {
  createRide,
  getRides,
  getRideById,
  updateRideStatus,
  updatePassengerStatus,
  cancelRide,
  rateRide,
  getDriverUpcomingRides
} from '../controllers/rideController.js';
import { protect, driver } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.route('/')
  .post(protect, createRide)
  .get(protect, getRides);

router.get('/driver/upcoming', protect, driver, getDriverUpcomingRides);

router.route('/:id')
  .get(protect, getRideById);

router.put('/:id/status', protect, driver, updateRideStatus);
router.put('/:id/passengers/:passengerId/status', protect, driver, updatePassengerStatus);
router.put('/:id/cancel', protect, cancelRide);
router.post('/:id/rate', protect, rateRide);

export default router;
