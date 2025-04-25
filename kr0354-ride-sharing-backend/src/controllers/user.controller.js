const User = require('../models/user.model');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;

    // Build update object
    const updateFields = {};
    if (name) updateFields.name = name;
    if (phoneNumber) updateFields.phoneNumber = phoneNumber;

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Add saved location
// @route   POST /api/users/locations
// @access  Private
exports.addSavedLocation = async (req, res) => {
  try {
    const { name, address, coords } = req.body;

    // Validate input
    if (!name || !address || !coords || !coords.lat || !coords.lng) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const user = await User.findById(req.user.id);

    // Add new location
    user.savedLocations.push({
      name,
      address,
      coords
    });

    await user.save();

    res.status(200).json({
      success: true,
      data: user.savedLocations
    });
  } catch (error) {
    console.error('Add saved location error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete saved location
// @route   DELETE /api/users/locations/:id
// @access  Private
exports.deleteSavedLocation = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Find location index
    const locationIndex = user.savedLocations.findIndex(
      location => location._id.toString() === req.params.id
    );

    if (locationIndex === -1) {
      return res.status(404).json({ success: false, message: 'Location not found' });
    }

    // Remove location
    user.savedLocations.splice(locationIndex, 1);
    await user.save();

    res.status(200).json({
      success: true,
      data: user.savedLocations
    });
  } catch (error) {
    console.error('Delete saved location error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Add payment method
// @route   POST /api/users/payment-methods
// @access  Private
exports.addPaymentMethod = async (req, res) => {
  try {
    const { type, last4, brand } = req.body;

    // Validate input
    if (!type || !last4 || !brand) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const user = await User.findById(req.user.id);

    // Check if this is the first payment method
    const isDefault = user.paymentMethods.length === 0;

    // Add new payment method
    user.paymentMethods.push({
      type,
      last4,
      brand,
      isDefault
    });

    await user.save();

    res.status(200).json({
      success: true,
      data: user.paymentMethods
    });
  } catch (error) {
    console.error('Add payment method error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete payment method
// @route   DELETE /api/users/payment-methods/:id
// @access  Private
exports.deletePaymentMethod = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Find payment method index
    const paymentIndex = user.paymentMethods.findIndex(
      payment => payment._id.toString() === req.params.id
    );

    if (paymentIndex === -1) {
      return res.status(404).json({ success: false, message: 'Payment method not found' });
    }

    // Check if it's the default payment method
    const isDefault = user.paymentMethods[paymentIndex].isDefault;

    // Remove payment method
    user.paymentMethods.splice(paymentIndex, 1);

    // If it was the default and there are other payment methods, set a new default
    if (isDefault && user.paymentMethods.length > 0) {
      user.paymentMethods[0].isDefault = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user.paymentMethods
    });
  } catch (error) {
    console.error('Delete payment method error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
