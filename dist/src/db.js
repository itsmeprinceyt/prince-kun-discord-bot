"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDB = initDB;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
const chalk_1 = __importDefault(require("chalk"));
const createTables_1 = require("./utility/database/createTables");
dotenv_1.default.config();
const useProd = process.env.USE_PRODUCTION_DB === 'true';
const dbConfig = {
    host: useProd ? process.env.PRODUCTION_DB_HOST : process.env.LOCAL_DB_HOST,
    port: useProd ? process.env.PRODUCTION_DB_PORT : process.env.LOCAL_DB_PORT,
    user: useProd ? process.env.PRODUCTION_DB_USER : process.env.LOCAL_DB_USER,
    password: useProd ? process.env.PRODUCTION_DB_PASS : process.env.LOCAL_DB_PASS,
    database: useProd ? process.env.PRODUCTION_DB_NAME : process.env.LOCAL_DB_NAME,
};
const pool = promise_1.default.createPool({
    ...dbConfig,
    port: Number(dbConfig.port),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
async function initDB() {
    try {
        const connection = await pool.getConnection();
        console.log(chalk_1.default.green(`[ DATABASE ] Production: ${useProd}\n[ DATABASE ] ✅ Database connected successfully!`));
        await (0, createTables_1.createTables)(pool);
        connection.release();
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}
exports.default = pool;
