import pool from './db'; // Assuming 'pool' is your MySQL connection pool.

async function addTotalReferredColumn() {
    
        await pool.query("ALTER TABLE users ADD COLUMN total_referred INT DEFAULT 0");
        console.log("[ DATABASE ] ✅ Column 'total_referred' added successfully.");
    
}

addTotalReferredColumn();
