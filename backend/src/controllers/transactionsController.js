import { sql } from "../config/db.js"; // Imports the 'sql' object (database query client) from the './config/db.js' file.

export async function getTransactionsByUserId(req, res) { 
  try {
    const { userID } = req.params; // Extracts 'userID' from the URL parameters.
    const transactions = await sql`SELECT * FROM transactions WHERE user_id = ${userID} ORDER BY created_at DESC`;
    res.status(200).json(transactions);  // Respond with a list of transactions
  } catch (error) {
    console.log("Error getting the transactions", error); 
    res.status(500).json({ message: "Internal server error" });  // Respond with an error if something goes wrong
  }
}
    
export async function createTransaction (req, res)  {
  try {
    // Destructure the required fields from the request body
    const { title, amount, category, user_id } = req.body;

    // Basic validation to check if all required fields are provided
    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Insert the new transaction into the 'transactions' table
    const transaction = await sql`
      INSERT INTO transactions(user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *`;  // The 'RETURNING *' returns the inserted transaction including the 'id'

    console.log(transaction); // Log the created transaction

    res.status(201).json(transaction[0]);  // Respond with the created transaction
  } catch (error) {
    console.log("Error creating the transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteTransaction (req, res) {
  try {
    const { id } = req.params;

    // Check if the provided ID is a valid number
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    // Attempt to delete the transaction from the database
    const result = await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`;

    // If no rows were deleted, return a 404 error
    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.log("Error deleting the transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


export async function getSummaryByUserID (req, res) {
  try {
    const { userId } = req.params;

    // Get the user's total balance (sum of all amounts)
    const balanceResult = await sql`SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}`;

    // Get the user's total income (sum of positive amounts)
    const incomeResult = await sql`SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0`;

    // Get the user's total expenses (sum of negative amounts)
    const expensesResult = await sql`SELECT COALESCE(SUM(amount), 0) as expense FROM transactions WHERE user_id = ${userId} AND amount < 0`;

    // Return the balance, income, and expenses in the response
    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expense
    });
  } catch (error) {
    console.log("Error getting the summary", error);
    res.status(500).json({ message: "Internal server error" });
  }
}