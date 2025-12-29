import { Router } from "express"; 
// 1. ALWAYS Put imports at the very top
import { 
    parseTransaction, 
    getPendingTransactions, 
    autoDepositConfirm,
    broadcastToAllCustomers,
    getAllTransactions  
} from '../controllers/transactionController.js'; 

const router = Router(); 

// 2. Route for SMS Forwarder
router.post("/parse-transaction", parseTransaction);

// 3. Route for Admin/Listing
router.get("/pending-transactions", getPendingTransactions);

// 4. Route for Confirmation
router.post("/auto-confirm", autoDepositConfirm);

// 5. Route for Completed (The one you were missing/misplaced)
router.get('/all-transactions', getAllTransactions);

// 6. Broadcast
router.post('/brodcatst', broadcastToAllCustomers);

export default router;