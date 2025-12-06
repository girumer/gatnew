// routes/transaction.js

import { Router } from "express"; // 1. Import Router from Express
const router = Router();            // 2. Initialize the router object

import transactionController from '../controllers/transactionController.js'; 


// parse SMS (existing)
router.post("/parse-transaction", transactionController.parseTransaction);
router.get("/pending-transactions", transactionController.getPendingTransactions);
router.post("/deposit-confirm", transactionController.depositAmount);
router.post("/auto-confirm", transactionController.autoDepositConfirm);
// If you implemented the approve route:
// router.post("/approve-transaction", transactionController.approveTransaction); 

export default router;