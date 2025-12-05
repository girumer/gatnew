// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  phoneNumber: { type: String, required: true, unique: true },
  chatId: { type: Number, required: true, unique: true },

  // entitlement fields (simple)
  isERMPValid: { type: Boolean, default: false },
  ermpExpiresAt: { type: Date, default: null },

  isNGATValid: { type: Boolean, default: false },
  ngatExpiresAt: { type: Date, default: null }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
