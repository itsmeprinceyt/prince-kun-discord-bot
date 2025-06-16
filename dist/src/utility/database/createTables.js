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
//==========================================================================================
/**
 * @description Incase the .csv file is imported but not showing properly then u need to rename the column to those of original column as intended which is the following. So just run this query after importing
 *
 *
 * Step 1 - Make database named under ( prince-kun )
 * Step 2 - Import the .csv file
 * Step 3 - Enter the code below to alter
    ----------------------------------------------------
        ALTER TABLE users
        CHANGE `COL 1` user_id VARCHAR(20) NOT NULL,
        CHANGE `COL 2` pp_cash INT DEFAULT 0,
        CHANGE `COL 3` refer_tickets INT DEFAULT 0,
        CHANGE `COL 4` total_purchases INT DEFAULT 0,
        CHANGE `COL 5` registration_date DATE,
        CHANGE `COL 6` total_referred INT DEFAULT 0,
        CHANGE `COL 7` spv DECIMAL(3,1) DEFAULT 0.0;
    ----------------------------------------------------
    Step 4 - Run this once because there will be invalid entry
    ----------------------------------------------------
        DELETE FROM users WHERE user_id = 'user_id';
    ----------------------------------------------------

*/ 
