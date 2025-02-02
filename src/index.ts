import "dotenv/config";
import { Client } from "discord.js";

const client = new Client({
    intents: [],
})

client.on('ready',(c)=>{
    console.log(`${c.user.username} is online`)
})

client.login(process.env.DISCORD_BOT_TOKEN)