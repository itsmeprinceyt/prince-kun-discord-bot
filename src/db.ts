import mysql, { Pool } from 'mysql2/promise';
import dotenv from 'dotenv';
import chalk from 'chalk';
import { createTables } from './utility/database/createTables';

dotenv.config();

const useProd: boolean = process.env.USE_PRODUCTION_DB === 'true';

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

let pool: Pool;

export async function initDB(): Promise<void> {
    try {
        const initialConnection = await mysql.createConnection(initialConfig);
        const [rows] = await initialConnection.execute(
            `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?`,
            [dbConfig.database]
        );

        const databaseExists = Array.isArray(rows) && rows.length > 0;

        if (!databaseExists) {
            console.log(chalk.yellow(`[ DATABASE ] Database '${dbConfig.database}' not found. Creating...`));
            await initialConnection.execute(`CREATE DATABASE \`${dbConfig.database}\``);
            console.log(chalk.green(`[ DATABASE ] Database '${dbConfig.database}' created successfully!`));
        } else {
            console.log(chalk.blue(`[ DATABASE ] Database '${dbConfig.database}' already exists.`));
        }

        await initialConnection.end();

        pool = mysql.createPool({
            ...dbConfig,
            port: Number(dbConfig.port),
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
        });

        const testConnection = await pool.getConnection();

        console.log(
            chalk.green(
                `[ DATABASE ] Production: ${useProd}\n[ DATABASE ] ✅ Database connected successfully!`
            )
        );

        await createTables(pool);

        testConnection.release();

    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}

export function getPool(): Pool {
    if (!pool) {
        throw new Error('Database pool not initialized. Call initDB() first.');
    }
    return pool;
}

export default getPool;