const express = require('express');
const {
  createRide,
  getRides,
  getRide,
  updateRideStatus,
  joinRide,
  calculateFare
} = require('../controllers/ride.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.route('/calculate-fare')
  .post(calculateFare);

// Protect all other routes
router.use(protect);

router.route('/')
  .get(getRides)
  .post(createRide);

router.route('/:id')
  .get(getRide);

router.route('/:id/status')
  .put(updateRideStatus);

router.route('/:id/join')
  .post(joinRide);

module.exports = router;
