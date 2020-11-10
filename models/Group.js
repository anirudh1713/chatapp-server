const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    default: null
  },
  type: {
    type: String,
    enum: ['personal', 'group'],
    default: 'personal'
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }]
});

const Group = mongoose.model('group', groupSchema);

module.exports = Group;