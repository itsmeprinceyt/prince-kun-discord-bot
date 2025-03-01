import pool from './db';

async function forRunningSQLCommands() {
    try {
        await pool.query("DROP TABLE IF EXISTS youtube_channels;");
        console.log("Table 'youtube_channels' has been dropped.");
    } catch (error) {
        console.error("Error executing SQL command:", error);
    } finally {
        pool.end(); // Close the database connection
    }
}

forRunningSQLCommands();
