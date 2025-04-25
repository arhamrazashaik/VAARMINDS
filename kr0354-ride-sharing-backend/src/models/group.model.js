const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a group name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  type: {
    type: String,
    enum: ['work', 'education', 'leisure', 'other'],
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      role: {
        type: String,
        enum: ['admin', 'member'],
        default: 'member'
      },
      joinedAt: {
        type: Date,
        default: Date.now
      }
    }
  ],
  commonRoutes: [
    {
      name: {
        type: String,
        required: true
      },
      startLocation: {
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
      },
      endLocation: {
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
    }
  ],
  isPublic: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Group', GroupSchema);
