"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
/**
 * @brief Used for running any SQL Query
 */
async function forRunningSQLCommands() {
    try {
    }
    catch (error) {
        console.error("Error executing SQL command:", error);
    }
    finally {
        db_1.default.end();
    }
}
forRunningSQLCommands();
