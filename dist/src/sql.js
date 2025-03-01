"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
async function forRunningSQLCommands() {
    try {
        await db_1.default.query("DROP TABLE IF EXISTS youtube_channels;");
        console.log("Table 'youtube_channels' has been dropped.");
    }
    catch (error) {
        console.error("Error executing SQL command:", error);
    }
    finally {
        db_1.default.end(); // Close the database connection
    }
}
forRunningSQLCommands();
