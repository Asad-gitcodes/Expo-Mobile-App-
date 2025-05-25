import { neon } from "@neondatabase/serverless"; // Import the 'neon' function from the Neon database package
import "dotenv/config"; // Load environment variables from the .env file

// Initialize the connection using the correct environment variable and the 'neon' client
export const sql = neon(process.env.DATABASE_URL); // Use 'DATABASE_URL' instead of 'DATABASW_URL'
