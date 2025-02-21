"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
async function forRunningSQLCommands() {
    try {
        await db_1.default.query(`
            UPDATE users 
            SET pp_cash = 0, 
                refer_tickets = 0, 
                total_purchases = 0, 
                total_referred = 0, 
                spv = 0.00;
        `);
        console.log("All user data reset to default values.");
    }
    catch (error) {
        console.error("Error executing SQL command:", error);
    }
}
forRunningSQLCommands();
