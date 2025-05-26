import { neon } from "@neondatabase/serverless"; // Import the 'neon' function from the Neon database package
import "dotenv/config"; // Load environment variables from the .env file

// Initialize the connection using the correct environment variable and the 'neon' client
export const sql = neon(process.env.DATABASE_URL); // Use 'DATABASE_URL' instead of 'DATABASW_URL'

//=================================================== Database =================================

// create a function - async function 
export async function initDB() {
  // Creates an asynchronous function 'initDB' to initialize the database.
  // This function will handle database setup, specifically creating a table if it doesn't already exist.

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS transactions ( 
        id SERIAL PRIMARY KEY, -- Creates an auto-incrementing 'id' column and sets it as the primary key.
        user_id VARCHAR(255) NOT NULL, -- Creates a 'user_id' column that is a non-null string (VARCHAR).
        title VARCHAR(255) NOT NULL, -- Creates a 'title' column for transaction titles, ensuring it is non-null.
        amount DECIMAL(10, 2) NOT NULL, -- Creates an 'amount' column to store monetary values, making it non-null with 2 decimal places.
        category VARCHAR(255) NOT NULL, -- Creates a 'category' column for transaction categories, ensuring it is non-null.
        created_at DATE NOT NULL DEFAULT CURRENT_DATE -- Creates a 'created_at' column with a default value of the current date.
      )
    `;
    // This SQL query ensures that if the 'transactions' table does not exist, it will be created with the defined columns.
    // It uses the SQL `CREATE TABLE IF NOT EXISTS` statement to avoid errors if the table already exists.

    console.log("Database initialized successfully"); 
    // Logs a success message to the console after the database table is successfully created.
  } catch (error) {
    console.log("Error initializing DB", error); 
    // If an error occurs during the table creation process, this message will log the error to the console.
    process.exit(1); // Exits the process with a failure status code (1) in case of an error.
    // This ensures the application doesn't start running if the database setup fails.
  }
}
