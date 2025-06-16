"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTables = createTables;
const chalk_1 = __importDefault(require("chalk"));
/**
 * Call this function with an active MySQL pool to ensure all required tables are created.
 */
async function createTables(pool) {
    const connection = await pool.getConnection();
    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                user_id VARCHAR(20) NOT NULL PRIMARY KEY,
                pp_cash INT DEFAULT 0,
                refer_tickets INT DEFAULT 0,
                total_purchases INT DEFAULT 0,
                registration_date DATE,
                total_referred INT DEFAULT 0,
                spv DECIMAL(3,1) DEFAULT 0.0
            );
        `);
        console.log(chalk_1.default.green('[ DATABASE ] ✅ Users table is ready now!'));
    }
    catch (error) {
        console.error(chalk_1.default.red('❌ Failed to create tables:'), error);
    }
    finally {
        connection.release();
    }
}
