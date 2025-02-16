"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
async function forRunningSQLCommands() {
    try {
        await db_1.default.query(`
            CREATE TABLE IF NOT EXISTS youtube_channels (
                id INT AUTO_INCREMENT PRIMARY KEY,
                youtube_id VARCHAR(50) NOT NULL,
                discord_channel_id VARCHAR(50) NOT NULL,
                last_video_id VARCHAR(50) DEFAULT NULL,
                UNIQUE KEY (youtube_id)
            );
        `);
        console.log("Table 'youtube_channels' created successfully.");
    }
    catch (error) {
        console.error("Error creating table:", error);
    }
}
forRunningSQLCommands();
