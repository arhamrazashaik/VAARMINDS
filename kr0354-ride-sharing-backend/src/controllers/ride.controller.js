const Ride = require('../models/ride.model');
const User = require('../models/user.model');

// Base rates for different vehicle types (per km)
const vehicleRates = {
  'Bike': 10,
  'Auto': 15,
  'Sedan': 20,
  'SUV': 25,
  'Tempo': 30,
  'Bus': 40
};

// Base fare (minimum fare)
const baseFare = {
  'Bike': 50,
  'Auto': 80,
  'Sedan': 100,
  'SUV': 150,
  'Tempo': 200,
  'Bus': 300
};

// @desc    Create a new ride
// @route   POST /api/rides
// @access  Private
exports.createRide = async (req, res) => {
  try {
    const {
      type,
      vehicleType,
      pickupLocation,
      destination,
      scheduledTime,
      distance,
      duration,
      fare
    } = req.body;

    // Validate input
    if (!type || !vehicleType || !pickupLocation || !destination || !scheduledTime || !distance || !duration || !fare) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Create ride
    const ride = await Ride.create({
      driver: req.user.id,
      type,
      vehicleType,
      pickupLocation,
      passengers: [
        {
          user: req.user.id,
          dropoffLocation: destination,
          fare
        }
      ],
      scheduledTime,
      distance,
      duration,
      totalFare: fare
    });

    res.status(201).json({
      success: true,
      data: ride
    });
  } catch (error) {
    console.error('Create ride error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all rides
// @route   GET /api/rides
// @access  Private
exports.getRides = async (req, res) => {
  try {
    // Build query
    let query = {};

    // Filter by status
    if (req.query.status) {
      const statuses = req.query.status.split(',');
      query.status = { $in: statuses };
    }

    // Filter by date
    if (req.query.from) {
      query.scheduledTime = { $gte: new Date(req.query.from) };
    }

    // Filter by user (as driver or passenger)
    query.$or = [
      { driver: req.user.id },
      { 'passengers.user': req.user.id }
    ];

    const rides = await Ride.find(query)
      .populate('driver', 'name email phoneNumber')
      .populate('passengers.user', 'name email phoneNumber')
      .sort({ scheduledTime: 1 });

    res.status(200).json({
      success: true,
      count: rides.length,
      data: rides
    });
  } catch (error) {
    console.error('Get rides error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single ride
// @route   GET /api/rides/:id
// @access  Private
exports.getRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id)
      .populate('driver', 'name email phoneNumber')
      .populate('passengers.user', 'name email phoneNumber');

    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }

    // Check if user is driver or passenger
    const isDriver = ride.driver._id.toString() === req.user.id;
    const isPassenger = ride.passengers.some(p => p.user._id.toString() === req.user.id);

    if (!isDriver && !isPassenger) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this ride' });
    }

    res.status(200).json({
      success: true,
      data: ride
    });
  } catch (error) {
    console.error('Get ride error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update ride status
// @route   PUT /api/rides/:id/status
// @access  Private
exports.updateRideStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Please provide status' });
    }

    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }

    // Check if user is driver
    if (ride.driver.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Only the driver can update ride status' });
    }

    // Update status
    ride.status = status;
    await ride.save();

    res.status(200).json({
      success: true,
      data: ride
    });
  } catch (error) {
    console.error('Update ride status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Join a ride as passenger
// @route   POST /api/rides/:id/join
// @access  Private
exports.joinRide = async (req, res) => {
  try {
    const { dropoffLocation, fare } = req.body;

    if (!dropoffLocation || !fare) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({ success: false, message: 'Ride not found' });
    }

    // Check if ride is full
    if (ride.vehicleType === 'Bike' && ride.passengers.length >= 1) {
      return res.status(400).json({ success: false, message: 'Ride is full' });
    } else if (ride.vehicleType === 'Auto' && ride.passengers.length >= 3) {
      return res.status(400).json({ success: false, message: 'Ride is full' });
    } else if (ride.vehicleType === 'Sedan' && ride.passengers.length >= 4) {
      return res.status(400).json({ success: false, message: 'Ride is full' });
    } else if (ride.vehicleType === 'SUV' && ride.passengers.length >= 6) {
      return res.status(400).json({ success: false, message: 'Ride is full' });
    } else if (ride.vehicleType === 'Tempo' && ride.passengers.length >= 8) {
      return res.status(400).json({ success: false, message: 'Ride is full' });
    } else if (ride.vehicleType === 'Bus' && ride.passengers.length >= 20) {
      return res.status(400).json({ success: false, message: 'Ride is full' });
    }

    // Check if user is already a passenger
    if (ride.passengers.some(p => p.user.toString() === req.user.id)) {
      return res.status(400).json({ success: false, message: 'You are already a passenger in this ride' });
    }

    // Add passenger
    ride.passengers.push({
      user: req.user.id,
      dropoffLocation,
      fare,
      status: 'pending'
    });

    // Update total fare
    ride.totalFare += fare;

    await ride.save();

    res.status(200).json({
      success: true,
      data: ride
    });
  } catch (error) {
    console.error('Join ride error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Calculate fare
// @route   POST /api/rides/calculate-fare
// @access  Public
exports.calculateFare = async (req, res) => {
  try {
    const { distance, vehicleType, passengers } = req.body;

    if (!distance || !vehicleType) {
      return res.status(400).json({ success: false, message: 'Please provide distance and vehicle type' });
    }

    // Calculate fare based on distance and vehicle type
    const rate = vehicleRates[vehicleType];
    const minFare = baseFare[vehicleType];
    const calculatedFare = Math.max(minFare, Math.round(distance * rate));

    // Calculate per person fare if passengers are provided
    const perPersonFare = passengers ? Math.round(calculatedFare / passengers) : calculatedFare;

    // Calculate estimated duration (assuming average speed of 30 km/h)
    const duration = Math.ceil(distance * 2); // minutes

    res.status(200).json({
      success: true,
      data: {
        distance,
        duration,
        fare: calculatedFare,
        perPersonFare,
        vehicleType
      }
    });
  } catch (error) {
    console.error('Calculate fare error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
