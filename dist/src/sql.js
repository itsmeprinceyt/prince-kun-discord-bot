"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db")); // Assuming 'pool' is your MySQL connection pool.
async function addTotalReferredColumn() {
    await db_1.default.query("ALTER TABLE users ADD COLUMN total_referred INT DEFAULT 0");
    console.log("[ DATABASE ] ✅ Column 'total_referred' added successfully.");
}
addTotalReferredColumn();
