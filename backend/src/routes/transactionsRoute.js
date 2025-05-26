import express from "express";

import {createTransaction, deleteTransaction, getSummaryByUserID, getTransactionsByUserId} from "../controllers/transactionsController.js"
const router  = express.Router();  // Ensure to use 'route' instead of 'router' to match your variable definition

// =======================  GET Route for Transactions =======================
router.get("/:userID", getTransactionsByUserId);

// =======================  POST Route for Creating a Transaction =======================
router.post("/", createTransaction);

// =======================  DELETE Route for Deleting a Transaction =======================
router.delete("/:id", deleteTransaction);

// =======================  GET Route for Transaction Summary =======================
router.get("/summary/:userId", getSummaryByUserID );

// Export the router to use it in other parts of the application
export default router;
 