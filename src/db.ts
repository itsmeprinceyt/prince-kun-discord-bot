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

const pool: Pool = mysql.createPool({
    ...dbConfig,
    port: Number(dbConfig.port),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export async function initDB(): Promise<void> {
    try {
        const connection = await pool.getConnection();

        console.log(
            chalk.green(
                `[ DATABASE ] Production: ${useProd}\n[ DATABASE ] ✅ Database connected successfully!`
            )
        );

        await createTables(pool);

        connection.release();
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}

export default pool;
