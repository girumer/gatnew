// controllers/transactionController.js

import Transaction from "../models/Transaction.js";
import User from '../models/User.js';
// --- Helper Functions (Private to this file, no export needed) ---
import PendingTransaction from '../models/PendingTransaction.js';
function parseTelebirrMessage(message) {
    const transactions = [];
    
    // Regex to find the amount.
    const amountMatches = [...message.matchAll(/ETB\s*([\d,.]+(?:\.\d{2})?)/gi)];

    // Regex to find transaction number.
    const transMatches = [...message.matchAll(/(?:transaction number is|transaction no is|የሂሳብ እንቅስቃሴ ቁጥርዎ)\s*([a-zA-Z0-9]+)/gi)];

    for (let i = 0; i < Math.min(amountMatches.length, transMatches.length); i++) {
        const amount = parseFloat(amountMatches[i][1].replace(/,/g, ""));
        const transactionNumber = transMatches[i][1].trim(); 

        transactions.push({ 
            type: "telebirr", 
            amount, 
            transactionNumber, 
            phoneNumber: undefined,
        });
    }

    return transactions;
}

function parseCBEMessages(message) {
    const transactions = [];

    // Broader regex for Amount 
    const amountRegex = /([\d,]+\.\d+)\s*(?:ETB|Birr|Br|ብር)/gi;
    const amountMatches = [...message.matchAll(amountRegex)];

    // Regex for CBE Txn ID. 
    const transMatches = [...message.matchAll(/(?:txn id|Txn ID|በደረሰኝ ቁ[ጠጥ]?ር)\s*([a-zA-Z0-9]+)/gi)];

    if (amountMatches.length > 0 && transMatches.length > 0) {
        const amount = parseFloat(amountMatches[0][1].replace(/,/g, "")); 
        const transactionNumber = transMatches[0][1].trim(); 
        
        transactions.push({ 
            type: "cbebirr", 
            amount, 
            transactionNumber, 
            phoneNumber: undefined, 
        });
    }

    return transactions;
}
function extractTransactionDetails(rawMessage) {
    let transactions = [];
    const cbebirrRegex = /(?:በደረሰኝ ቁ[ጠጥ]?ር|txn id|Txn ID)/i;
    const telebirrRegex = /(telebirr|ኢትዮ ቴሌኮም)/i;
    
    // Clean message once
    let message = rawMessage.replace(/[\u200B-\u200F\uFEFF\u2028\u2029\u00A0\t\r\n]+/g, ' ').trim();
    
    if (message.match(cbebirrRegex)) {
        transactions = parseCBEMessages(message);
    } else if (message.match(telebirrRegex)) {
        transactions = parseTelebirrMessage(message);
    }
    
    return transactions.length > 0 ? transactions[0] : null;
}
// NOTE: I am omitting extractTransactionDetails here since you seem to be using 
// the bank-specific parse functions (parseCBEMessages, parseTelebirrMessage) 
// inside parseTransaction. If extractTransactionDetails is actually used, keep it 
// defined as a const or function.

// --- Controller Functions (The ones that will be exposed via export default) ---

// controllers/transactionController.js

export const parseTransaction = async (req, res) => {
    try {
        const { key: originalMessage } = req.body;
        
        // 💡 CRITICAL FIX: Use the helper function and assign the result.
        // The helper 'extractTransactionDetails' returns the single transaction object or null.
        const transactionToSave = extractTransactionDetails(originalMessage);

        if (!transactionToSave) {
            // Log that parsing failed, likely due to message format
            console.warn("Parsing failed for incoming message:", originalMessage);
            return res.status(400).json({ error: "Could not parse transaction details from the message." });
        }

        // --- Rest of the logic (This looks correct now) ---

        // 1. Check both ledgers for duplicates
        const existingPendingTxn = await PendingTransaction.findOne({ 
            transactionNumber: transactionToSave.transactionNumber 
        });
        
        const existingFinalTxn = await Transaction.findOne({ 
            transactionNumber: transactionToSave.transactionNumber 
        });

        if (existingPendingTxn || existingFinalTxn) {
            console.log(`Transaction ${transactionToSave.transactionNumber} already exists. Skipping.`);
            return res.status(409).json({ error: "Transaction already exists." });
        }

        // 2. Save the new record to the PendingTransaction Model
        const newPendingTransaction = new PendingTransaction({
            amount: transactionToSave.amount,
            transactionNumber: transactionToSave.transactionNumber,
            rawMessage: originalMessage,
            // senderPhoneNumber is optional if you can't parse it reliably here
        });
        
        await newPendingTransaction.save();
        
        console.log("Transaction saved as pending:", newPendingTransaction.transactionNumber);
        
        return res.status(200).json({
            message: "Transaction received and saved as pending. Please confirm your deposit.",
            transactionNumber: newPendingTransaction.transactionNumber,
        });

    } catch (err) {
        // Log the actual error for debugging
        console.error("Critical Server Error in parseTransaction:", err.message, err.stack);
        return res.status(500).json({ error: "Server error during parsing. Check server logs." });
    }
};

