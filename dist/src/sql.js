"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db")); // Assuming 'pool' is your MySQL connection pool.
async function checkSystemTimezone() {
    try {
        const [rows] = await db_1.default.query("SELECT @@system_time_zone AS system_timezone");
        console.log("[ DATABASE ] ✅ System Timezone Info:");
        console.log(`🖥️ System Timezone: ${rows[0].system_timezone}`);
    }
    catch (error) {
        console.error("[ DATABASE ] ❌ Error fetching system timezone info:", error);
    }
    finally {
        process.exit();
    }
}
checkSystemTimezone();
