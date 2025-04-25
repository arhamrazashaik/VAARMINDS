const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  savedLocations: {
    type: [
      {
        name: {
          type: String,
          required: true
        },
        address: {
          type: String,
          required: true
        },
        coords: {
          lat: {
            type: Number,
            required: true
          },
          lng: {
            type: Number,
            required: true
          }
        }
      }
    ],
    default: []
  },
  paymentMethods: {
    type: [
      {
        type: {
          type: String,
          enum: ['credit_card', 'debit_card', 'upi', 'wallet'],
          required: true
        },
        last4: String,
        brand: String,
        isDefault: {
          type: Boolean,
          default: false
        }
      }
    ],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
UserSchema.methods.getSignedJwtToken = function() {
  try {
    // Default to 30 days if JWT_EXPIRE is not set or invalid
    const expiresIn = process.env.JWT_EXPIRE || '30d';

    return jwt.sign(
      { id: this._id },
      process.env.JWT_SECRET || 'kr0354_ride_sharing_secret_key',
      { expiresIn }
    );
  } catch (error) {
    console.error('JWT token generation error:', error);
    // Fallback to a simple token with 30 days expiration
    return jwt.sign(
      { id: this._id },
      'kr0354_ride_sharing_secret_key',
      { expiresIn: '30d' }
    );
  }
};

// Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
