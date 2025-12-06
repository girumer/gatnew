// models/User.js (WITH ENTITLEMENTS)
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, unique: true },
    chatId: { type: Number, required: true, unique: true },
    
    // ➡️ ADDED FIELDS FOR DEPOSIT AND ENTITLEMENTS
    Wallet: { type: Number, default: 0 },
    isERMPValid: { type: Boolean, default: false },
    ermpExpiresAt: { type: Date, default: null },
    isNGATValid: { type: Boolean, default: false },
    ngatExpiresAt: { type: Date, default: null },
    lastDepositIntent: { type: String, enum: ['ERMP', 'NGAT', null], default: null },
    // ⬅️
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User; 
// You would then need to change BingoBord.findOne to User.findOne in your controller.