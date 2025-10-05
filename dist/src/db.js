"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDB = initDB;
exports.getPool = getPool;
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
const initialConfig = {
    host: dbConfig.host,
    port: Number(dbConfig.port),
    user: dbConfig.user,
    password: dbConfig.password,
};
let pool;
async function initDB() {
    try {
        const initialConnection = await promise_1.default.createConnection(initialConfig);
        const [rows] = await initialConnection.execute(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`, [dbConfig.database]);
        const databaseExists = Array.isArray(rows) && rows.length > 0;
        if (!databaseExists) {
            console.log(chalk_1.default.yellow(`[ DATABASE ] Database '${dbConfig.database}' not found. Creating...`));
            await initialConnection.execute(`CREATE DATABASE \`${dbConfig.database}\``);
            console.log(chalk_1.default.green(`[ DATABASE ] Database '${dbConfig.database}' created successfully!`));
        }
        else {
            console.log(chalk_1.default.blue(`[ DATABASE ] Database '${dbConfig.database}' already exists.`));
        }
        await initialConnection.end();
        pool = promise_1.default.createPool({
            ...dbConfig,
            port: Number(dbConfig.port),
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });
        const testConnection = await pool.getConnection();
        console.log(chalk_1.default.green(`[ DATABASE ] Production: ${useProd}\n[ DATABASE ] ✅ Database connected successfully!`));
        await (0, createTables_1.createTables)(pool);
        testConnection.release();
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}
function getPool() {
    if (!pool) {
        throw new Error('Database pool not initialized. Call initDB() first.');
    }
    return pool;
}
exports.default = getPool;
