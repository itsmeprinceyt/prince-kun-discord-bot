import pool from './db';

async function forRunningSQLCommands() {
    try {
        await pool.query(`
            UPDATE users 
            SET pp_cash = 0, 
                refer_tickets = 0, 
                total_purchases = 0, 
                total_referred = 0, 
                spv = 0.00;
        `);
        console.log("All user data reset to default values.");
    } catch (error) {
        console.error("Error executing SQL command:", error);
    }
}

forRunningSQLCommands();
