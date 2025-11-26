// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
   
    trim: true
  },
 phoneNumber: {
    type: String,
    required: true,
    unique: true // prevents duplicate phone numbers
  },
  chatId: {
    type: Number,
    required: true,
    unique: true // ensures one record per Telegram chat
  }
});

const User = mongoose.model('User', userSchema);
export default User;
