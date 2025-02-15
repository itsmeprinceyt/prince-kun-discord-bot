import pool from "./db";
import moment from "moment-timezone"; // Install it with: npm install moment-timezone

async function resetDatabase() {
    try {
        console.log("[ DATABASE ] 🔍 Checking if 'registration_date' column exists...");

        // Add the column if it doesn't exist
        await pool.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS registration_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
        `);
        console.log("[ DATABASE ] ✅ 'registration_date' column is set up!");


    } catch (error) {
        console.error("[ DATABASE ] ❌ Error inserting user data:", error);
    } finally {
        process.exit();
    }
}

resetDatabase();
