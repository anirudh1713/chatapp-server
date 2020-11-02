const mongoose = require('mongoose');

const utils = require('../utils/utils');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, utils.isRequiredMessage('Name')],
    trim: true
  },
  email: {
    type: String,
    required: [true, utils.isRequiredMessage('Email')],
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: [true, utils.isRequiredMessage('Password')]
  },
  avatar: {
    type: String
  }
}, {
  timestamps: true
});

userSchema.post('save', function(error, doc, next) {
  if(error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Email is already in use.'));
  }else {
    next();
  }
});

const User = mongoose.model('user', userSchema);

module.exports = User;