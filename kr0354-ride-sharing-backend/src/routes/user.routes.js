const express = require('express');
const {
  getUserProfile,
  updateProfile,
  addSavedLocation,
  deleteSavedLocation,
  addPaymentMethod,
  deletePaymentMethod
} = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/profile')
  .get(getUserProfile)
  .put(updateProfile);

router.route('/locations')
  .post(addSavedLocation);

router.route('/locations/:id')
  .delete(deleteSavedLocation);

router.route('/payment-methods')
  .post(addPaymentMethod);

router.route('/payment-methods/:id')
  .delete(deletePaymentMethod);

module.exports = router;
