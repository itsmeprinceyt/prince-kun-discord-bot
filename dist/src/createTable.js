"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
async function resetDatabase() {
    try {
        console.log("[ DATABASE ] 🔍 Checking if 'registration_date' column exists...");
        // Add the column if it doesn't exist
        await db_1.default.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS registration_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
        `);
        console.log("[ DATABASE ] ✅ 'registration_date' column is set up!");
    }
    catch (error) {
        console.error("[ DATABASE ] ❌ Error inserting user data:", error);
    }
    finally {
        process.exit();
    }
}
resetDatabase();
