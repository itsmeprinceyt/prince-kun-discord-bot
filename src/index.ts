import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";

import commands from "./commandHandler";
import msgCommands from "./msgCommandHandler";
import deployCommands from "./deployCommands";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent 
    ]
});

client.on("ready", async (c) => {
    console.log(`[ ${c.user.username} ] 💚 IS ONLINE !`);
    await deployCommands();
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: "[ ERROR ] There was an error executing this command!",
            ephemeral: true,
        });
    }
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const content = message.content.toLowerCase();
    const command = msgCommands.get(content);
    
    if (command) {
        try {
            await command.execute(message);
        } catch (error) {
            console.error(error);
            await message.reply("⚠️ Error executing command!");
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
