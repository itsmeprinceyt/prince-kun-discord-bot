import pool from './db';
/**
 * @brief Used for running any SQL Query
 */
async function forRunningSQLCommands() {
    try {
        
    } catch (error) {
        console.error("Error executing SQL command:", error);
    } finally {
        pool.end();
    }
}

forRunningSQLCommands();