export const getPendingTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({});
        res.json({ success: true, transactions });
        console.log("transaction append sucessfuly");
    } catch (err) {
        console.error("Error fetching pending transactions:", err);
        res.status(500).json({ error: "Server error" });
    }
};


// --- EXPOSE FUNCTIONS VIA DEFAULT EXPORT ---
// controllers/transactionController.js (Add this function)

const approveTransaction = async (req, res) => {
    try {
        const { transactionId, userId, entitlementType } = req.body; // Expecting these from the frontend

        // 1. Find the pending transaction
        const transaction = await Transaction.findById(transactionId);

        if (!transaction || transaction.method !== 'depositpend') {
            return res.status(404).json({ error: "Pending transaction not found." });
        }

        // 2. Find the user (using userId for simplicity, but could be phone number lookup)
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        
        // --- 3. Update User Entitlements (Business Logic) ---
        const expirationDate = new Date();
        expirationDate.setMonth(expirationDate.getMonth() + 1); // Grants access for 1 month

        const updateFields = {};
        
        if (entitlementType === 'ERMP') {
            updateFields.isERMPValid = true;
            updateFields.ermpExpiresAt = expirationDate;
        } else if (entitlementType === 'NGAT') {
            updateFields.isNGATValid = true;
            updateFields.ngatExpiresAt = expirationDate;
        } else {
            return res.status(400).json({ error: "Invalid entitlement type specified." });
        }

        await User.findByIdAndUpdate(userId, updateFields, { new: true });

        // 4. Update Transaction Status
        transaction.method = 'approved';
        await transaction.save();

        console.log(`Transaction ${transactionId} approved. User ${userId} granted ${entitlementType}.`);

        return res.status(200).json({ 
            message: `Transaction approved and ${entitlementType} entitlement granted.`,
            user: user // You might want to send the updated user object back
        });

    } catch (err) {
        console.error("Error approving transaction:", err);
        return res.status(500).json({ error: "Server error during approval." });
    }
};
// In controllers/transactionController.js

// Make sure you have the correct imports:
// import BingoBord from '../models/BingoBord.js'; 
// import Transaction from '../models/Transaction.js'; 

const depositAmount = async (req, res) => {
    try {
        let { transactionNumber, amount, type, phoneNumber, grantfor } = req.body;
        
        let finalTxnNumber = transactionNumber ? transactionNumber.trim() : null;
        let finalAmount = parseFloat(amount);
        let finalType = type ? type.toLowerCase() : null;
        let finalGrant = grantfor ? grantfor.toUpperCase() : null; // Expected: ERMP or NGAT

        // --- Step 1: Input Validation ---
        if (!finalTxnNumber || !phoneNumber || isNaN(finalAmount) || finalAmount <= 0 || !finalType || !['ERMP', 'NGAT'].includes(finalGrant)) {
            return res.status(400).json({ error: "Invalid or missing parameters. Required: ID, Amount, Type, Phone, and grantfor (ERMP/NGAT)." });
        }
        
        // --- Step 2: Price Validation ---
        const expectedAmount = finalGrant === 'ERMP' ? 300 : 200;
        if (finalAmount !== expectedAmount) {
             return res.status(400).json({ error: `Amount ${finalAmount} ETB does not match the expected price of ${expectedAmount} ETB for ${finalGrant}.` });
        }

        // --- Step 3: Find the User ---
        const user = await  User.findOne({ phoneNumber });
        if (!user) {
            return res.status(404).json({ error: "User not found. Please register or provide a valid phone number." });
        }
        
        // --- Step 4: Find and Verify the PENDING transaction ---
        // This is the core security check.
        const pendingTxn = await Transaction.findOne({
            transactionNumber: finalTxnNumber,
            method: "depositpend",
            amount: finalAmount, 
            type: finalType      
        });
        
        if (!pendingTxn) {
            return res.status(400).json({ error: "Invalid, already-claimed, or mismatching transaction details. Pending transaction not found." });
        }
        
        // --- Step 5: Grant Entitlement (The core logic) ---
        const expirationDate = new Date();
        // Add 1 year to the current date
        expirationDate.setFullYear(expirationDate.getFullYear() + 1); 

        if (finalGrant === 'ERMP') {
            user.isERMPValid = true;
            user.ermpExpiresAt = expirationDate;
        } else { // Must be NGAT based on Step 1 validation
            user.isNGATValid = true;
            user.ngatExpiresAt = expirationDate;
        }

        // --- Step 6: Update User, Mark Transaction, and Cleanup ---
        user.Wallet += finalAmount; 
        
        // 🚨 CRITICAL: Delete the PENDING transaction before creating the new COMPLETED one
        await Transaction.deleteOne({ _id: pendingTxn._id });
        
        const newTransaction = new Transaction({
            transactionNumber: finalTxnNumber,
            phoneNumber,
            amount: finalAmount,
            type: finalType,
            method: 'deposit', // Mark as COMPLETED DEPOSIT
            status: 'completed',
        });
        
        await newTransaction.save();
        await user.save(); // Save the updated user with new entitlement
        
        console.log(`User ${user.username} granted ${finalGrant}. New wallet balance: ${user.Wallet}`);
        
        res.json({
            message: `Deposit confirmed! Access to ${finalGrant} granted until ${expirationDate.toLocaleDateString()}.`,
            wallet: user.Wallet,
            expires: expirationDate,
        });

    } catch (err) {
        console.error("Deposit confirmation error:", err);
        res.status(500).json({ error: "An unexpected error occurred. Please check your inputs and try again." });
    }
};
// controllers/transactionController.js (NEW FUNCTION)

