import pool from './db'; // Assuming 'pool' is your MySQL connection pool.

async function checkSystemTimezone() {
    try {
        const [rows]: any = await pool.query("SELECT @@system_time_zone AS system_timezone");

        console.log("[ DATABASE ] ✅ System Timezone Info:");
        console.log(`🖥️ System Timezone: ${rows[0].system_timezone}`);
    } catch (error) {
        console.error("[ DATABASE ] ❌ Error fetching system timezone info:", error);
    } finally {
        process.exit();
    }
}

checkSystemTimezone();
