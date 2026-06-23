const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  mobile: {
    type: String,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'super_admin', 'master', 'tenant_user'],
    default: 'user'
  },
  profile: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  address: {
    type: Object,
    default: null
  },
  image: {
    type: String,
    default: null
  },
  tenantDb: {
    type: String,
    default: null
  },
  deletedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: null
  },
  updatedAt: {
    type: Date,
    default: null
  }
},
  {
    timestamps: true
  });

module.exports = mongoose.model('users', userSchema);



