import getPool from './db';
/**
 * @brief Used for running any SQL Query
 */
async function forRunningSQLCommands() {
    const pool = getPool();
    try {
        
    } catch (error) {
        console.error("Error executing SQL command:", error);
    } finally {
        pool.end();
    }
}

forRunningSQLCommands();
