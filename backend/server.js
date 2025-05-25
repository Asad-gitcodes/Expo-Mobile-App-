import express from "express"; // to create a web server.
import dotenv from "dotenv";
import { sql } from "./config/db.js"; // Imports the 'sql' object (database query client) from the './config/db.js' file.
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";

dotenv.config(); // Loads the environment variables from the .env file.

const app = express();
// const = keyword in JavaScript used to declare a constant variable. This means that the value of app cannot be reassigned once set.

app.use(rateLimiter);
app.use(express.json()); // middleware 


const PORT = process.env.PORT || 5001;
// process.env is a special object in Node.js that holds all environment variables. The PORT environment variable can be set in a .env file


//=================================================== Database =================================

// create a function - async function 
async function initDB() {
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


// Apply routes to specific endpoints
app.use("/api/transactions", transactionsRoute);  // Use the transactions route for /api/transactions
// If you need routes for other resources like products, you can define and import them similarly:
// app.use("/api/products", productsRoute);

// ============================= ensure the server starts only after the database initialization is successful. =============

initDB().then(() => {
  // Calls the 'initDB' function and waits for it to complete.
  // The .then() ensures that the server starts only after the database initialization is successful.

  app.listen(PORT, () => {
    // This is the method in the Express application instance (app).
    // It tells the application to start the web server and listen for incoming requests on the specified port (PORT).
    // The arrow function is a callback that gets executed once the server starts successfully.

    console.log(`Server is up and running on port: ${PORT}`); 
    // Logs a success message once the server has started, indicating the port number it is running on.
  });
}); // End of .then() block
// Once the database initialization is successful, the server is started by calling app.listen().
