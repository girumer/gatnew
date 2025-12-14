import mongoose from 'mongoose';

const pendingTransactionSchema = new mongoose.Schema({
    transactionNumber: { type: String, required: true, unique: true },
    rawMessage: { type: String, required: true },
    amount: { type: Number, required: true },
    senderPhoneNumber: { type: String },
    type: { 
        type: String, 
        enum: ["telebirr", "cbebirr"], 
        required: true // Must be set when saving
    }, 
    method: { 
        type: String, 
        enum: ["depositpend"], // Only value needed for pending items
        default: "depositpend" // Automatically sets the value
    }, // Phone of the person who sent the money
    createdAt: { type: Date, default: Date.now },
});

const PendingTransaction = mongoose.models.PendingTransaction || mongoose.model('PendingTransaction', pendingTransactionSchema);
export default PendingTransaction;