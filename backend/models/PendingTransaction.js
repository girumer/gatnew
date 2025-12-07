import mongoose from 'mongoose';

const pendingTransactionSchema = new mongoose.Schema({
    transactionNumber: { type: String, required: true, unique: true },
    rawMessage: { type: String, required: true },
    amount: { type: Number, required: true },
    senderPhoneNumber: { type: String }, // Phone of the person who sent the money
    createdAt: { type: Date, default: Date.now },
});

const PendingTransaction = mongoose.models.PendingTransaction || mongoose.model('PendingTransaction', pendingTransactionSchema);
export default PendingTransaction;