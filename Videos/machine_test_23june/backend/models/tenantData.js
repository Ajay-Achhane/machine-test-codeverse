const mongoose = require('mongoose');

const tenantDataSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = tenantDataSchema;
