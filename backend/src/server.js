import express from "express"; // to create a web server.
import dotenv from "dotenv";
import { initDB } from "./config/db.js"; // Imports the 'sql' object (database query client) from the './config/db.js' file.
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoute from "./routes/transactionsRoute.js";

dotenv.config(); // Loads the environment variables from the .env file.

const app = express();
// const = keyword in JavaScript used to declare a constant variable. This means that the value of app cannot be reassigned once set.

app.use(rateLimiter);
app.use(express.json()); // middleware 


const PORT = process.env.PORT || 5001;
// process.env is a special object in Node.js that holds all environment variables. The PORT environment variable can be set in a .env file




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
