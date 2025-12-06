// controllers/transactionController.js

import Transaction from "../models/Transaction.js";

// --- Helper Functions (Private to this file, no export needed) ---

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

// NOTE: I am omitting extractTransactionDetails here since you seem to be using 
// the bank-specific parse functions (parseCBEMessages, parseTelebirrMessage) 
// inside parseTransaction. If extractTransactionDetails is actually used, keep it 
// defined as a const or function.

// --- Controller Functions (The ones that will be exposed via export default) ---

const parseTransaction = async (req, res) => {
    try {
        console.log('Received request body:', req.body);
        const { key: originalMessage } = req.body;
        
        if (!originalMessage) {
            return res.status(400).json({ error: "Message is required" });
        }
        
        let message = originalMessage
            .replace(/[\u200B-\u200F\uFEFF\u2028\u2029\u00A0\t\r\n]+/g, ' ')
            .trim();
        
        console.log('Cleaned message:', message);
        
        let transactions = [];
        
        const cbebirrRegex = /(?:በደረሰኝ ቁ[ጠጥ]?ር|txn id|Txn ID)/i;
        const telebirrRegex = /(telebirr|ኢትዮ ቴሌኮም)/i;
        
        if (message.match(cbebirrRegex)) {
            console.log('Detected CBE transaction');
            transactions = parseCBEMessages(message);
        } else if (message.match(telebirrRegex)) {
            console.log('Detected Telebirr transaction');
            transactions = parseTelebirrMessage(message);
        } else {
            console.log('No supported transaction type detected');
            return res.status(400).json({ error: "Unsupported transaction type" });
        }

        console.log('Parsed transactions:', transactions);

        if (transactions.length === 0) {
            return res.status(400).json({ 
                error: "No transaction found in message. Please check the format." 
            });
        }
        
        const transactionToSave = transactions[0];

        const existingTransaction = await Transaction.findOne({ 
            transactionNumber: transactionToSave.transactionNumber 
        });
        
        if (existingTransaction) {
            console.log(`Transaction ${transactionToSave.transactionNumber} already exists. Skipping.`);
            return res.status(409).json({ error: "Transaction already exists." });
        }

        const newTransaction = new Transaction({
            amount: transactionToSave.amount,
            transactionNumber: transactionToSave.transactionNumber,
            method: "depositpend",
            type: transactionToSave.type
        });
        
        await newTransaction.save();
        
        console.log("Transaction saved as pending:", newTransaction.transactionNumber);
        
        return res.status(200).json({
            message: "Transaction received and saved as pending. Please confirm your deposit.",
            transactionNumber: newTransaction.transactionNumber,
        });

    } catch (err) {
        if (err.code === 11000) {
            console.log(`Duplicate transaction encountered: ${err.message}`);
            return res.status(409).json({ error: "Transaction already exists." });
        }
        console.error("Server error:", err);
        return res.status(500).json({ error: "Server error" });
    }
};

const getPendingTransactions = async (req, res) => {
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
        const user = await BingoBord.findOne({ phoneNumber });
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

const autoDepositConfirm = async (req, res) => {
    try {
        // We only expect the raw message and the user's identifier
        const { rawMessage, phoneNumber } = req.body;
        
        if (!rawMessage || !phoneNumber) {
            return res.status(400).json({ error: "Missing required fields: message and phone number." });
        }

        // 1. Find the User and Check Intent
        const user = await BingoBord.findOne({ phoneNumber });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        
        const finalGrant = user.lastDepositIntent;
        if (!finalGrant) {
            return res.status(400).json({ error: "Upgrade intention not set. Please select an upgrade option via the bot menu." });
        }
        
        const expectedAmount = finalGrant === 'ERMP' ? 300 : 200;

        // 2. Parse the Message (using the same logic as before)
        let transactions = [];
        let finalType = ''; 
        let cleanedMessage = rawMessage.replace(/[\u200B-\u200F\uFEFF\u2028\u2029\u00A0\t\r\n]+/g, ' ').trim();

        const cbebirrRegex = /(?:በደረሰኝ ቁ[ጠጥ]?ር|txn id|Txn ID)/i;
        const telebirrRegex = /(telebirr|ኢትዮ ቴሌኮም)/i;
        
        if (cleanedMessage.match(cbebirrRegex)) {
            transactions = parseCBEMessages(cleanedMessage);
            finalType = 'cbebirr';
        } else if (cleanedMessage.match(telebirrRegex)) {
            transactions = parseTelebirrMessage(cleanedMessage);
            finalType = 'telebirr';
        }

        if (transactions.length === 0) {
            return res.status(400).json({ error: "Could not extract transaction details." });
        }

        const parsedTxn = transactions[0];
        
        // 3. Final Validation
        if (parsedTxn.amount !== expectedAmount) {
            // Clear the intent if it fails validation
            user.lastDepositIntent = null;
            await user.save(); 
            return res.status(400).json({ error: `Amount mismatch: expected ${expectedAmount} ETB for ${finalGrant}, found ${parsedTxn.amount} ETB.` });
        }

        // 4. Check for Duplicates (Crucial Security Check)
        const existingTxn = await Transaction.findOne({ transactionNumber: parsedTxn.transactionNumber });
        if (existingTxn) {
            return res.status(409).json({ error: "Transaction ID already processed." });
        }

        // 5. Grant Entitlement and Save
        const expirationDate = new Date();
        expirationDate.setFullYear(expirationDate.getFullYear() + 1); 

        if (finalGrant === 'ERMP') {
            user.isERMPValid = true;
            user.ermpExpiresAt = expirationDate;
        } else {
            user.isNGATValid = true;
            user.ngatExpiresAt = expirationDate;
        }

        user.Wallet += parsedTxn.amount;
        user.lastDepositIntent = null; // Clear the intent after successful grant
        await user.save();

        // 6. Log Transaction
        const newTransaction = new Transaction({
            transactionNumber: parsedTxn.transactionNumber,
            phoneNumber: user.phoneNumber,
            amount: parsedTxn.amount,
            type: finalType,
            method: 'deposit',
            status: 'completed',
            rawMessage: rawMessage
        });
        await newTransaction.save();
        
        // 7. Success Response
        return res.status(200).json({
            message: `Access granted for ${finalGrant}`,
            grantfor: finalGrant,
            transactionNumber: parsedTxn.transactionNumber,
            expires: expirationDate
        });

    } catch (err) {
        console.error("Auto-deposit confirmation error:", err);
        return res.status(500).json({ error: "Internal server error during auto-confirmation." });
    }
};

// Update the export:

    // ... existing exports
     // ⬅️ NEW EXPORT

// 🌟 Don't forget to add this function to your default export in the controller file.

// --- EXPOSE FUNCTIONS VIA DEFAULT EXPORT (Add the new function) ---
export default {
    parseTransaction,
    getPendingTransactions,
    approveTransaction, // <--- NEWLY ADDED
    depositAmount,
    autoDepositConfirm,
};