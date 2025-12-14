// models/Transaction.js

import mongoose from "mongoose"; // 1. Use import for ES Modules

const transactionSchema = new mongoose.Schema({
    transactionNumber: { type: String, required: true, unique: true },

    depositId: { type: Number, unique: true, sparse: true },
    phoneNumber: { type: String, required: true, default: "UNKNOWN" },
    
    // Note: Removed "referral_bonus" as it wasn't in your original, 
    // but ensured "deposit" and "depositpend" are there.
    method: { type: String, enum: ["deposit", "depositpend"], required: true },
    amount: { type: Number, required: true },
    
    // Note: Added "bonus" to the enum list as suggested in your comment
    type: { type: String, enum: ["telebirr", "cbebirr", "bonus"], required: true },
    rawMessage: { type: String },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
});

// 2. Add the Mongoose existence check to prevent OverwriteModelError
const Transaction = mongoose.models.Transaction || mongoose.model("Transaction", transactionSchema);

export default Transaction; // 3. Use export default for ES Modules