"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db")); // Ensure this points to your database connection
async function resetDatabase() {
    try {
        console.log("[ DATABASE ] 🔥 Dropping all tables...");
        // Get all table names
        const [tables] = await db_1.default.query("SHOW TABLES");
        if (tables.length > 0) {
            for (const table of tables) {
                const tableName = Object.values(table)[0];
                console.log(`[ DATABASE ] ❌ Dropping table: ${tableName}`);
                await db_1.default.query(`DROP TABLE IF EXISTS \`${tableName}\``);
            }
        }
        else {
            console.log("[ DATABASE ] ℹ️ No tables found.");
        }
        console.log("[ DATABASE ] ✅ All tables dropped!");
        // Create the users table
        console.log("[ DATABASE ] 🏗️ Creating users table...");
        const createTableQuery = `
            CREATE TABLE users (
                user_id VARCHAR(255) PRIMARY KEY,
                pp_cash INT DEFAULT 0,
                refer_tickets INT DEFAULT 0,
                total_purchases INT DEFAULT 0
            );
        `;
        await db_1.default.query(createTableQuery);
        console.log("[ DATABASE ] ✅ Users table created successfully!");
    }
    catch (error) {
        console.error("[ DATABASE ] ❌ Error resetting database:", error);
    }
    finally {
        process.exit();
    }
}
resetDatabase();
