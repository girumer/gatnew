// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  phoneNumber: {
    type: String,
    required: true,
    match: /^[0-9]{10,15}$/ // basic validation for phone numbers
  }
});

module.exports = mongoose.model('User', userSchema);
