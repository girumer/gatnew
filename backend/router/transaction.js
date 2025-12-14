// router/transaction.js

import { Router } from "express"; 
const router = Router();            

// ❌ DELETE THIS LINE (It is trying to access a non-existent 'default' export)
// import transactionController from '../controllers/transactionController.js';
 
// ... other routes ...

router.get('/all-transactions', getAllTransactions);
// ✅ KEEP ONLY THIS LINE (The Correct Named Import)
import { 
    parseTransaction, 
    getPendingTransactions, 
    autoDepositConfirm,
    broadcastToAllCustomers,
    getAllTransactions  
} from '../controllers/transactionController.js'; 


// 1. Route for SMS Forwarder (Saves to PendingTransaction)
router.post("/parse-transaction", parseTransaction);

// 2. Route for Admin/Listing (Retrieves pending transactions)
router.get("/pending-transactions", getPendingTransactions);

// 3. Route for Telegram Bot/Auto Confirmation (Deletes Pending, Creates Final)
router.post("/auto-confirm", autoDepositConfirm);
router.get('/all-transactions', getAllTransactions);
router.post('/brodcatst',broadcastToAllCustomers);
export default router;