// controllers/transactionController.js (The logic for the bot's call)

export const autoDepositConfirm = async (req, res) => {
    // 🚨 ASSUMPTION: The bot sends { rawMessage, phoneNumber } 
    // And we determine the grantfor (ERMP/NGAT) from the User's lastDepositIntent
    let { rawMessage, phoneNumber } = req.body; 

    try {
        // 1. Parse Transaction details from the raw SMS
        let transactions = [];
        const cbebirrRegex = /(?:በደረሰኝ ቁ[ጠጥ]?ር|txn id|Txn ID)/i;
        const telebirrRegex = /(telebirr|ኢትዮ ቴሌኮም)/i;
        
        if (rawMessage.match(cbebirrRegex)) {
            transactions = parseCBEMessages(rawMessage);
        } else if (rawMessage.match(telebirrRegex)) {
            transactions = parseTelebirrMessage(rawMessage);
        }

        if (transactions.length === 0) {
            return res.status(400).json({ error: "Could not parse transaction details from message." });
        }
        
        const txData = transactions[0];
        const finalTxnNumber = txData.transactionNumber;
        const finalAmount = txData.amount;
        const finalType = txData.type;

        // 2. Find the User & determine grantfor
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(404).json({ error: "User not found. Please register." });
        }
        const finalGrant = user.lastDepositIntent; // Use the intent set by the user
        if (!finalGrant || !['ERMP', 'NGAT'].includes(finalGrant)) {
            return res.status(400).json({ error: "Deposit intent not set. Please select ERMP or NGAT in the bot first." });
        }
        
        // 3. Price Validation
        const expectedAmount = finalGrant === 'ERMP' ? 300 : 200;
        if (finalAmount !== expectedAmount) {
             return res.status(400).json({ error: `Amount ${finalAmount} ETB does not match the expected price of ${expectedAmount} ETB for ${finalGrant}.` });
        }

        // 4. 🚨 CORE STEP: Find and DELETE the PENDING transaction
        // Use the dedicated PendingTransaction model
        const pendingTxn = await PendingTransaction.findOneAndDelete({
            transactionNumber: finalTxnNumber,
            amount: finalAmount 
        });
        
        if (!pendingTxn) {
            // This is the error you were seeing!
            return res.status(409).json({ 
                error: "Transaction ID not found in pending list, mismatching amount, or already claimed." 
            });
        }
        
        // 5. Grant Entitlement
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1); 

        if (finalGrant === 'ERMP') {
            user.isERMPValid = true;
            user.ermpExpiresAt = expirationDate;
        } else {
            user.isNGATValid = true;
            user.ngatExpiresAt = expirationDate;
        }

        // 6. Update User and Create FINAL Transaction Record
        user.Wallet += finalAmount; 
        
        const newTransaction = new Transaction({
            transactionNumber: finalTxnNumber,
            phoneNumber,
            amount: finalAmount,
            type: finalType,
            method: 'deposit', // Final deposit
            status: 'completed',
            rawMessage: rawMessage,
        });
        
        await newTransaction.save();
        await user.save(); 
        
        console.log(`User ${user.username} granted ${finalGrant}.`);
        
        res.json({
            message: `Deposit confirmed! Access to ${finalGrant} granted until ${expirationDate.toLocaleDateString()}.`,
            wallet: user.Wallet,
            expires: expirationDate,
        });

    } catch (err) {
        console.error("Deposit confirmation error:", err);
        res.status(500).json({ error: "An unexpected error occurred." });
    }
};

// ... (remove the confusing depositAmount and approveTransaction functions) ...



// Update the export:

    // ... existing exports
     // ⬅️ NEW EXPORT

// 🌟 Don't forget to add this function to your default export in the controller file.

// --- EXPOSE FUNCTIONS VIA DEFAULT EXPORT (Add the new function) ---
