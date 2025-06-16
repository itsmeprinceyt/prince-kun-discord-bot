import { Pool } from 'mysql2/promise';
import chalk from 'chalk';

/**
 * Call this function with an active MySQL pool to ensure all required tables are created.
 */
export async function createTables(pool: Pool): Promise<void> {
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

        console.log(chalk.green('[ DATABASE ] ✅ Users table is ready now!'));
    } catch (error) {
        console.error(chalk.red('❌ Failed to create tables:'), error);
    } finally {
        connection.release();
    }
}