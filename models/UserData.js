const mongoose = require('mongoose');

const UserDataSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  result: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  task: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserData', UserDataSchema);
