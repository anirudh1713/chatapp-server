const mongoose = require('mongoose');

const utils = require('../utils/utils');

const messageSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  content: {
    type: String,
    required: [true, utils.isRequiredMessage('Message content')]
  },
  flag: {
    type: String,
    enum: ['forwarded'],
    default: null
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'group',
    required: [true, utils.isRequiredMessage('Group')]
  },
  origin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'message'
  },
  stackholders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }]
});

const Message = mongoose.model('message', messageSchema);

module.exports = Message;